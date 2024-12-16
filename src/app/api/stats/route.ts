import { db } from "@/db/drizzle";
import { transactions } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    if (period === "price-analytics") {
      const timeframe = searchParams.get("timeframe") || "week";
      const query =
        timeframe === "month"
          ? sql`transaction_date >= CURRENT_DATE - INTERVAL '30 days'`
          : timeframe === "year"
          ? sql`transaction_date >= CURRENT_DATE - INTERVAL '1 year'`
          : sql`transaction_date >= CURRENT_DATE - INTERVAL '7 days'`;

      const priceRanges = await db.execute(sql`
        WITH price_ranges AS (
          SELECT
            CASE
              WHEN total_price < 15 THEN '< 15k'
              WHEN total_price < 20 THEN '15k-20k'
              WHEN total_price < 25 THEN '20k-25k'
              WHEN total_price < 30 THEN '25k-30k'
              ELSE '30k+'
            END as range,
            COUNT(*) as orders,
            CAST(
              (COUNT(*)::float * 100 / NULLIF(SUM(COUNT(*)) OVER(), 0)) 
              as decimal(10,1)
            ) as percentage
          FROM transactions
          WHERE ${query}
          GROUP BY 1
        )
        SELECT
          range,
          orders,
          percentage
        FROM price_ranges
        ORDER BY
          CASE range
            WHEN '< 15k' THEN 1
            WHEN '15k-20k' THEN 2
            WHEN '20k-25k' THEN 3
            WHEN '25k-30k' THEN 4
            ELSE 5
          END;
      `);

      return NextResponse.json(priceRanges.rows);
    }

    if (period === "transactions") {
      const timeframe = searchParams.get("timeframe") || "week";

      if (timeframe === "week") {
        const transactionData = await db.execute(sql`
          WITH dates AS (
            SELECT 
              generate_series(
                date_trunc('week', CURRENT_DATE),
                date_trunc('week', CURRENT_DATE) + interval '6 days',
                interval '1 day'
              ) AS date
          )
          SELECT 
            to_char(dates.date, 'Dy') as day,
            COALESCE((
              SELECT COUNT(*) 
              FROM transactions 
              WHERE date_trunc('day', transaction_date) = dates.date
            ), 0) as transactions
          FROM dates
          ORDER BY dates.date
        `);
        return NextResponse.json(transactionData.rows);
      }

      // For month and year views, generate date series
      const interval = timeframe === "month" ? "30 days" : "1 year";
      const dateFormat = timeframe === "year" ? "'Mon'" : "'DD'";

      const transactionData = await db.execute(sql`
        WITH date_range AS (
          SELECT 
            generate_series(
              date_trunc('day', CURRENT_DATE - INTERVAL '${interval}'),
              date_trunc('day', CURRENT_DATE),
              interval '1 day'
            ) AS date
        )
        SELECT 
          to_char(date_range.date, ${dateFormat}) as day,
          COALESCE((
            SELECT COUNT(*) 
            FROM transactions 
            WHERE date_trunc('day', transaction_date) = date_range.date
          ), 0) as transactions
        FROM date_range
        ORDER BY date_range.date
      `);

      return NextResponse.json(transactionData.rows);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get total orders today
    const totalOrdersToday = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(sql`DATE(transaction_date) = CURRENT_DATE`);

    // Get average order value
    const avgOrderValue = await db
      .select({ avg: sql<string>`AVG(total_price)` })
      .from(transactions);

    // Get active customers (users with transactions in last 30 days)
    const activeCustomers = await db
      .select({ count: sql<number>`COUNT(DISTINCT user_id)` })
      .from(transactions)
      .where(sql`transaction_date >= CURRENT_DATE - INTERVAL '30 days'`);

    // Get weekly transactions
    const weeklyTransactions = await db.execute(sql`
      WITH dates AS (
        SELECT 
          generate_series(
            date_trunc('week', CURRENT_DATE),
            date_trunc('week', CURRENT_DATE) + interval '6 days',
            interval '1 day'
          ) AS date
      )
      SELECT 
        to_char(dates.date, 'Dy') as day,
        COALESCE((
          SELECT COUNT(*) 
          FROM transactions 
          WHERE date_trunc('day', transaction_date) = dates.date
        ), 0) as transactions
      FROM dates
      ORDER BY dates.date
    `);

    // Get meal distribution (based on time of day)

    const result = {
      totalOrdersToday: totalOrdersToday[0]?.count || 0,
      averageOrderValue: Number(avgOrderValue[0]?.avg || 0).toFixed(2),
      activeCustomers: activeCustomers[0]?.count || 0,
      weeklyTransactions: weeklyTransactions.rows,
    };

    // Add proper headers and status
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in /api/stats route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

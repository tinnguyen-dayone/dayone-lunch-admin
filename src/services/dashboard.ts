import { db } from "@/db/drizzle";
import { transactions } from "@/db/schema";
import { sql } from "drizzle-orm";
import { DashboardStats } from "@/types/statistics";
import { formatVND } from "@/lib/utils";

export async function getDashboardStats(): Promise<DashboardStats> {
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
  const weeklyTransactions = await db
    .select({
      day: sql<string>`to_char(transaction_date, 'Dy')`,
      transactions: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(sql`transaction_date >= CURRENT_DATE - INTERVAL '7 days'`)
    .groupBy(sql`to_char(transaction_date, 'Dy')`);

  // Get meal distribution (based on time of day)
  const mealDistribution = await db
    .select({
      name: sql<string>`
          CASE 
            WHEN EXTRACT(HOUR FROM transaction_date) < 11 THEN 'Breakfast'
            WHEN EXTRACT(HOUR FROM transaction_date) < 15 THEN 'Lunch'
            ELSE 'Dinner'
          END
        `,
      value: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(sql`transaction_date >= CURRENT_DATE - INTERVAL '30 days'`)
    .groupBy(sql`
        CASE 
          WHEN EXTRACT(HOUR FROM transaction_date) < 11 THEN 'Breakfast'
          WHEN EXTRACT(HOUR FROM transaction_date) < 15 THEN 'Lunch'
          ELSE 'Dinner'
        END
      `);

  return {
    totalOrdersToday: totalOrdersToday[0]?.count || 0,
    averageOrderValue: formatVND(Number(avgOrderValue[0]?.avg || 0) * 1000),
    activeCustomers: activeCustomers[0]?.count || 0,
    weeklyTransactions,
    mealDistribution,
  };
}

export type Period = "week" | "month" | "year";

export async function getTransactionsByPeriod(period: Period) {
  const query =
    period === "week"
      ? sql`transaction_date >= CURRENT_DATE - INTERVAL '7 days'`
      : period === "month"
      ? sql`transaction_date >= CURRENT_DATE - INTERVAL '30 days'`
      : sql`transaction_date >= CURRENT_DATE - INTERVAL '1 year'`;

  const format = period === "week" ? "Dy" : period === "month" ? "DD" : "Mon";

  return db
    .select({
      day: sql<string>`to_char(transaction_date, ${format})`,
      transactions: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(query)
    .groupBy(sql`to_char(transaction_date, ${format})`)
    .orderBy(sql`min(transaction_date)`);
}

import { db } from "@/db/drizzle";
import { transactions } from "@/db/schema";
import { sql } from "drizzle-orm";
import { DashboardStats } from "@/types/statistics";
import { formatVND } from "@/lib/utils";

export async function getTotalOrdersToday() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(sql`DATE(transaction_date) = CURRENT_DATE`);

  return result[0]?.count || 0;
}

export async function getAverageOrderValue() {
  const result = await db
    .select({ avg: sql<string>`AVG(total_price)` })
    .from(transactions);

  return formatVND(Number(result[0]?.avg || 0) * 1000);
}

export async function getActiveCustomers() {
  const result = await db
    .select({ count: sql<number>`COUNT(DISTINCT user_id)` })
    .from(transactions)
    .where(sql`transaction_date >= CURRENT_DATE - INTERVAL '30 days'`);

  return result[0]?.count || 0;
}

export async function getTotalUnpaid() {
  const result = await db
    .select({ sum: sql<string>`SUM(total_price)` })
    .from(transactions)
    .where(sql`paid = false`);

  return formatVND(Number(result[0]?.sum || 0) * 1000);
}

export async function getWeeklyTransactions() {
  return db
    .select({
      day: sql<string>`to_char(transaction_date, 'Dy')`,
      transactions: sql<number>`COUNT(*)`,
    })
    .from(transactions)
    .where(sql`transaction_date >= CURRENT_DATE - INTERVAL '7 days'`)
    .groupBy(sql`to_char(transaction_date, 'Dy')`);
}

export async function getMealDistribution() {
  return db
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
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const totalOrdersToday = await getTotalOrdersToday();
  const averageOrderValue = await getAverageOrderValue();
  const activeCustomers = await getActiveCustomers();
  const totalUnpaid = await getTotalUnpaid();
  const weeklyTransactions = await getWeeklyTransactions();
  const mealDistribution = await getMealDistribution();

  return {
    totalOrdersToday,
    averageOrderValue,
    activeCustomers,
    totalUnpaid,
    weeklyTransactions,
    mealDistribution,
  };
}

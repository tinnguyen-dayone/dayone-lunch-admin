import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const unpaidUsers = await db.execute(sql`
      WITH user_stats AS (
        SELECT 
          t.user_id as id,
          MAX(u.username) as name,
          NULL as image,
          COUNT(*) as order_count,
          SUM(CASE WHEN t.paid = false THEN t.total_price ELSE 0 END) as total_unpaid,
          MAX(t.transaction_date) as last_order
        FROM transactions t
        JOIN users u ON t.user_id = u.user_id
        WHERE t.paid = false
        GROUP BY t.user_id
        HAVING SUM(CASE WHEN t.paid = false THEN t.total_price ELSE 0 END) > 0
      )
      SELECT *
      FROM user_stats
      ORDER BY total_unpaid DESC
      LIMIT 5
    `);

    return NextResponse.json(unpaidUsers.rows);
  } catch (error) {
    console.error("Error fetching unpaid users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

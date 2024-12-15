import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const userIdBigInt = BigInt(userId);

    const transactions = await db.execute(sql`
      SELECT 
        transaction_id,
        total_price,
        transaction_date,
        description
      FROM transactions 
      WHERE user_id = ${userIdBigInt}::bigint
        AND paid = false
      ORDER BY transaction_date DESC
    `);

    return NextResponse.json(transactions.rows);
  } catch (error) {
    console.error("Error fetching user unpaid transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

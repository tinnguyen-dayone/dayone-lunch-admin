import { db } from "@/db/drizzle";
import { transactions, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        transaction_id: transactions.transactionId,
        username: users.username,
        lunch_price: transactions.lunchPrice,
        total_price: transactions.totalPrice,
        transaction_image: transactions.transactionImage,
        transaction_confirmed: transactions.transactionConfirmed,
        transaction_date: transactions.transactionDate,
        paid: transactions.paid,
        ticket_message_id: transactions.ticketMessageId,
      })
      .from(transactions)
      .leftJoin(users, eq(transactions.userId, users.userId))
      .orderBy(asc(transactions.transactionId));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

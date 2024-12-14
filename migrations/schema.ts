import { pgTable, bigint, text, numeric, index, foreignKey, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).primaryKey().notNull(),
	username: text(),
	totalUnpaid: numeric("total_unpaid").default('0.0'),
});

export const transactions = pgTable("transactions", {
	transactionId: serial("transaction_id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	commentedCount: integer("commented_count").default(0),
	lunchPrice: text("lunch_price"),
	totalPrice: numeric("total_price").default('0.0'),
	transactionImage: text("transaction_image"),
	transactionConfirmed: boolean("transaction_confirmed").default(false),
	transactionDate: timestamp("transaction_date", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	paid: boolean().default(false),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ticketMessageId: bigint("ticket_message_id", { mode: "number" }),
	description: text(),
}, (table) => [
	index("idx_transactions_paid").using("btree", table.paid.asc().nullsLast().op("bool_ops")),
	index("idx_transactions_user_id").using("btree", table.userId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "transactions_user_id_fkey"
		}),
]);

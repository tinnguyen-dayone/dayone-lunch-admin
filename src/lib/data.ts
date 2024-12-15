import { Transaction } from "@/types/transaction";
import { User } from "@/types/user";

export type TimeFrame = "week" | "month" | "year";

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch("/api/transactions");
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function fetchTransactionStats(timeframe: TimeFrame) {
  try {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const response = await fetch(
      `${origin}/api/stats?period=transactions&timeframe=${timeframe}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch transaction stats: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    return [];
  }
}

export async function fetchPriceAnalytics(timeframe: TimeFrame) {
  try {
    const response = await fetch(
      `/api/stats?period=price-analytics&timeframe=${timeframe}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch price analytics: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching price analytics:", error);
    return [];
  }
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const userResults = await fetch(`/api/users`);

    if (!userResults.ok) {
      throw new Error(`Failed to fetch users: ${userResults.statusText}`);
    }
    const data = await userResults.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function fetchUnpaidUsers() {
  try {
    const response = await fetch(`/api/users/unpaid`);

    if (!response.ok) {
      throw new Error(`Failed to fetch unpaid users: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching unpaid users:", error);
    return [];
  }
}

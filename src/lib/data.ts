import { Transaction } from "@/types/transaction";
import { User } from "@/types/user";

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

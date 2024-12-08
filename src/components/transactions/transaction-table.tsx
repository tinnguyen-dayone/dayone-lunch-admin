"use client";

import { fetchTransactions } from "@/lib/data";
import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { TableSkeleton } from "./table-skeleton";
import { columns } from "./columns";

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  if (loading) {
    return <TableSkeleton />;
  }

  return <DataTable columns={columns} data={transactions} />;
}

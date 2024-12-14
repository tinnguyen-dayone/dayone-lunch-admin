"use client";

import { fetchTransactions } from "@/lib/data";
import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { TableSkeleton } from "./table-skeleton";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

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

  const handleDescriptionClick = (description: string) => {
    setSelectedDescription(description);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={transactions}
        meta={{ onDescriptionClick: handleDescriptionClick }}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Description</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{selectedDescription}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}

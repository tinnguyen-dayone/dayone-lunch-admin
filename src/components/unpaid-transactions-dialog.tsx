import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatVND } from "@/lib/utils";
import { useState } from "react";

interface UnpaidTransaction {
  transaction_id: number;
  total_price: number;
  transaction_date: string;
  description: string;
}

interface Props {
  userId: string;
  userName: string;
}

export function UnpaidTransactionsDialog({ userId, userName }: Props) {
  const [transactions, setTransactions] = useState<UnpaidTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/unpaid`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = transactions.reduce((sum, t) => {
    // Convert total_price from string or number to number
    const price =
      typeof t.total_price === "string"
        ? parseFloat(t.total_price)
        : t.total_price;
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <Dialog onOpenChange={(open) => open && fetchTransactions()}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="px-2 py-1 h-auto bg-muted font-normal hover:bg-muted"
        >
          View More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{userName}&apos;s Unpaid Transactions</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-4 text-center">Loading...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DATE</TableHead>
                  <TableHead>DESCRIPTION</TableHead>
                  <TableHead className="text-right">AMOUNT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell>
                      {new Date(
                        transaction.transaction_date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {transaction.description || "No description"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatVND(transaction.total_price * 1000)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-bold">
                    Total:
                  </TableCell>
                  <TableCell className="text-right font-bold text-red-600">
                    {formatVND(total * 1000)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

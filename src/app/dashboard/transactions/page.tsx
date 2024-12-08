import { TransactionTable } from "@/components/transactions/transaction-table";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-5">Lunch Transaction Dashboard</h1>
      <TransactionTable />
    </div>
  );
}

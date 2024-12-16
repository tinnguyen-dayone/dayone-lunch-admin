export interface DashboardStats {
  totalOrdersToday: number;
  averageOrderValue: string; // Changed from number to string since it's pre-formatted
  activeCustomers: number;
  totalUnpaid: string; // Add this new field
  weeklyTransactions: { day: string; transactions: number }[];
  mealDistribution: { name: string; value: number }[];
}

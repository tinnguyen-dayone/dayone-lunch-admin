import { Transaction } from "@/types/transaction";

export async function fetchTransactions(): Promise<Transaction[]> {
  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real application, you would fetch this data from an API or database
  const transactions: Transaction[] = [
    {
      transaction_id: 1,
      user_id: 101,
      commented_count: 2,
      lunch_price: "$10.99",
      total_price: 21.98,
      transaction_image: "https://example.com/image1.jpg",
      transaction_confirmed: true,
      transaction_date: new Date("2023-06-01"),
      paid: true,
      ticket_message_id: 1001,
    },
    {
      transaction_id: 2,
      user_id: 102,
      commented_count: 1,
      lunch_price: "$12.50",
      total_price: 12.5,
      transaction_image: "https://example.com/image2.jpg",
      transaction_confirmed: false,
      transaction_date: new Date("2023-06-02"),
      paid: false,
      ticket_message_id: 1002,
    },
    // Add more mock data as needed
  ];

  return transactions;
}

export interface Transaction {
  transaction_id: number;
  user_id: number;
  commented_count: number;
  lunch_price: string;
  total_price: number;
  transaction_image: string;
  transaction_confirmed: boolean;
  transaction_date: Date;
  paid: boolean;
  ticket_message_id: number;
  username: string;
}

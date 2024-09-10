export interface PaidOrder {
  orderId: string;
  paymentId: string;
  totalPaid: number;
  currency: string;
}

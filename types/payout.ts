export interface Payout {
  payoutId: string;
  applicationId: string;
  sellerId: string;
  sellerName: string;
  payoutAmount: number;
  scheduledPayoutDate: string;
  payoutBankName: string;
  status: "scheduled" | "processing" | "completed" | "failed";
}

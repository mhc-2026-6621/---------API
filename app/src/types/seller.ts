export interface Seller {
  id: string;
  name: string;
  certified: boolean;
  riskGrade: "A" | "B" | "C" | "D";
  address: string;
  contactName: string;
  payoutBankName: string;
  payoutStatus: "active" | "pending" | "suspended";
}

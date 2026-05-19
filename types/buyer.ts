export type AnnualRevenueRange =
  | "under_50m"
  | "50m_100m"
  | "100m_300m"
  | "300m_1b"
  | "1b_over";

export type EmployeeRange =
  | "under_5"
  | "5_20"
  | "20_50"
  | "50_100"
  | "100_over";

export interface Buyer {
  corporateNumber: string;
  companyName: string;
  representativeName: string;
  industry: string;
  establishedYear: number;
  annualRevenueRange: AnnualRevenueRange;
  employeeRange: EmployeeRange;
  headOfficeAddress: string;
  installationAddress: string;
}

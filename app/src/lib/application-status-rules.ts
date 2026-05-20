import { ApplicationStatus } from "@/types";

export const TIMELINE_STEPS = [
  "quote_created",
  "pre_screening_submitted",
  "pre_approved",
  "formal_review",
  "contract_pending",
  "delivered",
  "seller_paid",
  "billing_started",
  "matured",
];

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "quote_created",
  "pre_screening_submitted",
  "pre_approved",
  "manual_review",
  "formal_review",
  "approved",
  "rejected",
  "contract_pending",
  "contracted",
  "delivered",
  "accepted",
  "seller_paid",
  "billing_started",
  "matured",
];

export const ALLOWED_STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  quote_created: ["pre_screening_submitted"],
  pre_screening_submitted: ["pre_approved", "manual_review", "rejected"],
  pre_approved: ["manual_review", "formal_review", "approved", "rejected"],
  manual_review: ["formal_review", "approved", "rejected"],
  formal_review: ["approved", "rejected", "contract_pending"],
  approved: ["contract_pending", "contracted"],
  rejected: [],
  contract_pending: ["contracted", "delivered"],
  contracted: ["delivered", "accepted"],
  delivered: ["accepted"],
  accepted: ["seller_paid"],
  seller_paid: ["billing_started"],
  billing_started: ["matured"],
  matured: [],
};

export const SCREENING_ACTION_STATUSES: ApplicationStatus[] = ["manual_review", "formal_review", "approved", "rejected"];

export const STATUS_TO_TIMELINE_STEP: Record<ApplicationStatus, string> = {
  quote_created: "quote_created",
  pre_screening_submitted: "pre_screening_submitted",
  pre_approved: "pre_approved",
  manual_review: "pre_approved",
  formal_review: "formal_review",
  approved: "contract_pending",
  rejected: "pre_approved",
  contract_pending: "contract_pending",
  contracted: "delivered",
  delivered: "delivered",
  accepted: "seller_paid",
  seller_paid: "billing_started",
  billing_started: "billing_started",
  matured: "matured",
};

export function isApplicationStatus(status: string): status is ApplicationStatus {
  return APPLICATION_STATUSES.includes(status as ApplicationStatus);
}

export function canTransitionStatus(currentStatus: ApplicationStatus, nextStatus: ApplicationStatus) {
  return ALLOWED_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
}

export function getAllowedScreeningActions(currentStatus: ApplicationStatus) {
  return ALLOWED_STATUS_TRANSITIONS[currentStatus].filter((status) => SCREENING_ACTION_STATUSES.includes(status));
}
import { Application, ApplicationStatus, Asset, Payout, QuoteResponse } from "@/types";
import { Seller } from "@/types";
import { Buyer } from "@/types";
import { initialAssets } from "./assets";
import { initialSellers } from "./sellers";
import { initialBuyers } from "./buyers";
import { initialApplications } from "./applications";
import { canTransitionStatus, isApplicationStatus, STATUS_TO_TIMELINE_STEP, TIMELINE_STEPS } from "@/lib/application-status-rules";

function nextActionFor(status: ApplicationStatus) {
  switch (status) {
    case "manual_review":
      return "追加書類の提出をお待ちください。担当者から連絡いたします。";
    case "formal_review":
      return "本審査結果をお待ちください。";
    case "approved":
    case "contract_pending":
      return "電子契約の手続きを進めてください。";
    case "contracted":
    case "delivered":
      return "納品後、検収完了を記録してください。";
    case "accepted":
      return "ファイナンス管理者が販売店支払を実行します。";
    case "seller_paid":
      return "販売店支払が完了しました。月額請求開始をお待ちください。";
    case "billing_started":
      return "月額請求が開始されています。";
    case "matured":
      return "契約満了処理が完了しています。";
    case "rejected":
      return "今回の条件では対応が難しい状況です。条件変更をご検討ください。";
    default:
      return "本審査書類をアップロードしてください。";
  }
}

class DataStore {
  assets: Asset[];
  sellers: Seller[];
  buyers: Buyer[];
  applications: Application[];
  quotes: QuoteResponse[];

  constructor() {
    this.assets = [...initialAssets];
    this.sellers = [...initialSellers];
    this.buyers = [...initialBuyers];
    this.applications = [...initialApplications];
    this.quotes = [];
  }

  getAssets(filters?: { category?: string; minPrice?: number; maxPrice?: number }) {
    let result = this.assets;
    if (filters?.category) result = result.filter((a) => a.category === filters.category);
    if (filters?.minPrice) result = result.filter((a) => a.price >= filters.minPrice!);
    if (filters?.maxPrice) result = result.filter((a) => a.price <= filters.maxPrice!);
    return result;
  }

  getAsset(id: string) {
    return this.assets.find((a) => a.id === id);
  }

  getSeller(id: string) {
    return this.sellers.find((s) => s.id === id);
  }

  addQuote(quote: QuoteResponse) {
    this.quotes.push(quote);
  }

  addApplication(app: Application) {
    this.applications.push(app);
  }

  getApplication(id: string) {
    return this.applications.find((a) => a.applicationId === id);
  }

  getApplications() {
    return this.applications;
  }

  updateApplicationStatus(id: string, newStatus: string, adminMemo?: string) {
    const app = this.applications.find((a) => a.applicationId === id);
    if (!app) return { ok: false as const, error: "not_found", message: "Application not found" };
    if (!isApplicationStatus(newStatus)) {
      return { ok: false as const, error: "invalid_status", message: `Invalid application status: ${newStatus}` };
    }
    if (!canTransitionStatus(app.status, newStatus)) {
      return {
        ok: false as const,
        error: "invalid_transition",
        message: `Cannot transition application from ${app.status} to ${newStatus}`,
        currentStatus: app.status,
      };
    }

    const previousStatus = app.status;
    app.status = newStatus;
    if (adminMemo !== undefined) app.adminMemo = adminMemo;
    app.nextAction = nextActionFor(newStatus);

    const targetStep = STATUS_TO_TIMELINE_STEP[newStatus];
    const targetIndex = TIMELINE_STEPS.indexOf(targetStep);

    app.timeline = app.timeline.map((step) => {
      const stepIndex = TIMELINE_STEPS.indexOf(step.step);
      if (stepIndex < targetIndex) {
        return { ...step, status: "completed", completedAt: step.completedAt || new Date().toISOString() };
      }
      if (stepIndex === targetIndex) {
        return { ...step, status: newStatus === "rejected" ? "blocked" : "current", completedAt: null };
      }
      return { ...step, status: "pending", completedAt: null };
    });

    return {
      ok: true as const,
      data: { applicationId: id, previousStatus, newStatus: app.status, updatedAt: new Date().toISOString(), adminMemo: app.adminMemo, timeline: app.timeline },
    };
  }

  setPayout(applicationId: string, payout: Payout) {
    const app = this.applications.find((a) => a.applicationId === applicationId);
    if (!app) return null;
    app.payout = payout;
    return app;
  }
}

const globalStore = globalThis as unknown as { __dataStore?: DataStore };
if (!globalStore.__dataStore) {
  globalStore.__dataStore = new DataStore();
}

export const dataStore: DataStore = globalStore.__dataStore;

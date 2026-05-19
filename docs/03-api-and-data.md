# 設計書 3/3 ─ API設計・データモデル・ロジック・モックデータ

> **本書はPoC用プロトタイプの設計書です。本番システムの設計書ではありません。**
>
> 作成日: 2026-05-14
> バージョン: 0.1.0

**関連ドキュメント：**
- [01-overview.md](01-overview.md) … 概要・技術スタック・方針
- [02-screens.md](02-screens.md) … 画面設計・画面遷移・コンポーネント設計
- [folder-structure.md](folder-structure.md) … フォルダ構成・ファイル命名

---

## 1. API一覧

| # | Method | Endpoint | 概要 | 画面 |
|---|--------|----------|------|------|
| 1 | GET | `/api/assets` | アセット一覧取得 | 商品一覧 |
| 2 | GET | `/api/assets/{assetId}` | アセット詳細取得 | 商品詳細 |
| 3 | POST | `/api/finance/quotes` | 月額試算 | 商品詳細 |
| 4 | POST | `/api/applications` | 仮審査申込 | 申込画面 |
| 5 | GET | `/api/applications/{applicationId}` | 申込詳細取得 | 申込詳細 |
| 6 | PATCH | `/api/applications/{applicationId}/status` | ステータス変更 | 管理者DB |
| 7 | POST | `/api/acceptance` | 検収完了 | 申込詳細 |
| 8 | POST | `/api/payouts` | 販売店支払 | 管理者DB |

---

## 2. API詳細

### 2.1 GET /api/assets

**概要：** アセット一覧を返す

**クエリパラメータ：**

| パラメータ | 型 | 必須 | 説明 |
|-----------|---|------|------|
| category | string | No | カテゴリフィルター |
| minPrice | number | No | 最低価格 |
| maxPrice | number | No | 最高価格 |
| status | string | No | ステータスフィルター |

**レスポンス (200)：**

```json
{
  "assets": [
    {
      "id": "asset_001",
      "name": "中古油圧ショベル 0.25m3",
      "category": "used_construction_equipment",
      "categoryLabel": "中古建機",
      "maker": "Sample Heavy Industries",
      "model": "EX-120",
      "serialNumber": "SN-EX120-2019-001",
      "year": 2019,
      "usageHours": 3240,
      "conditionGrade": "B+",
      "location": "千葉県市原市",
      "price": 12800000,
      "taxIncluded": true,
      "sellerId": "seller_001",
      "sellerName": "関東建機販売株式会社",
      "financeAvailable": true,
      "financeStatus": "instant_quote",
      "estimatedMonthlyPayment": 245000,
      "thumbnailUrl": null
    }
  ],
  "total": 4
}
```

### 2.2 GET /api/assets/{assetId}

**概要：** アセット詳細を返す

**レスポンス (200)：**

```json
{
  "id": "asset_001",
  "name": "中古油圧ショベル 0.25m3",
  "category": "used_construction_equipment",
  "categoryLabel": "中古建機",
  "maker": "Sample Heavy Industries",
  "model": "EX-120",
  "serialNumber": "SN-EX120-2019-001",
  "year": 2019,
  "usageHours": 3240,
  "conditionGrade": "B+",
  "location": "千葉県市原市",
  "price": 12800000,
  "taxIncluded": true,
  "sellerId": "seller_001",
  "sellerName": "関東建機販売株式会社",
  "financeAvailable": true,
  "financeStatus": "instant_quote",
  "estimatedMonthlyPayment": 245000,
  "inspectionReportAvailable": true,
  "photos": [
    { "url": null, "caption": "外観（前面）" },
    { "url": null, "caption": "外観（側面）" },
    { "url": null, "caption": "キャビン内部" },
    { "url": null, "caption": "製造番号プレート" }
  ],
  "maintenanceHistory": [
    {
      "date": "2024-03-15",
      "type": "定期点検",
      "description": "油圧系統点検・フィルター交換"
    },
    {
      "date": "2023-09-20",
      "type": "修理",
      "description": "ゴムクローラー交換"
    }
  ],
  "ownershipCheckStatus": "verified",
  "lienCheckStatus": "clear",
  "recommendedFinanceProducts": [
    {
      "product": "installment",
      "label": "割賦",
      "termMonths": 60,
      "estimatedMonthly": 245000
    },
    {
      "product": "finance_lease",
      "label": "ファイナンスリース",
      "termMonths": 60,
      "estimatedMonthly": 232000
    }
  ]
}
```

### 2.3 POST /api/finance/quotes

**概要：** 月額試算を行う

**リクエスト：**

```json
{
  "assetId": "asset_001",
  "assetPrice": 12800000,
  "financeProduct": "installment",
  "termMonths": 60,
  "downPayment": 1000000,
  "residualValuePercent": 0,
  "includeInsurance": true,
  "includeMaintenance": false,
  "buyerProfile": {
    "businessType": "construction",
    "yearsInBusiness": 12,
    "annualRevenueRange": "100m_300m",
    "creditTier": "B"
  }
}
```

**レスポンス (200)：**

```json
{
  "quoteId": "quote_20260514_001",
  "assetId": "asset_001",
  "financeProduct": "installment",
  "financeProductLabel": "割賦",
  "termMonths": 60,
  "assetPrice": 12800000,
  "downPayment": 1000000,
  "residualValue": 0,
  "financedAmount": 11800000,
  "annualRate": 0.058,
  "monthlyPayment": 227800,
  "insuranceMonthlyFee": 8500,
  "maintenanceMonthlyFee": 0,
  "totalMonthlyPayment": 236300,
  "totalPayment": 15178000,
  "initialCost": 1000000,
  "createdAt": "2026-05-14T10:30:00+09:00",
  "validUntil": "2026-06-30",
  "disclaimer": "この見積は概算です。本審査により条件が変更される場合があります。",
  "rateBreakdown": {
    "baseRate": 0.058,
    "creditAdjustment": 0,
    "usedAssetAdjustment": 0.004,
    "inspectionAdjustment": 0,
    "finalRate": 0.062,
    "note": "中古資産加算(+0.4%)適用。点検レポートあり割引適用。"
  }
}
```

**計算ロジック（`lib/monthly-payment-calc.ts` で実装）：**

```
1. baseRate = カテゴリ別基本レート
     used_construction_equipment: 5.8%
     forklift: 5.2%
     machine_tool: 6.2%
     kitchen_food_equipment: 6.5%

2. creditAdjustment = creditTier別調整
     A: -0.5%
     B: 0%
     C: +1.2%

3. usedAssetAdjustment = 中古資産は +0.4%

4. inspectionAdjustment = 点検レポートなしは +0.3%

5. annualRate = baseRate + creditAdjustment + usedAssetAdjustment + inspectionAdjustment

6. monthlyRate = annualRate / 12

7. residualValue = assetPrice * residualValuePercent / 100

8. principal = assetPrice - downPayment - PV(residualValue)
   PV(residualValue) = residualValue / (1 + monthlyRate)^termMonths

9. baseMonthlyPayment = principal * monthlyRate / (1 - (1 + monthlyRate)^(-termMonths))

10. insuranceMonthlyFee = includeInsurance ? round(assetPrice * 0.008 / 12) : 0

11. maintenanceMonthlyFee = includeMaintenance ? round(assetPrice * 0.015 / 12) : 0

12. totalMonthlyPayment = 基本支払額 + 保険料 + メンテナンス
```

### 2.4 POST /api/applications

**概要：** 仮審査申込を行い、即時に仮審査結果を返す

**リクエスト：**

```json
{
  "quoteId": "quote_20260514_001",
  "assetId": "asset_001",
  "sellerId": "seller_001",
  "buyer": {
    "corporateNumber": "1234567890123",
    "companyName": "東京サンプル建設株式会社",
    "representativeName": "山田 太郎",
    "industry": "建設業",
    "establishedYear": 2009,
    "annualRevenueRange": "100m_300m",
    "employeeRange": "20_50",
    "headOfficeAddress": "東京都千代田区丸の内1-1-1",
    "installationAddress": "千葉県市原市〇〇町1-2-3"
  },
  "application": {
    "financeProduct": "installment",
    "termMonths": 60,
    "downPayment": 1000000,
    "personalGuarantee": true,
    "financialStatementsAvailable": true,
    "bankTransactionDataAvailable": false,
    "purpose": "自社工事現場での掘削作業に利用"
  },
  "consents": {
    "creditCheck": true,
    "antiSocialCheck": true,
    "privacyPolicy": true
  }
}
```

**レスポンス (201)：**

```json
{
  "applicationId": "app_20260514_001",
  "status": "pre_approved",
  "createdAt": "2026-05-14T10:45:00+09:00",
  "decision": {
    "result": "pre_approved",
    "approvedAmount": 11800000,
    "termMonths": 60,
    "annualRate": 0.058,
    "estimatedMonthlyPayment": 236300,
    "requiredDocuments": [
      "本人確認書類",
      "商業登記簿謄本",
      "直近2期分の決算書",
      "対象物件の見積書",
      "製造番号が確認できる写真",
      "設置場所情報"
    ],
    "conditions": [
      "動産総合保険の付保",
      "検収完了後に販売店へ支払",
      "代表者保証あり"
    ],
    "reasonCodes": [
      "法人年数10年以上",
      "対象物件の中古流通性あり",
      "販売店が認定済み"
    ]
  },
  "riskAssessment": {
    "creditScore": 72,
    "assetScore": 85,
    "sellerScore": 90,
    "totalScore": 78,
    "result": "pre_approved",
    "reasonCodes": [
      { "code": "YEARS_GT_10", "label": "法人年数10年以上", "impact": "+10" },
      { "code": "ASSET_LIQUID", "label": "対象物件の中古流通性あり", "impact": "+8" },
      { "code": "SELLER_CERTIFIED", "label": "販売店が認定済み", "impact": "+5" },
      { "code": "FS_AVAILABLE", "label": "決算書提出可", "impact": "+5" }
    ],
    "warningFlags": [
      { "code": "HIGH_VALUE", "label": "高額案件（1,000万円超）" }
    ]
  },
  "nextAction": "本審査書類をアップロードしてください。"
}
```

**仮審査ロジック（`lib/pre-screening-judge.ts` で実装）：**

```
スコア算出:

[信用スコア (creditScore)] 100点満点
  - 法人年数 (currentYear - establishedYear)
    ≥10年: +25pt / 5〜9年: +15pt / 3〜4年: +5pt / <3年: 0pt
  - 年商レンジ
    300m_over: +20pt / 100m_300m: +15pt / 50m_100m: +10pt / under_50m: +5pt
  - 決算書提出可: +15pt
  - 代表者保証あり: +10pt
  - 売上データ提出可: +5pt
  - 業種リスク（建設: 0pt / 製造: +5pt / 物流: +3pt / 飲食: -5pt）

[アセットスコア (assetScore)] 100点満点
  - 製造番号あり: +20pt / なし: 0pt
  - 状態ランク (A+: +25pt / A: +20pt / B+: +15pt / B: +10pt / C: +5pt)
  - 年式 (5年以内: +20pt / 10年以内: +10pt / 10年超: +5pt)
  - 点検レポートあり: +15pt
  - 所有権チェック verified: +10pt
  - 担保権チェック clear: +10pt

[販売店スコア (sellerScore)] 100点満点
  - 認定済み (certified): +50pt
  - リスクグレード (A: +30pt / B: +20pt / C: +10pt / D: 0pt)
  - 過去実績あり: +20pt

[総合スコア (totalScore)]
  = creditScore × 0.5 + assetScore × 0.3 + sellerScore × 0.2

判定:
  - totalScore ≥ 70 かつ 全同意あり かつ 製造番号あり かつ 販売店認定済み
    → pre_approved
  - totalScore 45〜69 または 個別条件未充足
    → manual_review
  - totalScore < 45 または 反社チェック同意なし
    → declined

追加ルール:
  - 希望金額 > 30,000,000 → 自動的に manual_review（スコアに関係なく）
  - 法人設立3年未満 → manual_review
```

### 2.5 GET /api/applications/{applicationId}

**概要：** 申込詳細を返す

**レスポンス (200)：**

```json
{
  "applicationId": "app_20260514_001",
  "status": "pre_approved",
  "createdAt": "2026-05-14T10:45:00+09:00",
  "buyer": {
    "corporateNumber": "1234567890123",
    "companyName": "東京サンプル建設株式会社",
    "representativeName": "山田 太郎",
    "industry": "建設業",
    "establishedYear": 2009,
    "annualRevenueRange": "100m_300m",
    "employeeRange": "20_50",
    "headOfficeAddress": "東京都千代田区丸の内1-1-1",
    "installationAddress": "千葉県市原市〇〇町1-2-3"
  },
  "asset": {
    "id": "asset_001",
    "name": "中古油圧ショベル 0.25m3",
    "price": 12800000,
    "category": "used_construction_equipment",
    "maker": "Sample Heavy Industries",
    "model": "EX-120",
    "serialNumber": "SN-EX120-2019-001"
  },
  "seller": {
    "id": "seller_001",
    "name": "関東建機販売株式会社",
    "certified": true,
    "riskGrade": "A"
  },
  "quote": {
    "quoteId": "quote_20260514_001",
    "financeProduct": "installment",
    "termMonths": 60,
    "financedAmount": 11800000,
    "downPayment": 1000000,
    "annualRate": 0.058,
    "totalMonthlyPayment": 236300
  },
  "riskAssessment": {
    "creditScore": 72,
    "assetScore": 85,
    "sellerScore": 90,
    "totalScore": 78,
    "result": "pre_approved",
    "reasonCodes": [
      { "code": "YEARS_GT_10", "label": "法人年数10年以上", "impact": "+10" }
    ],
    "warningFlags": [
      { "code": "HIGH_VALUE", "label": "高額案件（1,000万円超）" }
    ]
  },
  "requiredDocuments": [
    { "name": "本人確認書類", "status": "submitted" },
    { "name": "商業登記簿謄本", "status": "submitted" },
    { "name": "直近2期分の決算書", "status": "pending" },
    { "name": "対象物件の見積書", "status": "pending" },
    { "name": "製造番号が確認できる写真", "status": "pending" },
    { "name": "設置場所情報", "status": "pending" }
  ],
  "timeline": [
    { "step": "quote_created", "label": "月額試算", "status": "completed", "completedAt": "2026-05-14T10:30:00+09:00" },
    { "step": "pre_screening_submitted", "label": "仮審査申込", "status": "completed", "completedAt": "2026-05-14T10:45:00+09:00" },
    { "step": "pre_approved", "label": "仮承認", "status": "completed", "completedAt": "2026-05-14T10:45:05+09:00" },
    { "step": "formal_review", "label": "本審査", "status": "current", "completedAt": null },
    { "step": "contract_pending", "label": "電子契約", "status": "pending", "completedAt": null },
    { "step": "delivered", "label": "納品/検収", "status": "pending", "completedAt": null },
    { "step": "seller_paid", "label": "販売店支払", "status": "pending", "completedAt": null },
    { "step": "billing_started", "label": "月額請求開始", "status": "pending", "completedAt": null },
    { "step": "matured", "label": "満了処理", "status": "pending", "completedAt": null }
  ],
  "payout": null,
  "nextAction": "本審査書類をアップロードしてください。"
}
```

### 2.6 PATCH /api/applications/{applicationId}/status

**概要：** 管理者がステータスを変更する

**リクエスト：**

```json
{
  "status": "formal_review",
  "adminMemo": "決算書確認後、本審査へ進める。対象物件の製造番号写真を追加依頼。"
}
```

**レスポンス (200)：**

```json
{
  "applicationId": "app_20260514_001",
  "previousStatus": "pre_approved",
  "newStatus": "formal_review",
  "updatedAt": "2026-05-15T09:00:00+09:00",
  "adminMemo": "決算書確認後、本審査へ進める。対象物件の製造番号写真を追加依頼。",
  "timeline": [
    { "step": "formal_review", "label": "本審査", "status": "current", "completedAt": null }
  ]
}
```

**ステータス遷移図：**

```
quote_created
  → pre_screening_submitted
    → pre_approved
      → formal_review
        → approved → contract_pending → contracted → delivered → accepted → seller_paid → billing_started → matured
        → rejected
      → manual_review
        → formal_review
        → rejected
    → declined
```

### 2.7 POST /api/acceptance

**概要：** 納品・検収完了を記録する

**リクエスト：**

```json
{
  "applicationId": "app_001",
  "acceptedBy": "buyer",
  "acceptedAt": "2026-05-30T10:00:00+09:00",
  "assetSerialNumberConfirmed": true,
  "conditionConfirmed": true,
  "installationAddressConfirmed": true
}
```

**レスポンス (200)：**

```json
{
  "applicationId": "app_001",
  "status": "accepted",
  "acceptedAt": "2026-05-30T10:00:00+09:00",
  "message": "検収が完了しました。販売店支払処理へ進みます。",
  "nextAction": "ファイナンス管理者が販売店支払を実行します。"
}
```

### 2.8 POST /api/payouts

**概要：** 販売店支払を実行する

**リクエスト：**

```json
{
  "applicationId": "app_001",
  "sellerId": "seller_001"
}
```

**レスポンス (200)：**

```json
{
  "payoutId": "payout_20260514_001",
  "applicationId": "app_001",
  "sellerId": "seller_001",
  "sellerName": "関東建機販売株式会社",
  "payoutAmount": 12800000,
  "scheduledPayoutDate": "2026-06-05",
  "payoutBankName": "〇〇銀行 △△支店",
  "status": "scheduled",
  "message": "販売店支払が予約されました。"
}
```

---

## 3. データモデル設計

### 3.1 型定義 (`types/` フォルダ)

```typescript
// === カテゴリ ===
type AssetCategory =
  | "used_construction_equipment"
  | "forklift"
  | "machine_tool"
  | "kitchen_food_equipment"
  | "industrial_machinery"
  | "refrigeration_equipment"
  | "robot_conveyor";

// === ファイナンス種別 ===
type FinanceProduct =
  | "installment"        // 割賦
  | "finance_lease"      // ファイナンスリース
  | "operating_lease";   // オペレーティングリース風月額利用

// === 年商レンジ ===
type AnnualRevenueRange =
  | "under_50m"
  | "50m_100m"
  | "100m_300m"
  | "300m_1b"
  | "1b_over";

// === 従業員数レンジ ===
type EmployeeRange =
  | "under_5"
  | "5_20"
  | "20_50"
  | "50_100"
  | "100_over";

// === 信用ティア ===
type CreditTier = "A" | "B" | "C";

// === アプリケーションステータス ===
type ApplicationStatus =
  | "quote_created"
  | "pre_screening_submitted"
  | "pre_approved"
  | "manual_review"
  | "formal_review"
  | "approved"
  | "rejected"
  | "contract_pending"
  | "contracted"
  | "delivered"
  | "accepted"
  | "seller_paid"
  | "billing_started"
  | "matured";

// === ファイナンスステータス（商品画面用） ===
type FinanceStatus =
  | "instant_quote"     // 即時試算可
  | "pre_screening"     // 仮審査可
  | "custom_quote";     // 要個別見積

// === タイムラインステップ状態 ===
type TimelineStepStatus =
  | "completed"
  | "current"
  | "pending"
  | "blocked";

// === Asset ===
interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  categoryLabel: string;
  maker: string;
  model: string;
  serialNumber: string;
  year: number;
  usageHours: number | null;
  conditionGrade: string;
  location: string;
  price: number;
  taxIncluded: boolean;
  sellerId: string;
  sellerName: string;
  financeAvailable: boolean;
  financeStatus: FinanceStatus;
  estimatedMonthlyPayment: number;
  inspectionReportAvailable: boolean;
  ownershipCheckStatus: "verified" | "pending" | "not_checked";
  lienCheckStatus: "clear" | "pending" | "flagged";
  photos: { url: string | null; caption: string }[];
  maintenanceHistory: {
    date: string;
    type: string;
    description: string;
  }[];
  recommendedFinanceProducts: {
    product: FinanceProduct;
    label: string;
    termMonths: number;
    estimatedMonthly: number;
  }[];
}

// === Seller ===
interface Seller {
  id: string;
  name: string;
  certified: boolean;
  riskGrade: "A" | "B" | "C" | "D";
  address: string;
  contactName: string;
  payoutBankName: string;
  payoutStatus: "active" | "pending" | "suspended";
}

// === Buyer ===
interface Buyer {
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

// === Quote ===
interface Quote {
  quoteId: string;
  assetId: string;
  financeProduct: FinanceProduct;
  financeProductLabel: string;
  termMonths: number;
  assetPrice: number;
  downPayment: number;
  residualValue: number;
  financedAmount: number;
  annualRate: number;
  monthlyPayment: number;
  insuranceMonthlyFee: number;
  maintenanceMonthlyFee: number;
  totalMonthlyPayment: number;
  totalPayment: number;
  initialCost: number;
  createdAt: string;
  validUntil: string;
  disclaimer: string;
}

// === RiskAssessment ===
interface RiskAssessment {
  creditScore: number;
  assetScore: number;
  sellerScore: number;
  totalScore: number;
  result: "pre_approved" | "manual_review" | "declined";
  reasonCodes: {
    code: string;
    label: string;
    impact: string;
  }[];
  warningFlags: {
    code: string;
    label: string;
  }[];
}

// === Application ===
interface Application {
  applicationId: string;
  quoteId: string;
  assetId: string;
  sellerId: string;
  status: ApplicationStatus;
  createdAt: string;
  buyer: Buyer;
  asset: Pick<Asset, "id" | "name" | "price" | "category" | "maker" | "model" | "serialNumber">;
  seller: Pick<Seller, "id" | "name" | "certified" | "riskGrade">;
  quote: Pick<Quote, "quoteId" | "financeProduct" | "termMonths" | "financedAmount" | "downPayment" | "annualRate" | "totalMonthlyPayment">;
  decision: {
    result: "pre_approved" | "manual_review" | "declined";
    approvedAmount: number;
    termMonths: number;
    annualRate: number;
    estimatedMonthlyPayment: number;
    requiredDocuments: string[];
    conditions: string[];
    reasonCodes: string[];
  };
  riskAssessment: RiskAssessment;
  requiredDocuments: {
    name: string;
    status: "submitted" | "pending" | "rejected";
  }[];
  timeline: TimelineStep[];
  payout: Payout | null;
  adminMemo: string;
  nextAction: string;
}

// === TimelineStep ===
interface TimelineStep {
  step: string;
  label: string;
  status: TimelineStepStatus;
  completedAt: string | null;
}

// === Payout ===
interface Payout {
  payoutId: string;
  applicationId: string;
  sellerId: string;
  sellerName: string;
  payoutAmount: number;
  scheduledPayoutDate: string;
  payoutBankName: string;
  status: "scheduled" | "processing" | "completed" | "failed";
}

// === API Debug用 ===
interface ApiCallEntry {
  id: string;
  apiName: string;
  method: "GET" | "POST" | "PATCH";
  endpoint: string;
  requestBody?: Record<string, unknown>;
  responseBody: Record<string, unknown>;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}
```

---

## 4. ビジネスロジック設計

### 4.1 月額試算計算 (`lib/monthly-payment-calc.ts`)

```
入力: QuoteRequest
出力: QuoteResponse

処理フロー:
1. カテゴリから基本レートを取得
2. 信用ティアによる調整
3. 中古資産の場合 +0.4%
4. 点検レポートなしの場合 +0.3%
5. 最終年率を算出
6. 月利 = 年率 / 12
7. 残価の現在価値を算出
8. ファイナンス対象額 = 物件価格 - 頭金 - 残価現在価値
9. PMT計算で月額基本支払額を算出
10. 保険料月額 = 物件価格 × 0.8% / 12（オプション）
11. メンテナンス月額 = 物件価格 × 1.5% / 12（オプション）
12. 合計月額 = 基本支払額 + 保険料 + メンテナンス
```

**カテゴリ別基本レートテーブル（`lib/rate-table.ts`）：**

| カテゴリ | baseRate |
|---------|----------|
| used_construction_equipment | 5.8% |
| forklift | 5.2% |
| machine_tool | 6.2% |
| kitchen_food_equipment | 6.5% |
| industrial_machinery | 6.0% |
| refrigeration_equipment | 6.3% |
| robot_conveyor | 5.5% |

### 4.2 仮審査判定 (`lib/pre-screening-judge.ts`)

セクション2.4に記載のスコアリングロジックに従う。

### 4.3 リスクスコア計算 (`lib/risk-score-calc.ts`)

```
入力: Buyer, Asset, Seller
出力: RiskAssessment

処理:
1. creditScore = calcCreditScore(buyer)
2. assetScore = calcAssetScore(asset)
3. sellerScore = calcSellerScore(seller)
4. totalScore = creditScore * 0.5 + assetScore * 0.3 + sellerScore * 0.2
5. warningFlags = collectWarningFlags(asset, buyer, amount)
6. result = determineResult(totalScore, consents, asset, seller, amount)
```

---

## 5. モックデータ設計

### 5.1 商品マスタ (`data/assets.ts`)

| id | name | category | price | year | usageHours | financeStatus |
|----|------|----------|-------|------|-----------|--------------|
| asset_001 | 中古油圧ショベル 0.25m3 | used_construction_equipment | 12,800,000 | 2019 | 3,240 | instant_quote |
| asset_002 | フォークリフト 2.5t | forklift | 4,500,000 | 2021 | 1,180 | instant_quote |
| asset_003 | 横型マシニングセンタ HMC-500 | machine_tool | 28,000,000 | 2018 | 8,600 | pre_screening |
| asset_004 | 業務用急速冷凍機 RF-300 | kitchen_food_equipment | 7,200,000 | 2022 | null | instant_quote |

### 5.2 販売店マスタ (`data/sellers.ts`)

| id | name | certified | riskGrade |
|----|------|-----------|-----------|
| seller_001 | 関東建機販売株式会社 | true | A |
| seller_002 | 西日本物流機器株式会社 | true | B |
| seller_003 | 中部精密機械商会 | true | A |
| seller_004 | 東京フードマシナリー株式会社 | false | C |

### 5.3 買い手企業マスタ (`data/buyers.ts`)

| corporateNumber | companyName | industry | establishedYear | annualRevenueRange |
|----------------|-------------|----------|----------------|-------------------|
| 1234567890123 | 東京サンプル建設株式会社 | 建設業 | 2009 | 100m_300m |
| 2345678901234 | 大阪物流サービス株式会社 | 運輸業 | 2015 | 50m_100m |
| 3456789012345 | 中部精密工業株式会社 | 製造業 | 1998 | 300m_1b |
| 4567890123456 | 北海道食品加工株式会社 | 食品製造業 | 2020 | under_50m |

### 5.4 申込データ・初期状態 (`data/applications.ts`)

デモ用に以下の4件を初期データとして用意：

| applicationId | asset | buyer | status | 用途 |
|--------------|-------|-------|--------|------|
| app_001 | asset_001 油圧ショベル | 東京サンプル建設 | pre_approved | デモシナリオA用（仮承認済） |
| app_002 | asset_002 フォークリフト | 大阪物流サービス | formal_review | 本審査進行中の案件 |
| app_003 | asset_003 マシニングセンタ | 中部精密工業 | manual_review | 高額案件・追加確認中 |
| app_004 | asset_004 急速冷凍機 | 北海道食品加工 | contracted | 契約済（検収待ち） |

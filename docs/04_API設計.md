# API設計

## API一覧

| API ID | Method | Path | 概要 | 認可 | 備考 |
|---|---|---|---|---|---|
| API-001 | GET | `/api/assets` | アセット一覧取得 | なし | フィルタ対応 |
| API-002 | GET | `/api/assets/:assetId` | アセット詳細取得 | なし | |
| API-003 | POST | `/api/finance/quotes` | 月額試算 | なし | 即時レスポンス |
| API-004 | GET | `/api/applications` | 申込一覧取得 | なし | ロールで絞り込み |
| API-005 | POST | `/api/applications` | 仮審査申込 | なし | 仮審査ロジック実行 |
| API-006 | GET | `/api/applications/:id` | 申込詳細取得 | なし | |
| API-007 | PATCH | `/api/applications/:id/status` | ステータス更新 | なし | Finance Admin用 |
| API-008 | POST | `/api/acceptance` | 検収登録 | なし | |
| API-009 | POST | `/api/payouts` | 支払処理 | なし | |

## 共通仕様

- 認証方式: なし（PoCプロトタイプ）
- Content-Type: `application/json`
- 日時形式: ISO 8601
- 金額単位: 円（整数）
- データ保持: インメモリ（再起動でリセット）

## API詳細

### API-001: アセット一覧取得

#### Request

```http
GET /api/assets
```

#### Response 200

```json
{
  "assets": [
    {
      "assetId": "asset_001",
      "name": "中古油圧ショベル 0.25m3",
      "category": "中古建機",
      "price": 12800000,
      "monthlyEstimate": 245000,
      "status": "即時試算可"
    }
  ]
}
```

### API-003: 月額試算

#### Request

```http
POST /api/finance/quotes
Content-Type: application/json

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
    "annualRevenueRange": "100m_500m",
    "creditTier": "B"
  }
}
```

#### Response 200

```json
{
  "quoteId": "qt_xxx",
  "assetId": "asset_001",
  "financeProduct": "installment",
  "financeProductLabel": "割賦",
  "termMonths": 60,
  "assetPrice": 12800000,
  "downPayment": 1000000,
  "residualValue": 0,
  "financedAmount": 11800000,
  "monthlyPayment": 236300,
  "insuranceMonthlyFee": 8500,
  "maintenanceMonthlyFee": 0,
  "totalMonthlyPayment": 244800,
  "annualRate": 0.062,
  "totalPayment": 15688000,
  "initialCost": 1000000,
  "createdAt": "2026-05-20T00:00:00.000Z",
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

### API-005: 仮審査申込

#### Request

```http
POST /api/applications
Content-Type: application/json

{
  "assetId": "asset_001",
  "quoteId": "qt_xxx",
  "sellerId": "seller_001",
  "buyer": { "companyName": "...", "registrationNumber": "..." },
  "application": {
    "financeProduct": "installment",
    "termMonths": 60,
    "downPayment": 1000000,
    "personalGuarantee": true,
    "financialStatementsAvailable": true,
    "bankTransactionDataAvailable": false,
    "purpose": "設備導入"
  },
  "consents": {
    "creditCheck": true,
    "antiSocialCheck": true,
    "privacyPolicy": true
  }
}
```

#### Response 200

```json
{
  "applicationId": "app_xxx",
  "status": "pre_approved",
  "decision": {
    "result": "pre_approved",
    "approvedAmount": 11800000,
    "termMonths": 60,
    "annualRate": 0.058,
    "estimatedMonthlyPayment": 244800,
    "requiredDocuments": ["本人確認書類", "商業登記簿謄本", "直近2期分の決算書"],
    "conditions": ["動産総合保険の付保", "検収完了後に販売店へ支払"],
    "reasonCodes": []
  },
  "nextAction": "本審査書類をアップロードしてください。"
}
```

#### Error

| Status | Code | 説明 | 対応 |
|---:|---|---|---|
| 400 | VALIDATION_ERROR | 入力不正 | 入力内容を修正 |
| 404 | NOT_FOUND | 対象なし | ID確認 |
| 500 | INTERNAL_ERROR | サーバーエラー | 再試行 |

## 外部システム連携

PoCフェーズでは外部システム連携なし。将来的には以下を想定。

| 連携ID | 連携先システム | 方式 | データ方向 | 頻度 | 認証 | 備考 |
|---|---|---|---|---|---|---|
| EXT-001 | B2B ECサイト | REST API | 双方向 | リアルタイム | OAuth2 | アセット情報取得・ファイナンス結果返却 |
| EXT-002 | 信用情報機関 | REST API | 送信 | オンデマンド | APIキー | 法人与信照会 |
| EXT-003 | 電子契約サービス | REST API | 双方向 | オンデマンド | OAuth2 | 契約書生成・署名 |

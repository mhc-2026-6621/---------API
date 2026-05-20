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
  "financeType": "installment",
  "termMonths": 60,
  "downPayment": 1000000,
  "residualValue": "none",
  "insurance": true,
  "maintenance": false
}
```

#### Response 200

```json
{
  "quoteId": "qt_xxx",
  "monthlyPayment": 236300,
  "breakdown": {
    "principal": 227800,
    "insurance": 8500,
    "maintenance": 0
  },
  "annualRate": 5.80,
  "termMonths": 60,
  "validUntil": "2026-06-30"
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
  "company": { "name": "...", "registrationNumber": "..." },
  "financeConditions": { "type": "installment", "termMonths": 60 }
}
```

#### Response 200

```json
{
  "applicationId": "app_xxx",
  "status": "pre_approved",
  "approvedAmount": 12800000,
  "monthlyPayment": 236300,
  "requiredDocuments": ["決算書（直近2期分）", "法人登記簿謄本"]
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

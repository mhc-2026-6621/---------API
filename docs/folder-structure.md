# フォルダ構成・ファイル構成

> 初めてプロジェクトに参加する人が「この機能はどのファイル？」と迷わないことを最優先にしています。
> ファイル名は**日本語の業務用語と1対1対応する英語名**を採用しています。

---

## 命名ルール

### ファイル名の付け方

| ルール | 例 | 説明 |
|--------|---|------|
| 業務で呼ぶ名前をそのまま英語にする | 月額試算 → `MonthlyPaymentSimulator` | 日本語の会話でファイル名がすぐ出てくる |
| 「何をするファイルか」が名前だけで分かる | `PreScreeningForm` | 「仮審査フォーム」と読める |
| 汎用的な名前を避ける | ~~`Result`~~ → `PreScreeningResult` | 何の結果か分からない名前は使わない |
| 略語は最小限にする | ~~`AppForm`~~ → `PreScreeningForm` | 略すと日本語に変換しにくい |

### ファイル名 ⇔ 日本語 対応一覧

全ファイルの「日本語での呼び名」を以下にまとめています。
チーム内の会話やレビューではこの日本語名を使ってください。

#### 画面ページ（page.tsx）

| ファイルの場所 | 日本語名 | URL |
|--------------|---------|-----|
| `app/marketplace/page.tsx` | 商品一覧画面 | `/marketplace` |
| `app/marketplace/assets/[assetId]/page.tsx` | 商品詳細画面 | `/marketplace/assets/{id}` |
| `app/finance/apply/page.tsx` | 仮審査申込画面 | `/finance/apply?assetId=xxx` |
| `app/finance/applications/[applicationId]/page.tsx` | 申込詳細画面 | `/finance/applications/{id}` |
| `app/merchant/dashboard/page.tsx` | 販売店ダッシュボード | `/merchant/dashboard` |
| `app/admin/dashboard/page.tsx` | 管理者ダッシュボード | `/admin/dashboard` |

#### 画面部品（_components/）

| ファイル名 | 日本語名 | どの画面で使うか |
|-----------|---------|---------------|
| `AssetCard.tsx` | 商品カード | 商品一覧 |
| `AssetCardList.tsx` | 商品カード一覧 | 商品一覧 |
| `AssetSearchFilter.tsx` | 商品検索フィルター | 商品一覧 |
| `AssetInfoSection.tsx` | 商品情報セクション | 商品詳細 |
| `MonthlyPaymentSimulator.tsx` | 月額試算シミュレーター | 商品詳細 |
| `PreScreeningForm.tsx` | 仮審査申込フォーム | 仮審査申込 |
| `PreScreeningResult.tsx` | 仮審査結果 | 仮審査申込 |
| `ApplicationTimeline.tsx` | 申込進捗タイムライン | 申込詳細 |
| `RequiredDocumentList.tsx` | 必要書類一覧 | 申込詳細 |
| `MerchantKpiSummary.tsx` | 販売店KPIサマリー | 販売店DB |
| `MerchantApplicationTable.tsx` | 販売店向け申込一覧 | 販売店DB |
| `SellerPayoutList.tsx` | 販売店支払予定一覧 | 販売店DB |
| `ScreeningQueue.tsx` | 審査キュー | 管理者DB |
| `RiskScorePanel.tsx` | リスクスコアパネル | 管理者DB |
| `StatusUpdateDialog.tsx` | ステータス変更ダイアログ | 管理者DB |
| `ScreeningMemo.tsx` | 審査メモ | 管理者DB |

#### 共通部品（components/shared/）

| ファイル名 | 日本語名 |
|-----------|---------|
| `GlobalHeader.tsx` | 共通ヘッダー |
| `PocDisclaimer.tsx` | PoC注意表記フッター |
| `ApiCallViewer.tsx` | APIコール確認パネル |
| `RoleSwitcher.tsx` | ロール切替 |
| `YenAmount.tsx` | 円金額表示 |
| `StatusBadge.tsx` | ステータスバッジ |

#### 業務ロジック（lib/）

| ファイル名 | 日本語名 |
|-----------|---------|
| `monthly-payment-calc.ts` | 月額試算計算 |
| `pre-screening-judge.ts` | 仮審査判定 |
| `risk-score-calc.ts` | リスクスコア計算 |
| `rate-table.ts` | 金利テーブル |
| `label-maps.ts` | 表示ラベル定義 |
| `format-utils.ts` | フォーマット関数 |

#### モックデータ（data/）

| ファイル名 | 日本語名 | 中身 |
|-----------|---------|------|
| `assets.ts` | 商品マスタ | 油圧ショベル、フォークリフト等 4件 |
| `sellers.ts` | 販売店マスタ | 関東建機販売 等 4社 |
| `buyers.ts` | 買い手企業マスタ | 東京サンプル建設 等 4社 |
| `applications.ts` | 申込データ（初期） | 各ステータスの申込 4件 |
| `quotes.ts` | 見積データ | 申込に紐づく見積 |
| `data-store.ts` | データストア | ランタイム状態管理 |

#### 型定義（types/）

| ファイル名 | 日本語名 | 含まれる型 |
|-----------|---------|-----------|
| `asset.ts` | 商品の型 | Asset, AssetCategory, FinanceStatus |
| `seller.ts` | 販売店の型 | Seller |
| `buyer.ts` | 買い手企業の型 | Buyer, AnnualRevenueRange, EmployeeRange |
| `quote.ts` | 見積の型 | Quote, QuoteRequest, QuoteResponse |
| `application.ts` | 申込の型 | Application, ApplicationStatus, TimelineStep |
| `risk.ts` | リスク評価の型 | RiskAssessment, CreditTier |
| `payout.ts` | 販売店支払の型 | Payout |
| `api-debug.ts` | APIコール履歴の型 | ApiCallEntry |
| `index.ts` | まとめエクスポート | 上記すべてを re-export |

---

## 全体構成（概要）

```
asset-finance-checkout/
│
├── app/                         … 画面とAPIルート
│    ├── marketplace/            …   商品一覧・商品詳細（買い手が見る画面）
│    ├── finance/                …   仮審査申込・申込詳細（買い手が見る画面）
│    ├── merchant/               …   販売店ダッシュボード
│    ├── admin/                  …   管理者ダッシュボード
│    └── api/                    …   モックAPI（8エンドポイント）
│
├── components/                  … 部品
│    ├── shared/                 …   複数画面で使う共通部品
│    └── ui/                     …   shadcn/ui 基本部品（自動生成）
│
├── data/                        … モックデータ（商品・企業・申込のサンプル）
├── lib/                         … 業務ロジック（月額計算・審査判定・金利テーブル）
├── types/                       … TypeScript 型定義
├── hooks/                       … React カスタムフック
├── contexts/                    … React コンテキスト（状態の共有）
├── docs/                        … ドキュメント
│
├── README.md                    … セットアップ・起動手順・デモシナリオ
└── openapi.yaml                 … APIのOpenAPI定義
```

---

## 詳細構成

### app/ ─ 画面とAPIルート

```
app/
├── layout.tsx                          … 全画面共通レイアウト（ヘッダー + フッター + APIコール確認パネル）
├── page.tsx                            … ルート（/）→ /marketplace へ自動遷移
├── globals.css                         … Tailwind CSS 読み込み
│
│
│ ── 🛒 商品一覧・商品詳細 ─────────────────────────────────
│
├── marketplace/
│    ├── page.tsx                        … 【商品一覧画面】
│    │                                      /marketplace
│    │                                      APIコール: GET /api/assets
│    │
│    ├── _components/                    … 商品一覧画面の部品
│    │    ├── AssetCard.tsx              …   商品カード（1枚分の表示）
│    │    ├── AssetCardList.tsx          …   商品カード一覧（グリッド配置）
│    │    └── AssetSearchFilter.tsx      …   商品検索フィルター（カテゴリ・価格帯・年式）
│    │
│    └── assets/[assetId]/
│         ├── page.tsx                   … 【商品詳細画面】
│         │                                 /marketplace/assets/{assetId}
│         │                                 APIコール: GET /api/assets/:id
│         │                                 APIコール: POST /api/finance/quotes（試算実行時）
│         │
│         └── _components/               … 商品詳細画面の部品
│              ├── AssetInfoSection.tsx   …   商品情報セクション（スペック・販売店・点検レポート）
│              └── MonthlyPaymentSimulator.tsx  … 月額試算シミュレーター
│                                                  条件入力 → 試算実行 → 結果表示
│                                                  「仮審査に進む」ボタンを含む
│
│
│ ── 💰 仮審査申込・申込詳細 ────────────────────────────────
│
├── finance/
│    ├── apply/
│    │    ├── page.tsx                   … 【仮審査申込画面】
│    │    │                                 /finance/apply?assetId=xxx
│    │    │                                 APIコール: POST /api/applications
│    │    │
│    │    └── _components/               … 仮審査申込画面の部品
│    │         ├── PreScreeningForm.tsx   …   仮審査申込フォーム（法人情報・同意事項）
│    │         │                              「サンプル入力」ボタン付き（デモ用）
│    │         └── PreScreeningResult.tsx …   仮審査結果（仮承認 / 追加確認 / 否決）
│    │                                        結果バッジ + 必要書類 + 判定理由 + 次のアクション
│    │
│    └── applications/[applicationId]/
│         ├── page.tsx                   … 【申込詳細画面】
│         │                                 /finance/applications/{applicationId}
│         │                                 APIコール: GET /api/applications/:id
│         │
│         └── _components/               … 申込詳細画面の部品
│              ├── ApplicationTimeline.tsx    … 申込進捗タイムライン（9ステップ）
│              │                                試算 → 仮審査 → 仮承認 → 本審査 → 契約
│              │                                → 納品/検収 → 販売店支払 → 請求 → 満了
│              └── RequiredDocumentList.tsx   … 必要書類一覧（提出済/未提出のチェックリスト）
│
│
│ ── 🏪 販売店ダッシュボード ────────────────────────────────
│
├── merchant/dashboard/
│    ├── page.tsx                        … 【販売店ダッシュボード】
│    │                                      /merchant/dashboard
│    │
│    └── _components/                    … 販売店ダッシュボードの部品
│         ├── MerchantKpiSummary.tsx     …   販売店KPIサマリー
│         │                                  試算クリック数 / 仮審査申込数 / 仮承認率
│         │                                  成約率 / ファイナンス経由GMV / 支払予定額
│         ├── MerchantApplicationTable.tsx …  販売店向け申込一覧テーブル
│         │                                  アセット名 / 買い手 / 金額 / ステータス / 支払予定
│         └── SellerPayoutList.tsx       …   販売店支払予定一覧
│                                            支払予定日 / 金額 / ステータス
│
│
│ ── 🔒 管理者ダッシュボード ────────────────────────────────
│
├── admin/dashboard/
│    ├── page.tsx                        … 【管理者ダッシュボード】
│    │                                      /admin/dashboard
│    │                                      APIコール: PATCH /api/applications/:id/status
│    │
│    └── _components/                    … 管理者ダッシュボードの部品
│         ├── ScreeningQueue.tsx         …   審査キュー（タブ切替）
│         │                                  [審査待ち] [高額案件] [要追加確認] [否決候補]
│         ├── RiskScorePanel.tsx         …   リスクスコアパネル
│         │                                  信用スコア / アセットスコア / 販売店スコア / 総合
│         ├── StatusUpdateDialog.tsx     …   ステータス変更ダイアログ
│         │                                  [本審査へ] [追加書類依頼] [条件変更] [否決]
│         └── ScreeningMemo.tsx          …   審査メモ（自由入力テキストエリア）
│
│
│ ── 🔌 モックAPI ──────────────────────────────────────────
│
└── api/
     ├── assets/
     │    ├── route.ts                   … GET  /api/assets         （商品一覧を返す）
     │    └── [assetId]/
     │         └── route.ts              … GET  /api/assets/:id     （商品詳細を返す）
     │
     ├── finance/quotes/
     │    └── route.ts                   … POST /api/finance/quotes （月額試算を実行）
     │                                      → lib/monthly-payment-calc.ts を呼ぶ
     │
     ├── applications/
     │    ├── route.ts                   … POST /api/applications   （仮審査申込を受付）
     │    │                                 → lib/pre-screening-judge.ts を呼ぶ
     │    │                                 → lib/risk-score-calc.ts を呼ぶ
     │    └── [applicationId]/
     │         ├── route.ts              … GET  /api/applications/:id （申込詳細を返す）
     │         └── status/
     │              └── route.ts         … PATCH /api/applications/:id/status （ステータス変更）
     │
     ├── acceptance/
     │    └── route.ts                   … POST /api/acceptance     （検収完了を記録）
     │
     └── payouts/
          └── route.ts                   … POST /api/payouts        （販売店支払を実行）
```

### components/ ─ 部品

```
components/
│
├── shared/                              … 複数画面で使う共通部品
│    │
│    ├── GlobalHeader.tsx                … 共通ヘッダー
│    │                                      ロゴ / ナビゲーション / ロール切替
│    │                                      ロールによってナビ項目を出し分け
│    │
│    ├── PocDisclaimer.tsx               … PoC注意表記フッター
│    │                                      「本画面はPoC用モックであり、
│    │                                       実際の審査結果ではありません」
│    │
│    ├── ApiCallViewer.tsx               … APIコール確認パネル（トグル式ドロワー）
│    │                                      画面右下の「</> API」ボタンで開閉
│    │                                      直近のAPIコール履歴を表示：
│    │                                        HTTPメソッド / エンドポイント
│    │                                        Request JSON / Response JSON
│    │                                        ステータスコード / レスポンスタイム
│    │
│    ├── RoleSwitcher.tsx                … ロール切替ドロップダウン
│    │                                      Buyer（買い手）/ Merchant（販売店）/ Admin（管理者）
│    │
│    ├── YenAmount.tsx                   … 円金額表示
│    │                                      数値を「¥12,800,000」形式で表示
│    │                                      月額は「月額 ¥245,000〜」形式で強調表示
│    │
│    └── StatusBadge.tsx                 … ステータスバッジ
│                                           仮承認=緑 / 追加確認=黄 / 否決=赤 / 本審査中=青 等
│
└── ui/                                  … shadcn/ui の基本部品（自動生成・編集不要）
     ├── button.tsx
     ├── card.tsx
     ├── badge.tsx
     ├── dialog.tsx
     ├── input.tsx
     ├── label.tsx
     ├── select.tsx
     ├── table.tsx
     ├── tabs.tsx
     ├── checkbox.tsx
     ├── radio-group.tsx
     ├── textarea.tsx
     ├── separator.tsx
     ├── sheet.tsx                        … APIコール確認パネルのドロワーに使用
     └── tooltip.tsx
```

### data/ ─ モックデータ

```
data/
│
├── assets.ts                            … 商品マスタ（4件）
│                                           asset_001: 中古油圧ショベル 0.25m3    ¥12,800,000
│                                           asset_002: フォークリフト 2.5t        ¥4,500,000
│                                           asset_003: 横型マシニングセンタ HMC-500 ¥28,000,000
│                                           asset_004: 業務用急速冷凍機 RF-300     ¥7,200,000
│
├── sellers.ts                           … 販売店マスタ（4社）
│                                           seller_001: 関東建機販売㈱       認定済 / グレードA
│                                           seller_002: 西日本物流機器㈱     認定済 / グレードB
│                                           seller_003: 中部精密機械商会     認定済 / グレードA
│                                           seller_004: 東京フードマシナリー㈱ 未認定 / グレードC
│
├── buyers.ts                            … 買い手企業マスタ（4社）
│                                           東京サンプル建設㈱   建設業   設立2009年  年商1〜3億
│                                           大阪物流サービス㈱   運輸業   設立2015年  年商5千万〜1億
│                                           中部精密工業㈱      製造業   設立1998年  年商3〜10億
│                                           北海道食品加工㈱    食品製造  設立2020年  年商5千万未満
│
├── applications.ts                      … 申込データ・初期状態（4件）
│                                           app_001: 油圧ショベル×東京建設   → 仮承認済
│                                           app_002: フォークリフト×大阪物流 → 本審査中
│                                           app_003: マシニング×中部精密    → 追加確認中
│                                           app_004: 急速冷凍機×北海道食品  → 契約済
│
├── quotes.ts                            … 見積データ（申込に紐づく試算結果）
│
└── data-store.ts                        … インメモリ データストア
                                            ─ 初回起動時に上記マスタ・申込データを読み込む
                                            ─ 画面操作による申込追加・ステータス変更を保持
                                            ─ サーバー再起動で初期状態にリセット
                                            ─ APIルート（app/api/）から読み書きされる
```

### lib/ ─ 業務ロジック

```
lib/
│
├── monthly-payment-calc.ts              … 月額試算計算
│                                           ─ PMT関数（元利均等返済の月額計算）
│                                           ─ 残価の現在価値を考慮
│                                           ─ 保険料・メンテナンス費の加算
│                                           ─ rate-table.ts から金利を取得
│
├── pre-screening-judge.ts               … 仮審査判定
│                                           ─ risk-score-calc.ts でスコアを算出
│                                           ─ スコアと条件に基づいて判定：
│                                              仮承認（pre_approved）
│                                              追加確認（manual_review）
│                                              否決（declined）
│                                           ─ 判定理由コード・必要書類・条件を返す
│
├── risk-score-calc.ts                   … リスクスコア計算
│                                           ─ 信用スコア（法人年数・年商・決算書有無等）
│                                           ─ アセットスコア（年式・状態・点検レポート等）
│                                           ─ 販売店スコア（認定状態・グレード）
│                                           ─ 総合スコア = 信用×0.5 + アセット×0.3 + 販売店×0.2
│                                           ─ 警告フラグの収集
│
├── rate-table.ts                        … 金利テーブル（定数）
│                                           ─ カテゴリ別基本レート
│                                              中古建機: 5.8% / フォークリフト: 5.2%
│                                              工作機械: 6.2% / 厨房食品: 6.5%
│                                           ─ 信用ティア別調整
│                                              A: -0.5% / B: ±0% / C: +1.2%
│                                           ─ 中古資産加算: +0.4%
│                                           ─ 点検レポートなし加算: +0.3%
│                                           ─ 保険料率: 年0.8%
│                                           ─ メンテナンス料率: 年1.5%
│
├── label-maps.ts                        … 表示ラベル定義（定数）
│                                           ─ ステータスの日本語ラベル
│                                              pre_approved → "仮承認"
│                                              formal_review → "本審査中"
│                                           ─ カテゴリの日本語ラベル
│                                              used_construction_equipment → "中古建機"
│                                           ─ 年商レンジの選択肢
│                                           ─ 従業員数レンジの選択肢
│                                           ─ 業種の選択肢
│                                           ─ ファイナンス種別の選択肢
│
└── format-utils.ts                      … フォーマット関数
                                            ─ formatYen(12800000) → "12,800,000"
                                            ─ formatDate("2026-05-14") → "2026/05/14"
                                            ─ formatPercent(0.058) → "5.80%"
                                            ─ generateId("app") → "app_20260514_001"
                                            ─ cn() …… shadcn/ui のクラス名結合ヘルパー
```

### types/ ─ 型定義

```
types/
│
├── asset.ts                             … 商品の型
│                                           Asset          … 商品データ
│                                           AssetCategory  … カテゴリ区分
│                                           FinanceStatus  … 即時試算可 / 仮審査可 / 要個別見積
│
├── seller.ts                            … 販売店の型
│                                           Seller         … 販売店データ
│
├── buyer.ts                             … 買い手企業の型
│                                           Buyer              … 買い手企業データ
│                                           AnnualRevenueRange … 年商レンジ区分
│                                           EmployeeRange      … 従業員数レンジ区分
│
├── quote.ts                             … 見積の型
│                                           Quote          … 見積データ
│                                           QuoteRequest   … 月額試算リクエスト
│                                           QuoteResponse  … 月額試算レスポンス
│
├── application.ts                       … 申込の型
│                                           Application        … 申込データ
│                                           ApplicationStatus  … ステータス区分（14種）
│                                           TimelineStep       … タイムラインの1ステップ
│
├── risk.ts                              … リスク評価の型
│                                           RiskAssessment … スコア + 判定結果 + 警告フラグ
│                                           CreditTier     … 信用ティア（A / B / C）
│
├── payout.ts                            … 販売店支払の型
│                                           Payout         … 支払データ
│
├── api-debug.ts                         … APIコール履歴の型
│                                           ApiCallEntry   … 1回のAPIコール記録
│
└── index.ts                             … まとめエクスポート
                                            import { Asset, Seller, ... } from "@/types"
                                            のように1行でインポートできる
```

### hooks/ と contexts/ ─ React状態管理

```
hooks/
├── use-api-call-log.ts                  … APIコール履歴フック
│                                           addApiCall()  … コール記録を追加
│                                           apiCallLog[]  … 履歴一覧
│                                           → ApiCallViewer.tsx が表示に使う
│
└── use-current-role.ts                  … 現在ロール取得フック
                                            currentRole   … "buyer" | "merchant" | "admin"
                                            setRole()     … ロール変更
                                            → RoleSwitcher.tsx が切替に使う

contexts/
├── RoleProvider.tsx                     … ロール管理プロバイダー
│                                           アプリ全体でロール状態を共有
│                                           app/layout.tsx で全画面をラップ
│
└── ApiCallLogProvider.tsx               … APIコール履歴プロバイダー
                                            アプリ全体でAPIコール記録を共有
                                            app/layout.tsx で全画面をラップ
```

### docs/ ─ ドキュメント

```
docs/
├── prototype-design.md                  … プロトタイプ設計書（画面設計・API設計・データモデル）
├── folder-structure.md                  … フォルダ構成説明（本ファイル）
└── api.md                               … API仕様書
                                            エンドポイント一覧
                                            リクエスト/レスポンス例
                                            月額計算ロジック
                                            仮審査判定ロジック
```

---

## ファイルの探し方ガイド

### 「この画面を直したい」

| やりたいこと | 開くファイル |
|-------------|------------|
| 商品一覧のカード表示を変えたい | `app/marketplace/_components/AssetCard.tsx` |
| 商品一覧のフィルターを変えたい | `app/marketplace/_components/AssetSearchFilter.tsx` |
| 商品詳細の情報表示を変えたい | `app/marketplace/assets/[assetId]/_components/AssetInfoSection.tsx` |
| 月額試算の入力フォームを変えたい | `app/marketplace/assets/[assetId]/_components/MonthlyPaymentSimulator.tsx` |
| 仮審査の入力項目を変えたい | `app/finance/apply/_components/PreScreeningForm.tsx` |
| 仮審査結果の表示を変えたい | `app/finance/apply/_components/PreScreeningResult.tsx` |
| タイムラインの表示を変えたい | `app/finance/applications/[applicationId]/_components/ApplicationTimeline.tsx` |
| 販売店ダッシュボードのKPIを変えたい | `app/merchant/dashboard/_components/MerchantKpiSummary.tsx` |
| 管理者のリスクスコア表示を変えたい | `app/admin/dashboard/_components/RiskScorePanel.tsx` |
| 管理者のステータス変更を変えたい | `app/admin/dashboard/_components/StatusUpdateDialog.tsx` |

### 「APIの動きを変えたい」

| やりたいこと | 開くファイル | さらに見る |
|-------------|------------|-----------|
| 商品一覧のレスポンスを変えたい | `app/api/assets/route.ts` | `data/assets.ts` |
| 月額試算の計算を変えたい | `app/api/finance/quotes/route.ts` | `lib/monthly-payment-calc.ts` |
| 金利の設定を変えたい | - | `lib/rate-table.ts` |
| 仮審査の判定条件を変えたい | `app/api/applications/route.ts` | `lib/pre-screening-judge.ts` |
| リスクスコアの重みを変えたい | - | `lib/risk-score-calc.ts` |
| ステータスの種類や日本語名を変えたい | - | `lib/label-maps.ts` + `types/application.ts` |

### 「サンプルデータを変えたい」

| やりたいこと | 開くファイル |
|-------------|------------|
| 商品を追加・変更したい | `data/assets.ts` |
| 販売店を追加・変更したい | `data/sellers.ts` |
| 買い手企業を追加・変更したい | `data/buyers.ts` |
| 初期の申込データを変えたい | `data/applications.ts` |

---

## 依存関係

```
画面（page.tsx）
  │
  ├── 画面専用部品（_components/）
  ├── 共通部品（components/shared/）
  ├── フック（hooks/）→ コンテキスト（contexts/）
  │
  └── fetch() ──→ APIルート（app/api/route.ts）
                    │
                    ├── 業務ロジック（lib/）
                    │    ├── monthly-payment-calc.ts  月額計算
                    │    ├── pre-screening-judge.ts   仮審査判定
                    │    ├── risk-score-calc.ts       スコア計算
                    │    ├── rate-table.ts            金利テーブル
                    │    └── label-maps.ts            ラベル定義
                    │
                    └── データストア（data/data-store.ts）
                         └── 初期データ（data/*.ts）

※ 型定義（types/）は全レイヤーから参照される
```

**ルール：**
- 画面 → API は `fetch()` 経由。直接 import しない
- API → lib、API → data は直接 import OK
- lib は画面にもAPIにも依存しない（純粋関数）
- `_components/` 内の部品は、その画面の `page.tsx` からだけ使う
- `components/shared/` の部品は、どの画面からでも使える

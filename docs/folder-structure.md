# フォルダ構成・ファイル構成

このプロジェクトは Next.js App Router の標準に合わせて、実装コードを `src/` 配下に集約しています。ルート直下は設定ファイルとドキュメントを中心に置き、画面、API、業務ロジック、型定義は `src/` を起点に探します。

## 全体構成

```text
embedded-lease-api/
├── src/                         … アプリケーション実装
│   ├── app/                     … 画面とAPIルート
│   ├── components/              … 複数画面で使う共通部品
│   ├── contexts/                … React Context
│   ├── data/                    … モックデータとインメモリデータストア
│   ├── hooks/                   … React カスタムフック
│   ├── lib/                     … 業務ロジック・表示ユーティリティ
│   └── types/                   … TypeScript 型定義
├── docs/                        … 設計・仕様ドキュメント
├── package.json                 … npm scripts / 依存関係
├── next.config.js               … Next.js 設定
├── tailwind.config.ts           … Tailwind CSS 設定
└── tsconfig.json                … TypeScript 設定
```

## 参照ルール

- `@/` は `src/` を指します。例: `@/types`, `@/lib/format-utils`
- 画面専用部品は、利用する画面の近くに `_components/` として置きます。
- 複数画面で使う部品だけを `src/components/shared/` に置きます。
- APIルートは `src/app/api/` に置き、業務計算は `src/lib/` へ分離します。

## 画面とAPI

```text
src/app/
├── layout.tsx                   … 全画面共通レイアウト
├── page.tsx                     … ルート。/marketplace へ遷移
├── globals.css                  … Tailwind CSS 読み込み
├── about/page.tsx               … PoC概要
├── marketplace/
│   ├── page.tsx                 … 商品一覧画面
│   ├── _components/             … 商品一覧画面の専用部品
│   └── assets/[assetId]/
│       ├── page.tsx             … 商品詳細画面
│       └── _components/         … 商品詳細画面の専用部品
├── finance/
│   ├── apply/
│   │   ├── page.tsx             … 仮審査申込画面
│   │   └── _components/         … 仮審査申込画面の専用部品
│   └── applications/
│       ├── page.tsx             … 申込一覧画面
│       └── [applicationId]/
│           ├── page.tsx         … 申込詳細画面
│           └── _components/     … 申込詳細画面の専用部品
├── merchant/dashboard/page.tsx  … 販売店ダッシュボード
├── admin/dashboard/
│   ├── page.tsx                 … 管理者ダッシュボード
│   └── _components/             … 管理者画面の専用部品
└── api/
    ├── assets/                  … 商品API
    ├── applications/            … 申込API
    ├── finance/quotes/          … 月額試算API
    ├── acceptance/              … 検収API
    └── payouts/                 … 支払API
```

## 共通部品

```text
src/components/shared/
├── GlobalHeader.tsx             … 共通ヘッダー
├── PocDisclaimer.tsx            … PoC注意表記フッター
├── ApiCallViewer.tsx            … APIコール確認パネル
├── LazyApiCallViewer.tsx        … APIコール確認パネルの遅延読み込み
├── YenAmount.tsx                … 円金額表示
└── StatusBadge.tsx              … ステータスバッジ
```

## 業務ロジック・データ・型

```text
src/lib/
├── application-status-rules.ts  … 申込ステータス遷移ルール
├── monthly-payment-calc.ts      … 月額試算計算
├── pre-screening-judge.ts       … 仮審査判定
├── risk-score-calc.ts           … リスクスコア計算
├── rate-table.ts                … 金利テーブル
├── label-maps.ts                … 表示ラベル定義
└── format-utils.ts              … フォーマット関数

src/data/
├── assets.ts                    … 商品マスタ
├── sellers.ts                   … 販売店マスタ
├── buyers.ts                    … 買い手企業マスタ
├── applications.ts              … 申込データ初期値
└── data-store.ts                … PoC用インメモリデータストア

src/types/
├── asset.ts                     … 商品の型
├── seller.ts                    … 販売店の型
├── buyer.ts                     … 買い手企業の型
├── quote.ts                     … 見積の型
├── application.ts               … 申込の型
├── risk.ts                      … リスク評価の型
├── payout.ts                    … 販売店支払の型
├── api-debug.ts                 … APIコール履歴の型
└── index.ts                     … まとめエクスポート
```

## 命名方針

| 種別 | 置き場所 | 方針 |
|------|----------|------|
| 画面 | `src/app/**/page.tsx` | URL構造に合わせる |
| 画面専用部品 | `src/app/**/_components/` | 使う画面の近くに置く |
| 共通部品 | `src/components/shared/` | 2画面以上で使うものだけ置く |
| 業務ロジック | `src/lib/` | UIから分離し、APIと画面の両方から使える形にする |
| モックデータ | `src/data/` | PoCの初期データと状態管理を置く |
| 型定義 | `src/types/` | 業務概念ごとに分け、`src/types/index.ts` で再エクスポートする |

## 代表的な探し方

| やりたいこと | 見る場所 |
|--------------|----------|
| 商品一覧を変更したい | `src/app/marketplace/` |
| 商品詳細・月額試算を変更したい | `src/app/marketplace/assets/[assetId]/` と `src/lib/monthly-payment-calc.ts` |
| 仮審査申込を変更したい | `src/app/finance/apply/` と `src/lib/pre-screening-judge.ts` |
| 申込ステータスを変更したい | `src/lib/application-status-rules.ts` |
| 管理者画面を変更したい | `src/app/admin/dashboard/` |
| APIコール表示を変更したい | `src/components/shared/ApiCallViewer.tsx` |
| 型を追加したい | `src/types/` |

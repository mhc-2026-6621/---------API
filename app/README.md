# app

エンベデットリースAPIの実装本体です。Next.js App Router、TypeScript、Tailwind CSSで構成しています。

## 開発コマンド

```powershell
npm install
npm run dev
npm run build
npm test
npm run lint
```

| コマンド | 用途 |
|---|---|
| `npm run dev` | 開発サーバーをポート3001で起動 |
| `npm run build` | 本番ビルドの確認 |
| `npm test` | テンプレート準拠のsmoke testを実行 |
| `npm run start` | ビルド済みアプリをポート3001で起動 |
| `npm run lint` | Next.js ESLintを実行 |

## 推奨構成

```text
app/
├── src/
│   ├── app/           # ルーティング、ページ、APIエンドポイント
│   ├── components/    # 複数画面で使うUI部品
│   ├── contexts/      # React Context
│   ├── data/          # モック、固定マスタ、初期データ
│   ├── hooks/         # カスタムフック
│   ├── lib/           # 業務ロジック、計算、表示ユーティリティ
│   └── types/         # 型定義、API契約
├── public/            # 静的ファイル
├── tests/             # smoke test / 将来のE2Eテスト
├── data-store/        # ローカル実行時データの置き場
└── package.json
```

## 配置ルール

- URLやAPIルートに対応するファイルは `src/app/` に置く。
- 複数画面で使うUIは `src/components/shared/` に置く。
- 画面専用部品は、利用する画面フォルダ直下の `_components/` に配置する。
- UIに依存しない業務ロジックは `src/lib/` に置く。
- API契約や業務概念の型は `src/types/` に置く。
- モックやseedデータは `src/data/` に置く。
- 実行時に更新されるデータを追加する場合は `data-store/` に分離する。

## 環境変数

このPoCは外部APIや秘密情報を使いません。環境変数が必要になった場合は `.env.example` にキー名と用途を追加し、実値は `.env.local` に設定してください。
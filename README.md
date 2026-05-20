# エンベデットリースAPI

高額B2Bアセット購入時の月額試算、仮審査申込、審査管理、販売店支払確認を一連のデモとして確認できるPoCサービスです。

## 構成

```text
エンベデットリースAPI/
├── docs/    # 設計資料、仕様、意思決定記録
└── app/     # Next.js 実装本体
```

## 正本

- 設計資料の正本: `docs/00_サービス概要.md` から `docs/09_将来拡張計画.md`
- 実装本体の正本: `app/src/`
- 開発手順の正本: `app/README.md`
- 作業ルールの正本: `app/AGENTS.md`

## 起動

別PCへコピーして起動する場合は、ブラウザで開ける [起動手順書.html](起動手順書.html) を参照してください。

```powershell
cd app
npm install
npm run dev
```

開発サーバーは `http://localhost:3001` で起動します。

## 主要画面

| URL | 概要 |
|---|---|
| `/marketplace` | アセット一覧 |
| `/marketplace/assets/[assetId]` | アセット詳細と月額試算 |
| `/finance/apply` | 仮審査申込 |
| `/finance/applications` | 申込一覧 |
| `/merchant/dashboard` | 販売店ダッシュボード |
| `/admin/dashboard` | ファイナンス管理者ダッシュボード |

## ドキュメント

設計資料は `docs/README.md` を入口として参照してください。更新対象の正本は番号付きドキュメントです。
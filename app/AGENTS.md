# AI Agent Instructions

このファイルは、AIコーディングエージェントがエンベデットリースAPIで作業する際の指示書です。

## プロジェクト概要

- サービス名: エンベデットリースAPI
- フレームワーク: Next.js App Router + TypeScript + Tailwind CSS
- パッケージマネージャ: npm
- 開発ポート: 3001

## フォルダ構成

- `src/app/` - ルーティング、ページ、APIエンドポイント
- `src/components/` - 複数画面で使うUI部品
- `src/contexts/` - React Context等の横断状態
- `src/data/` - モック、固定マスタ、初期データ
- `src/hooks/` - カスタムフック
- `src/lib/` - UI非依存の業務ロジック
- `src/types/` - 型定義、API契約
- `tests/` - E2E/統合テスト
- `data-store/` - PoC用ランタイムデータ

## コーディング規約

- TypeScript strictを維持する。
- パスエイリアスは `@/` を使用する。
- ページコンポーネントはdefault export、再利用コンポーネントはnamed exportを基本とする。
- 業務ロジックは `src/lib/` に分離し、UIコンポーネントに直接書かない。
- 金額、ステータス、ロール表示は既存の表示ユーティリティやラベル定義を優先して使う。
- PoCのため、日本語文言はコンポーネント内に直接記述してよい。

## 禁止事項

- `node_modules/` や `.next/` を編集しない。
- `.env.local` や秘密情報をコミットしない。
- 設計変更は `docs/00_サービス概要.md` から `docs/09_将来拡張計画.md` に反映する。

## テストと確認

```powershell
npm run build
npm test
npm run lint
```

UIやAPIの変更後は、関連する画面/APIルートをブラウザまたはcurlで確認する。
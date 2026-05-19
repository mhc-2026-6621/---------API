"use client";

import Link from "next/link";

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/assets",
    summary: "物件一覧取得",
    description: "カテゴリ・価格帯で絞り込み可能。EC事業者の商品ページに物件情報を提供",
    category: "物件",
  },
  {
    method: "GET",
    path: "/api/assets/:assetId",
    summary: "物件詳細取得",
    description: "個別物件の仕様・整備履歴・ファイナンス適格性を返却",
    category: "物件",
  },
  {
    method: "POST",
    path: "/api/finance/quotes",
    summary: "月額試算",
    description: "物件・条件を指定して月額リース料/割賦金をリアルタイム算出。料率内訳・税・手数料を含む",
    category: "試算",
  },
  {
    method: "POST",
    path: "/api/applications",
    summary: "仮審査申込",
    description: "法人情報・物件・希望条件を送信。リスクスコアリング・反社チェックを経て即時に仮審査結果を返却",
    category: "審査",
  },
  {
    method: "GET",
    path: "/api/applications/:id",
    summary: "申込状況照会",
    description: "審査進捗・必要書類・タイムラインを返却。EC事業者のマイページに組み込み可能",
    category: "審査",
  },
  {
    method: "PATCH",
    path: "/api/applications/:id/status",
    summary: "ステータス更新",
    description: "審査ステータスの遷移。許可された遷移パスのみ受け付け",
    category: "審査",
  },
  {
    method: "POST",
    path: "/api/acceptance",
    summary: "検収報告",
    description: "納品完了・検収合格を報告。販売店への支払プロセスを開始するトリガー",
    category: "実行",
  },
  {
    method: "POST",
    path: "/api/payouts",
    summary: "販売店支払",
    description: "検収完了後の販売店への支払をスケジューリング。支払予定日・金額を返却",
    category: "実行",
  },
];

const FLOW_STEPS = [
  {
    step: "1",
    title: "物件掲載",
    actor: "EC事業者",
    api: "GET /assets",
    description: "EC事業者の商品ページにリース対応物件を表示。ファイナンス適格バッジで差別化",
    color: "bg-blue-50 border-blue-200",
    iconColor: "bg-blue-600",
  },
  {
    step: "2",
    title: "月額試算",
    actor: "買い手",
    api: "POST /finance/quotes",
    description: "商品ページ上のウィジェットで月額リース料をリアルタイム試算。購買意思決定を促進",
    color: "bg-cyan-50 border-cyan-200",
    iconColor: "bg-cyan-600",
  },
  {
    step: "3",
    title: "仮審査",
    actor: "買い手",
    api: "POST /applications",
    description: "EC上のフォームから法人情報を入力。30秒以内に仮承認/追加確認/否決を即時回答",
    color: "bg-green-50 border-green-200",
    iconColor: "bg-green-600",
  },
  {
    step: "4",
    title: "本審査・契約",
    actor: "リース会社",
    api: "PATCH /status",
    description: "リース会社内部で書類審査・現地確認・稟議を実施。結果はAPIでEC側に通知",
    color: "bg-purple-50 border-purple-200",
    iconColor: "bg-purple-600",
  },
  {
    step: "5",
    title: "納品・検収",
    actor: "買い手 / EC事業者",
    api: "POST /acceptance",
    description: "物件納品後、買い手が検収完了を報告。EC事業者経由でAPIに通知",
    color: "bg-teal-50 border-teal-200",
    iconColor: "bg-teal-600",
  },
  {
    step: "6",
    title: "販売店支払・請求開始",
    actor: "リース会社",
    api: "POST /payouts",
    description: "EC事業者へ一括支払。買い手には月額請求を開始。EC事業者は即時入金で在庫回転率向上",
    color: "bg-amber-50 border-amber-200",
    iconColor: "bg-amber-600",
  },
];

const SCOPE_ITEMS = {
  api: [
    { name: "月額試算エンジン", detail: "料率計算・残価評価・税計算・手数料計算" },
    { name: "リスクスコアリング", detail: "信用×0.5 + アセット×0.3 + 販売店×0.2 の加重評価" },
    { name: "仮審査即時判定", detail: "70点以上→仮承認 / 45-69点→追加確認 / 45点未満→否決" },
    { name: "ステータス管理", detail: "試算→仮審査→本審査→契約→納品→検収→支払→請求→満了" },
    { name: "物件適格性評価", detail: "カテゴリ別料率・耐用年数チェック・整備履歴評価" },
  ],
  integration: [
    { name: "反社チェック", detail: "外部データベース照会（日経テレコン等）をAPI内部でラップ" },
    { name: "信用情報照会", detail: "CIC/JICC等の照会結果をスコアリングに反映" },
    { name: "電子契約", detail: "クラウドサイン/DocuSign等と連携し署名URLを生成" },
    { name: "請求管理", detail: "月額請求スケジュールを請求システムに連携" },
    { name: "口座振替", detail: "買い手の口座振替登録・引落し処理との連携" },
  ],
  internal: [
    { name: "本審査ワークフロー", detail: "現地調査・保証人確認・稟議承認等の社内プロセス" },
    { name: "承認権限管理", detail: "金額帯別の稟議フロー・決裁権限の管理" },
    { name: "監査ログ", detail: "操作履歴・審査証跡の記録と保管" },
    { name: "販売店管理", detail: "加盟審査・グレード管理・支払条件設定" },
    { name: "債権管理", detail: "延滞管理・督促・回収業務" },
  ],
};

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-100 text-green-800",
  POST: "bg-blue-100 text-blue-800",
  PATCH: "bg-amber-100 text-amber-800",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">エンベデットリースAPI</h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          B2B ECサイトに<span className="font-bold text-primary">リース・割賦決済</span>を組み込むためのAPI。
          <br />
          高額アセット（建機・工作機械・産業設備等）の購入体験に、
          <br />
          月額試算から審査・契約・支払までのファイナンス機能をシームレスに統合します。
        </p>
      </section>

      {/* What is this */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b-2 border-primary pb-2">このAPIが解決する課題</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-border p-6 space-y-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🏪</div>
            <h3 className="font-bold">EC事業者（販売店）の課題</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              高額商品は「一括払いの壁」で成約率が低い。
              月額払いオプションを提供したいが、自社で与信審査・債権管理を行うのは困難。
            </p>
            <div className="bg-blue-50 rounded px-3 py-2 text-sm">
              <span className="font-bold text-blue-700">APIで解決:</span>
              <span className="text-blue-600"> 数行のAPI組込みで月額決済を追加。与信・回収はリース会社が担当</span>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-6 space-y-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">🏢</div>
            <h3 className="font-bold">買い手企業の課題</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              1,000万円超の設備投資は稟議・資金調達に時間がかかる。
              リース利用を検討しても、リース会社との別途やり取りが煩雑。
            </p>
            <div className="bg-green-50 rounded px-3 py-2 text-sm">
              <span className="font-bold text-green-700">APIで解決:</span>
              <span className="text-green-600"> EC上で試算→申込→審査が完結。30秒で仮審査結果を取得</span>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-6 space-y-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🏦</div>
            <h3 className="font-bold">リース会社の課題</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              従来の営業チャネル（訪問・電話）では接点が限られる。
              EC経由の新規案件を効率的に取り込む仕組みがない。
            </p>
            <div className="bg-purple-50 rounded px-3 py-2 text-sm">
              <span className="font-bold text-purple-700">APIで解決:</span>
              <span className="text-purple-600"> EC事業者のトラフィックを案件化。自動審査で営業コスト削減</span>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Flow */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b-2 border-primary pb-2">取引フロー</h2>
        <p className="text-sm text-text-secondary">
          EC事業者のサイトにAPIを組み込むことで、以下のフローを実現します。各ステップで呼び出すAPIエンドポイントを併記しています。
        </p>
        <div className="space-y-4">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.step} className={`rounded-lg border p-5 ${step.color}`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 ${step.iconColor} text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0`}>
                  {step.step}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <span className="text-xs bg-white/80 border rounded px-2 py-0.5 text-text-secondary">
                      {step.actor}
                    </span>
                    <code className="text-xs bg-white/80 border rounded px-2 py-0.5 font-mono text-accent">
                      {step.api}
                    </code>
                  </div>
                  <p className="text-sm text-text-secondary">{step.description}</p>
                </div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="ml-4 mt-2 text-gray-400 text-lg">↓</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Scope Diagram */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b-2 border-primary pb-2">APIの責務範囲</h2>
        <p className="text-sm text-text-secondary">
          エンベデットリースAPIは3層構造で設計されています。EC事業者が意識するのは最上位の公開APIのみです。
        </p>

        <div className="space-y-6">
          {/* API Layer */}
          <div className="bg-green-50 rounded-lg border-2 border-green-300 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded">公開API</span>
              <h3 className="font-bold text-green-900">エンベデットリースAPI（EC事業者が呼び出す）</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SCOPE_ITEMS.api.map((item) => (
                <div key={item.name} className="bg-white rounded border border-green-200 p-3">
                  <p className="font-bold text-sm text-green-800">{item.name}</p>
                  <p className="text-xs text-text-secondary mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Layer */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center text-gray-400">
              <span className="text-xs">API内部で連携</span>
              <span className="text-2xl">↕</span>
            </div>
          </div>
          <div className="bg-amber-50 rounded-lg border-2 border-amber-300 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded">外部連携</span>
              <h3 className="font-bold text-amber-900">APIが内部でラップする外部システム</h3>
            </div>
            <p className="text-xs text-amber-700">EC事業者はこれらのシステムを意識する必要はありません。APIが1つのインターフェースとして抽象化します。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SCOPE_ITEMS.integration.map((item) => (
                <div key={item.name} className="bg-white rounded border border-amber-200 p-3">
                  <p className="font-bold text-sm text-amber-800">{item.name}</p>
                  <p className="text-xs text-text-secondary mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Layer */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center text-gray-400">
              <span className="text-xs">API対象外</span>
              <span className="text-2xl">↕</span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg border-2 border-slate-300 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-slate-600 text-white text-xs font-bold px-2.5 py-1 rounded">社内業務</span>
              <h3 className="font-bold text-slate-700">リース会社内部システム（APIスコープ外）</h3>
            </div>
            <p className="text-xs text-slate-500">リース会社が自社の業務システムで運用する領域です。APIとは管理者向けWebhookやバッチ連携で接続します。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SCOPE_ITEMS.internal.map((item) => (
                <div key={item.name} className="bg-white rounded border border-slate-200 p-3">
                  <p className="font-bold text-sm text-slate-700">{item.name}</p>
                  <p className="text-xs text-text-secondary mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b-2 border-primary pb-2">APIエンドポイント一覧</h2>
        <p className="text-sm text-text-secondary">
          本PoCで実装済みのエンドポイントです。各APIはデモ画面から実際に呼び出すことができます。
        </p>
        <div className="space-y-3">
          {(["物件", "試算", "審査", "実行"] as const).map((category) => (
            <div key={category}>
              <h3 className="text-sm font-bold text-text-secondary mb-2 mt-4">{category}</h3>
              {API_ENDPOINTS.filter((e) => e.category === category).map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="bg-white rounded-lg border border-border p-4 mb-2 flex items-start gap-4"
                >
                  <span
                    className={`text-xs font-mono font-bold px-2 py-1 rounded shrink-0 ${METHOD_COLORS[endpoint.method]}`}
                  >
                    {endpoint.method}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <code className="text-sm font-mono font-bold text-primary">{endpoint.path}</code>
                      <span className="text-sm text-text-secondary">{endpoint.summary}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{endpoint.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Business Model */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b-2 border-primary pb-2">ビジネスモデル</h2>
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-3 font-bold border-b">ステークホルダー</th>
                <th className="text-left px-4 py-3 font-bold border-b">メリット</th>
                <th className="text-left px-4 py-3 font-bold border-b">収益/コスト</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏪</span>
                    EC事業者（販売店）
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <ul className="list-disc list-inside space-y-1">
                    <li>高額商品の成約率向上（+12.5%実績）</li>
                    <li>検収後に一括入金。在庫回転率の改善</li>
                    <li>与信・回収リスクをリース会社に移転</li>
                  </ul>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  API利用料：無料<br />
                  <span className="text-xs">（リース会社がスプレッドで回収）</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    買い手企業
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <ul className="list-disc list-inside space-y-1">
                    <li>初期投資を月額化。キャッシュフロー改善</li>
                    <li>EC上で試算→申込が完結。手間削減</li>
                    <li>リース料は経費処理可能（税務メリット）</li>
                  </ul>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  月額リース料：年率5.2〜6.5%<br />
                  <span className="text-xs">（カテゴリ・信用力に応じて変動）</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏦</span>
                    リース会社
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <ul className="list-disc list-inside space-y-1">
                    <li>EC経由で新規案件を自動取込</li>
                    <li>自動審査で営業コスト削減</li>
                    <li>多数のEC事業者に展開しスケールメリット</li>
                  </ul>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  スプレッド：調達金利との利鞘<br />
                  <span className="text-xs">（手数料・保証金収入も）</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Risk Scoring */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b-2 border-primary pb-2">リスクスコアリングモデル</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">信用スコア</h3>
              <span className="text-2xl font-bold text-primary">x 0.5</span>
            </div>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex justify-between"><span>法人年数（10年以上）</span><span className="font-mono">+25pt</span></li>
              <li className="flex justify-between"><span>年商レンジ（10億以上）</span><span className="font-mono">+20pt</span></li>
              <li className="flex justify-between"><span>業種安定性（建設・製造）</span><span className="font-mono">+5pt</span></li>
              <li className="flex justify-between"><span>代表者保証</span><span className="font-mono">+10pt</span></li>
              <li className="flex justify-between"><span>決算書提出</span><span className="font-mono">+10pt</span></li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">アセットスコア</h3>
              <span className="text-2xl font-bold text-accent">x 0.3</span>
            </div>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex justify-between"><span>製造番号あり</span><span className="font-mono">+20pt</span></li>
              <li className="flex justify-between"><span>状態ランクA/B+</span><span className="font-mono">+20-25pt</span></li>
              <li className="flex justify-between"><span>年式（3年以内）</span><span className="font-mono">+20pt</span></li>
              <li className="flex justify-between"><span>点検レポートあり</span><span className="font-mono">+15pt</span></li>
              <li className="flex justify-between"><span>所有権・担保権確認</span><span className="font-mono">+20pt</span></li>
            </ul>
          </div>
          <div className="bg-white rounded-lg border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">販売店スコア</h3>
              <span className="text-2xl font-bold text-green-600">x 0.2</span>
            </div>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex justify-between"><span>認定販売店</span><span className="font-mono">+50pt</span></li>
              <li className="flex justify-between"><span>リスクグレードA</span><span className="font-mono">+30pt</span></li>
              <li className="flex justify-between"><span>ベースポイント</span><span className="font-mono">+20pt</span></li>
            </ul>
            <div className="border-t pt-3 mt-3">
              <p className="text-xs text-text-secondary">
                <span className="font-bold">判定基準：</span>
                70点以上→仮承認 / 45-69点→追加確認 / 45点未満→否決
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Navigation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b-2 border-primary pb-2">デモ画面一覧</h2>
        <p className="text-sm text-text-secondary">
          本PoCでは、3つのロール（買い手・販売店・管理者）のデモ画面を実装しています。
          右上のロール切替で各画面にアクセスできます。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "アセットマーケットプレイス", href: "/marketplace", role: "Buyer", description: "物件一覧・検索。EC事業者の商品ページに相当", icon: "🛒" },
            { title: "物件詳細・月額試算", href: "/marketplace/assets/asset_001", role: "Buyer", description: "物件情報と月額シミュレーター。Quotes APIの動作確認", icon: "🔢" },
            { title: "仮審査申込", href: "/finance/apply?assetId=asset_001", role: "Buyer", description: "法人情報入力→即時審査。Applications APIの動作確認", icon: "📋" },
            { title: "申込詳細", href: "/finance/applications/app_001", role: "Buyer", description: "審査進捗・タイムライン・必要書類の確認", icon: "📄" },
            { title: "販売店ダッシュボード", href: "/merchant/dashboard", role: "Merchant", description: "KPI・成約状況・支払予定の確認。販売店向けポータル", icon: "📊" },
            { title: "管理者ダッシュボード", href: "/admin/dashboard", role: "Admin", description: "審査キュー・リスクスコア確認・ステータス変更", icon: "🔍" },
          ].map((screen) => (
            <Link
              key={screen.href}
              href={screen.href}
              className="bg-white rounded-lg border border-border p-4 hover:border-accent hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{screen.icon}</span>
                <span className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{screen.role}</span>
              </div>
              <h3 className="font-bold text-sm group-hover:text-accent transition-colors">{screen.title}</h3>
              <p className="text-xs text-text-secondary mt-1">{screen.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b-2 border-primary pb-2">技術構成</h2>
        <div className="bg-white rounded-lg border border-border p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-bold text-text-secondary text-xs mb-1">フロントエンド</p>
              <p>Next.js 14 (App Router)</p>
              <p>React 18 + TypeScript</p>
              <p>Tailwind CSS</p>
            </div>
            <div>
              <p className="font-bold text-text-secondary text-xs mb-1">API</p>
              <p>Next.js Route Handlers</p>
              <p>RESTful JSON API</p>
              <p>モック（インメモリDB）</p>
            </div>
            <div>
              <p className="font-bold text-text-secondary text-xs mb-1">業務ロジック</p>
              <p>PMT月額計算</p>
              <p>リスクスコアリング</p>
              <p>ステータス管理</p>
            </div>
            <div>
              <p className="font-bold text-text-secondary text-xs mb-1">デモ機能</p>
              <p>ロール切替</p>
              <p>APIデバッグパネル</p>
              <p>サンプルデータ自動入力</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-text-secondary text-center">
          本プロトタイプはPoC目的のモックです。本番環境への適用には認証・暗号化・外部システム連携等の追加実装が必要です。
        </p>
      </section>
    </div>
  );
}

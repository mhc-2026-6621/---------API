import "./globals.css";
import { RoleProvider } from "@/contexts/RoleProvider";
import { ApiCallLogProvider } from "@/contexts/ApiCallLogProvider";
import { GlobalHeader } from "@/components/shared/GlobalHeader";
import { PocDisclaimer } from "@/components/shared/PocDisclaimer";
import { LazyApiCallViewer } from "@/components/shared/LazyApiCallViewer";

export const metadata = {
  title: "エンベデットリースAPI - PoCプロトタイプ",
  description: "B2B ECエンベデッドリース/割賦ファイナンスAPIのPoCプロトタイプ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-background text-text-primary min-h-screen flex flex-col">
        <RoleProvider>
          <ApiCallLogProvider>
            <GlobalHeader />
            <main className="flex-1">{children}</main>
            <PocDisclaimer />
            <LazyApiCallViewer />
          </ApiCallLogProvider>
        </RoleProvider>
      </body>
    </html>
  );
}

import { Sidebar } from "@/app/components/sidebar";
import { PageHeader } from "@/app/components/header";
import { setRequestLocale } from "next-intl/server";

export default async function AiAgentsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex bg-primary min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <PageHeader namespace="aiAgents" />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

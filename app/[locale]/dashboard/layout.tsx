import { Sidebar } from "@/app/components/sidebar";
import { setRequestLocale } from "next-intl/server";

export default async function DashboardLayout({
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
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";
import { WelcomeContent } from "@/app/components/dashboard/WelcomeContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WelcomeContent />;
}

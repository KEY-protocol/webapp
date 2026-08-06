import { setRequestLocale } from "next-intl/server";
import { InternalAppLayout } from "@/app/components/auth/InternalAppLayout";

export default async function AiAgentsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <InternalAppLayout namespace="aiAgents">{children}</InternalAppLayout>;
}


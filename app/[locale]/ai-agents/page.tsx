import { setRequestLocale } from "next-intl/server";
import AiAgentsDashboard from "@/app/components/ai-agents/AiAgentsDashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AiAgentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 p-8 text-white min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto h-full">
        <AiAgentsDashboard />
      </div>
    </div>
  );
}

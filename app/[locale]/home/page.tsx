import { setRequestLocale } from "next-intl/server";
import { WelcomeContent } from "@/app/components/home/WelcomeContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WelcomeContent />;
}

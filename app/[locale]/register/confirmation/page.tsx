import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ConfirmationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ConfirmationContent />;
}

function ConfirmationContent() {
  const t = useTranslations("auth.confirmation");

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
      <div className="w-full max-w-110 flex flex-col items-center">
        {/* Header section with Icon, Title and Subtitle */}
        <div className="text-center mb-10 space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#28a745]/10 rounded-full flex items-center justify-center mb-2">
            <Mail className="text-[#28a745]" size={40} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-montserrat font-bold text-white tracking-wide">
              {t("title")}
            </h1>
            <p className="text-lg font-poppins text-white/70 max-w-sm mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-6">
          <Link
            href="/"
            className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-poppins font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-950/20"
          >
            {t("backLogin")}
          </Link>

          <div className="text-center">
            <button
              type="button"
              className="text-sm font-poppins text-white/80 hover:text-white hover:underline transition-all cursor-pointer"
            >
              {t("resendEmail")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

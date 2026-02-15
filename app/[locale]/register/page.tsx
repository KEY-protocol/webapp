import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RegisterContent />;
}

function RegisterContent() {
  const t = useTranslations("auth.register");

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
      <div className="w-full max-w-110 flex flex-col items-center">
        {/* Header section with Title and Subtitle */}
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl font-montserrat font-bold text-white tracking-wide">
            {t("title")}
          </h1>
          <p className="text-lg font-poppins text-white/70">{t("subtitle")}</p>
        </div>

        {/* Register Form */}
        <form className="w-full space-y-6">
          <div className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-poppins text-white ml-1">
                {t("fullNameLabel")}
              </label>
              <input
                type="text"
                placeholder={t("fullNamePlaceholder")}
                className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-poppins text-white ml-1">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
              />
            </div>

            {/* Organization Field */}
            <div className="space-y-2">
              <label className="block text-sm font-poppins text-white ml-1">
                {t("organizationLabel")}
              </label>
              <input
                type="text"
                placeholder={t("organizationPlaceholder")}
                className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
              />
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label className="block text-sm font-poppins text-white ml-1">
                {t("roleLabel")}
              </label>
              <input
                type="text"
                placeholder={t("rolePlaceholder")}
                className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-poppins text-white ml-1">
                {t("passwordLabel")}
              </label>
              <input
                type="password"
                placeholder={t("passwordPlaceholder")}
                className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-poppins text-white ml-1">
                {t("confirmPasswordLabel")}
              </label>
              <input
                type="password"
                placeholder={t("confirmPasswordPlaceholder")}
                className="w-full bg-[#1a2b15] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#28a745]/50 transition-all font-poppins shadow-inner"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <Link
              href="/register/confirmation"
              className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-poppins font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-950/20 cursor-pointer"
            >
              {t("submit")}
            </Link>

            <Link
              href="/"
              className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-poppins font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-green-950/20"
            >
              <ArrowLeft size={18} />
              {t("backHome")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 p-8 text-white min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-montserrat font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-xl font-poppins text-white/70">
          Panel de control en construcción.
        </p>
      </div>
    </div>
  );
}

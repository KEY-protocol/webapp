import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TechniciansPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <p className="text-white/60">Contenido de Tecnicos en desarrollo...</p>
      </div>
    </div>
  );
}

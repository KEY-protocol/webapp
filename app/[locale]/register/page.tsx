import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
      <h1 className="text-4xl font-montserrat font-bold text-white">hola</h1>
    </div>
  );
}

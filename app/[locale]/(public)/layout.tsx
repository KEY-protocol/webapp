import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="grow flex flex-col">{children}</main>
      <Footer />
    </>
  );
}

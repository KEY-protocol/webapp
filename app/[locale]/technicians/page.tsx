import { setRequestLocale } from "next-intl/server";
import TechnicianCard from "@/app/components/technicians/TechnicianCard";

type Props = {
  params: Promise<{ locale: string }>;
};

// Hardcoded data for simulation
const MOCK_TECHNICIANS = [
  {
    id_card: "1",
    name: "Carlos Ventura",
    role: "Tecnico Territorial",
    id: "00000000",
    birthDate: "dd/mm/aaaa",
    project: "Proyecto uno",
    expertise: "Agromonte, Ganaderia Mayor, Ganaderia Menor",
    zone: "Las Pircas, Salta",
    wallet: "00000000-0000",
    did: "0000000000000",
  },
  {
    id_card: "2",
    name: "Carlos Ventura",
    role: "Tecnico Territorial",
    id: "00000000",
    birthDate: "dd/mm/aaaa",
    project: "Proyecto uno",
    expertise: "Agromonte, Ganaderia Mayor, Ganaderia Menor",
    zone: "Las Pircas, Salta",
    wallet: "00000000-0000",
    did: "0000000000000",
  },
  {
    id_card: "3",
    name: "Carlos Ventura",
    role: "Tecnico Territorial",
    id: "00000000",
    birthDate: "dd/mm/aaaa",
    project: "Proyecto uno",
    expertise: "Agromonte, Ganaderia Mayor, Ganaderia Menor",
    zone: "Las Pircas, Salta",
    wallet: "00000000-0000",
    did: "0000000000000",
  },
];

export default async function TechniciansPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 p-6 md:p-10 bg-primary min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          {MOCK_TECHNICIANS.map((tech) => (
            <TechnicianCard
              key={tech.id_card}
              name={tech.name}
              role={tech.role}
              id={tech.id}
              birthDate={tech.birthDate}
              project={tech.project}
              expertise={tech.expertise}
              zone={tech.zone}
              wallet={tech.wallet}
              did={tech.did}
            />
          ))}
        </div>

        {/* TODO: Implement pagination or infinite scroll when integrated with backend */}
        {/* TODO: Fetch data from server once API is ready */}
      </div>
    </div>
  );
}

import { setRequestLocale, getTranslations } from "next-intl/server";
import ProjectSelector from "./_components/ProjectSelector";
import TrainingGrid from "./_components/TrainingGrid";

type Props = {
  params: Promise<{ locale: string }>;
};

// TODO: In the future, fetch this data from the server
const TRAINING_DATA = [
  {
    id: 1,
    title: "Agromonte",
    modules: 5,
    objectiveCount: 2000,
    objective: "Formar productores en técnicas de riego",
    zone: "Las Pircas, Salta",
  },
  {
    id: 2,
    title: "Ganaderia Menor",
    modules: 5,
    objectiveCount: 2000,
    objective: "Optimización de cría de caprinos",
    zone: "Las Pircas, Salta",
  },
  {
    id: 3,
    title: "Ganaderia Mayor",
    modules: 5,
    objectiveCount: 2000,
    objective: "Manejo reproductivo bovino",
    zone: "Las Pircas, Salta",
  },
  {
    id: 4,
    title: "Apicultura",
    modules: 5,
    objectiveCount: 2000,
    objective: "Producción de miel orgánica",
    zone: "Las Pircas, Salta",
  },
  {
    id: 5,
    title: "Algarroba",
    modules: 5,
    objectiveCount: 2000,
    objective: "Procesamiento de harina de algarroba",
    zone: "Las Pircas, Salta",
  },
  {
    id: 6,
    title: "Artesania",
    modules: 5,
    objectiveCount: 2000,
    objective: "Técnicas de tejido ancestral",
    zone: "Las Pircas, Salta",
  },
];

export default async function TrainingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("training_page");

  // Hardcoded projects for the dropdown
  const projects = [
    { id: "one", name: t("projects_list.one") },
    { id: "alpha", name: t("projects_list.alpha") },
    { id: "beta", name: t("projects_list.beta") },
    { id: "livestock", name: t("projects_list.livestock") },
  ];

  return (
    <div className="flex-1 p-8 text-white animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Project Selector Section */}
        <ProjectSelector
          label={t("project_label")}
          placeholder={t("project_placeholder")}
          projects={projects}
        />

        {/* Training Cards Grid (Client Component) */}
        <TrainingGrid initialData={TRAINING_DATA} />
      </div>
    </div>
  );
}

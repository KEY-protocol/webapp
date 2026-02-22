import { setRequestLocale, getTranslations } from "next-intl/server";
import { PenTool } from "lucide-react";
import ProjectSelector from "./_components/ProjectSelector";

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
    zone: "Las Pircas, Salta",
  },
  {
    id: 2,
    title: "Ganaderia Menor",
    modules: 5,
    objectiveCount: 2000,
    zone: "Las Pircas, Salta",
  },
  {
    id: 3,
    title: "Ganaderia Mayor",
    modules: 5,
    objectiveCount: 2000,
    zone: "Las Pircas, Salta",
  },
  {
    id: 4,
    title: "Apicultura",
    modules: 5,
    objectiveCount: 2000,
    zone: "Las Pircas, Salta",
  },
  {
    id: 5,
    title: "Algarroba",
    modules: 5,
    objectiveCount: 2000,
    zone: "Las Pircas, Salta",
  },
  {
    id: 6,
    title: "Artesania",
    modules: 5,
    objectiveCount: 2000,
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

        {/* Training Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {TRAINING_DATA.map((training) => (
            <div
              key={training.id}
              className="bg-[#24421A] border border-white/5 rounded-3xl p-8 flex flex-col space-y-6 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white rounded-full p-3 flex items-center justify-center shadow-lg">
                    <PenTool className="w-8 h-8 text-[#24421A]" />
                  </div>
                  <h2 className="text-3xl font-bold font-montserrat tracking-tight">
                    {training.title}
                  </h2>
                </div>
                <button
                  type="button"
                  className="border border-white/40 rounded-full px-5 py-1 text-xs font-bold tracking-widest hover:bg-white/10 transition-colors"
                >
                  {t("edit_button")}
                </button>
                {/* TODO: Implement edit functionality */}
              </div>

              <div className="space-y-1 pt-2">
                <p className="font-poppins text-xl">
                  <span className="font-bold">{t("modules")}:</span>{" "}
                  {training.modules}
                </p>
                <p className="font-poppins text-xl">
                  <span className="font-bold">{t("objective")}:</span>{" "}
                  {t("train_people", { count: training.objectiveCount })}
                </p>
                <p className="font-poppins text-xl">
                  <span className="font-bold">{t("zone")}:</span>{" "}
                  {training.zone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { StatCard } from "./_components/StatCard";
import { HorizontalBarChart } from "./_components/HorizontalBarChart";
import { PieChartComponent } from "./_components/PieChartComponent";
import { AgeDistributionChart } from "./_components/AgeDistributionChart";
import { MetricsTable } from "./_components/MetricsTable";
import { ProjectRankChart } from "./_components/ProjectRankChart";
import { TreemapComponent } from "./_components/TreemapComponent";

type Props = {
  params: Promise<{ locale: string }>;
};

// TODO: Estos datos deben ser traídos desde el servidor mediante un fetch a la API
const MOCK_DATA = {
  stats: [
    { key: "projects", value: "1.524" },
    { key: "assignedFunds", value: "1.524" },
    { key: "skillCertificates", value: "1.524" },
  ],
  secondary_stats: [
    { key: "attendeesCount", value: "1.524" },
    { key: "age", value: "39" },
    { key: "originaries", value: "78%" },
  ],
  categories: [
    { key: "sustainableProduction", value: 623 },
    { key: "climateChange", value: 558 },
    { key: "regenerative", value: 176 },
    { key: "productiveImprovement", value: 66 },
    { key: "commercialization", value: 58 },
    { key: "beekeeping", value: 22 },
    { key: "crafts", value: 18 },
    { key: "digitalLiteracy", value: 13 },
  ],
  regions: [
    { key: "formosa", value: 41.5, color: "#4B86D4" },
    { key: "chaco", value: 28.4, color: "#ED8936" },
    { key: "salta", value: 26.8, color: "#9F7AEA" },
    { key: "santiago", value: 3.3, color: "#A0AEC0" },
  ],
  gender: [
    { key: "female", value: 26.5, color: "#ED8936" },
    { key: "male", value: 73.5, color: "#4B86D4" },
  ],
  ageDistribution: Array.from({ length: 13 }, (_, i) => ({
    age: 16 + i * 5,
    count: Math.floor(Math.random() * 40) + 10,
  })),
  tableData: [
    { key: "sustainableProduction", men: 158, women: 465, total: 623 },
    { key: "climateChange", men: 139, women: 419, total: 558 },
    { key: "regenerative", men: 62, women: 114, total: 176 },
    { key: "productiveImprovement", men: 11, women: 55, total: 66 },
    { key: "commercialization", men: 13, women: 45, total: 58 },
    { key: "beekeeping", men: 14, women: 8, total: 22 },
    { key: "crafts", men: 6, women: 12, total: 18 },
    { key: "digitalLiteracy", men: 3, women: 10, total: 13 },
  ],
  treemapData: [
    { key: "crafts", size: 400 },
    { key: "livestock", size: 300 },
    { key: "carob", size: 200 },
    { key: "others", size: 100 },
  ],
  rankData: [
    { name: "Hinaj", value: 90 },
    { name: "Los Baldes", value: 40 },
    { name: "Productor", value: 30 },
    { name: "UPSAN", value: 25 },
    { name: "Lactatalaycqte", value: 22 },
    { name: "La Corzuela", value: 18 },
    { name: "Dragones", value: 15 },
    { name: "Chitsaj", value: 12 },
    { name: "Comunidad Educativa", value: 10 },
    { name: "Chohot", value: 8 },
  ],
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dashboard_page");

  // Traducir datos para los gráficos
  const translatedCategories = MOCK_DATA.categories.map((c) => ({
    name: t(`categories.${c.key}`),
    value: c.value,
  }));

  const translatedRegions = MOCK_DATA.regions.map((r) => ({
    name: t(`regions.${r.key}`),
    value: r.value,
    color: r.color,
  }));

  const translatedGender = MOCK_DATA.gender.map((g) => ({
    name: t(`gender_labels.${g.key}`),
    value: g.value,
    color: g.color,
  }));

  const translatedTableData = MOCK_DATA.tableData.map((row) => ({
    category: t(`categories.${row.key}`),
    men: row.men,
    women: row.women,
    total: row.total,
  }));

  const translatedTreemapData = MOCK_DATA.treemapData.map((item) => ({
    name: t(`treemap.${item.key}`),
    size: item.size,
  }));

  return (
    <div className="flex-1 bg-[#2d7d32] p-6 text-white min-h-screen">
      <div className="max-w-400 mx-auto space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_DATA.stats.map((stat) => (
            <StatCard
              key={stat.key}
              title={t(`stats.${stat.key}`)}
              value={stat.value}
            />
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {MOCK_DATA.secondary_stats.map((stat) => (
                <StatCard
                  key={stat.key}
                  title={t(`stats.${stat.key}`)}
                  value={stat.value}
                  variant="small"
                />
              ))}
            </div>
            <HorizontalBarChart data={translatedCategories} />
            <AgeDistributionChart data={MOCK_DATA.ageDistribution} />
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-4 space-y-6">
            <PieChartComponent data={translatedRegions} />
            <PieChartComponent data={translatedGender} innerRadius={60} />
            <TreemapComponent data={translatedTreemapData} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <MetricsTable data={translatedTableData} />
            <ProjectRankChart data={MOCK_DATA.rankData} />
          </div>
        </div>
      </div>
    </div>
  );
}

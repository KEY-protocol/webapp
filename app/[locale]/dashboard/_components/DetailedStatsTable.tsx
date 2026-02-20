"use client";

import { useTranslations } from "next-intl";

interface TableRow {
  tipo: string;
  chaco: string;
  formosa: string;
  salta: string;
  total: string;
}

const DATA: TableRow[] = [
  {
    tipo: "Modulo Chaguaral",
    chaco: "222,08",
    formosa: "0,58",
    salta: "1,63",
    total: "224,29",
  },
  {
    tipo: "Modulo Apicultura",
    chaco: "0",
    formosa: "3.057",
    salta: "3.007",
    total: "6.064",
  },
  {
    tipo: "Modulo Algarroba",
    chaco: "6,36",
    formosa: "0,03",
    salta: "0",
    total: "6,38",
  },
  {
    tipo: "Modulo Ganaderia",
    chaco: "1.606",
    formosa: "162,04",
    salta: "0",
    total: "1.768,04",
  },
  {
    tipo: "Modulo Palma",
    chaco: "8,35",
    formosa: "0",
    salta: "0",
    total: "8,35",
  },
  {
    tipo: "Modulo Agromonte",
    chaco: "0",
    formosa: "0,13",
    salta: "0",
    total: "0,13",
  },
  {
    tipo: "Modulo Vivero",
    chaco: "0",
    formosa: "0",
    salta: "0,06",
    total: "0,06",
  },
];

export const DetailedStatsTable = () => {
  const t = useTranslations("dashboard_page.geo_visualization.table");

  return (
    <div className="bg-[#1a1a1a] rounded-sm overflow-hidden shadow-xl border border-white/5">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#111111]">
          <tr>
            <th className="px-4 py-3 text-xs font-bold text-white uppercase tracking-wider font-montserrat">
              {t("type")}
            </th>
            <th className="px-4 py-3 text-xs font-bold text-white uppercase tracking-wider font-montserrat text-right">
              {t("chaco")}
            </th>
            <th className="px-4 py-3 text-xs font-bold text-white uppercase tracking-wider font-montserrat text-right">
              {t("formosa")}
            </th>
            <th className="px-4 py-3 text-xs font-bold text-white uppercase tracking-wider font-montserrat text-right">
              {t("salta")}
            </th>
            <th className="px-4 py-3 text-xs font-bold text-white uppercase tracking-wider font-montserrat text-right border-l border-white/10">
              {t("total")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-poppins">
          {DATA.map((row, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#222222]"}
            >
              <td className="px-4 py-2.5 text-xs text-gray-300 font-medium">
                {row.tipo}
              </td>
              <td className="px-4 py-2.5 text-xs text-gray-400 text-right">
                {row.chaco}
              </td>
              <td className="px-4 py-2.5 text-xs text-gray-400 text-right">
                {row.formosa}
              </td>
              <td className="px-4 py-2.5 text-xs text-gray-400 text-right">
                {row.salta}
              </td>
              <td className="px-4 py-2.5 text-xs text-white font-semibold text-right border-l border-white/10">
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

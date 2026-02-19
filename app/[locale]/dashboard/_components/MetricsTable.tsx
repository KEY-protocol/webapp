"use client";

import { useTranslations } from "next-intl";

interface MetricsTableRow {
  category: string;
  men: number;
  women: number;
  total: number;
}

interface MetricsTableProps {
  data: MetricsTableRow[];
}

export const MetricsTable = ({ data }: MetricsTableProps) => {
  const t = useTranslations("dashboard_page.charts");

  return (
    <div className="bg-[#1a1a1a] rounded-sm shadow-lg overflow-hidden ">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#2a2a2a]">
          <tr>
            <th className="p-3 text-white/70 font-montserrat text-xs uppercase tracking-wider">
              {t("axis")}
            </th>
            <th className="p-3 text-white/70 font-montserrat text-xs uppercase tracking-wider text-right">
              {t("men")}
            </th>
            <th className="p-3 text-white/70 font-montserrat text-xs uppercase tracking-wider text-right">
              {t("women")}
            </th>
            <th className="p-3 text-white/70 font-montserrat text-xs uppercase tracking-wider text-right">
              {t("total")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-white/5 transition-colors">
              <td className="p-3 text-xs text-white/90">{row.category}</td>
              <td className="p-3 text-xs text-blue-400 text-right font-medium">
                {row.men}
              </td>
              <td className="p-3 text-xs text-red-400 text-right font-medium">
                {row.women}
              </td>
              <td className="p-3 text-xs text-white/70 text-right italic">
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

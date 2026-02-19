"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataItem {
  name: string;
  value: number;
}

interface ProjectRankChartProps {
  data: DataItem[];
}

export const ProjectRankChart = ({ data }: ProjectRankChartProps) => {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded-sm shadow-lg min-h-75 flex flex-col">
      <div className="flex-1 w-full min-w-0">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#fff", fontSize: 10 }}
              width={100}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="value" fill="#4B86D4" radius={[0, 2, 2, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

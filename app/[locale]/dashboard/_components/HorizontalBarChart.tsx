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

interface HorizontalBarChartProps {
  data: DataItem[];
}

export const HorizontalBarChart = ({ data }: HorizontalBarChartProps) => {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded-sm shadow-lg min-h-100 flex flex-col">
      <div className="flex-1 w-full min-w-0">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#fff", fontSize: 11 }}
              width={140}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="value" fill="#4B86D4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataItem {
  age: number;
  count: number;
}

interface AgeDistributionChartProps {
  data: DataItem[];
}

export const AgeDistributionChart = ({ data }: AgeDistributionChartProps) => {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded-sm shadow-lg min-h-75 flex flex-col">
      <div className="flex-1 w-full min-w-0">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#333"
            />
            <XAxis
              dataKey="age"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#fff", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#fff", fontSize: 10 }}
              width={35}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="count" fill="#4B86D4" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

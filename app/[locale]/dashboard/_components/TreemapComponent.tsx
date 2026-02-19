"use client";

import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

interface TreemapComponentProps {
  data: Record<string, unknown>[];
}

// const COLORS = ["#4B86D4", "#63B3ED", "#4299E1", "#3182CE", "#2B6CB0"];

export const TreemapComponent = ({ data }: TreemapComponentProps) => {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded-sm shadow-lg min-h-75 flex flex-col">
      <div className="flex-1 w-full min-w-0">
        <ResponsiveContainer width="100%" height={250}>
          <Treemap data={data} dataKey="size" stroke="#1a1a1a" fill="#4B86D4">
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
              itemStyle={{ color: "#fff" }}
            />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", value: 120000 },
  { month: "Feb", value: 160000 },
  { month: "Mar", value: 220000 },
  { month: "Apr", value: 310000 },
  { month: "May", value: 420000 },
  { month: "Jun", value: 510000 },
];

export default function PerformanceChart() {
  return (
    <div className="bg-[#0B1120] border border-zinc-800 rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Portfolio Performance</h2>

        <p className="text-zinc-400 mt-1">Assets under management growth</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

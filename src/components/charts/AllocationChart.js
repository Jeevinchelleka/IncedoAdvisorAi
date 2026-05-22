"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { formatCurrency, formatNumber } from "@/lib/format";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#f97316"];

const CustomTooltip = ({ active, payload, valueType }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  let displayValue = "";
  if (valueType === "currency") {
    displayValue = formatCurrency(val, true);
  } else if (valueType === "count") {
    displayValue = `${formatNumber(val)} clients`;
  } else {
    displayValue = `${val?.toFixed(1)}%`;
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-xl p-3 shadow-xl">
      <p className="text-xs font-semibold text-white">{payload[0].name}</p>
      <p className="text-sm font-bold text-white mt-0.5">{displayValue}</p>
    </div>
  );
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: entry.color }} />
        <span className="text-xs text-gray-400">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function AllocationChart({
  data = [],
  loading = false,
  title = "Asset Allocation",
  subtitle = "Portfolio diversification by type",
  valueType = "percent"
}) {
  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
        <div className="h-5 w-36 bg-gray-800 rounded animate-pulse mb-6" />
        <div className="h-64 bg-gray-800/30 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5 transition-all duration-300 hover:border-gray-800">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip valueType={valueType} />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

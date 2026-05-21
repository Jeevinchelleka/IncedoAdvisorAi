"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatCurrency, formatMonthKey } from "@/lib/format";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-xl p-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{formatMonthKey(label)}</p>
      <p className="text-sm font-semibold text-white">{formatCurrency(payload[0]?.value, true)}</p>
    </div>
  );
};

export default function PerformanceChart({ data = [], loading = false }) {
  const formatted = data.map((d) => ({ ...d, label: formatMonthKey(d.month) }));

  if (loading) {
    return (
      <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
        <div className="h-5 w-40 bg-gray-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-56 bg-gray-800/50 rounded animate-pulse mb-6" />
        <div className="h-64 bg-gray-800/30 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] border border-[#1f2937] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Portfolio Performance</h2>
          <p className="text-xs text-gray-500 mt-0.5">Total AUM over time</p>
        </div>
        {data.length > 0 && (
          <div className="text-right">
            <p className="text-lg font-bold text-white">
              {formatCurrency(data[data.length - 1]?.value, true)}
            </p>
            <p className="text-xs text-gray-500">Latest</p>
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
          No performance data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={formatted} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v, true)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#perfGradient)"
              dot={false}
              activeDot={{ r: 5, fill: "#3b82f6", stroke: "#0b1120", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

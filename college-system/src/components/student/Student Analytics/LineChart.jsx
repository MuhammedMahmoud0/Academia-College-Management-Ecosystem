import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fallbackData = [
  { name: "Semester 1", semester: "Fall 2021", GPA: 3.5 },
  { name: "Semester 2", semester: "Spring 2022", GPA: 3.6 },
  { name: "Semester 3", semester: "Fall 2022", GPA: 3.7 },
  { name: "Semester 4", semester: "Spring 2023", GPA: 3.8 },
  { name: "Semester 5", semester: "Fall 2023", GPA: 3.6 },
  { name: "Semester 6", semester: "Spring 2024", GPA: 3.4 },
];

export default function GPA_LineChart({ trendData = [], loading = false }) {
  const data = trendData.length > 0 ? trendData : fallbackData;

  return (
    <div className="w-full min-h-[320px] flex flex-col">
      <h2 className="mb-4 text-lg sm:text-xl font-bold text-slate-900">GPA Trend</h2>

      {loading ? (
        <div className="h-[280px] sm:h-[320px] rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-500 text-sm">
          Loading GPA trend...
        </div>
      ) : (
      <div className="w-full h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
          data={data}
          margin={{
            top: 8,
            right: 20,
            left: 4,
            bottom: 8,
          }}
        >
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <XAxis
            dataKey="semester"
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="GPA"
            allowDataOverflow
            tickCount={8}
            width="auto"
            domain={[0, 4]}
            tick={{ fontSize: 11, fill: "#64748B" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [Number(value).toFixed(2), "CGPA"]}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
            }}
          />
          <Line
            type="monotone"
            dataKey="GPA"
            stroke="#4f46e5"
            dot={{ fill: "#4f46e5", r: 4 }}
            activeDot={{ r: 7 }}
            strokeWidth={3}
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
}

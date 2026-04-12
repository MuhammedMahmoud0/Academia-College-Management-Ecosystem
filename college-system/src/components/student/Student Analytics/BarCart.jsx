import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const fallbackData = [
  { grade: "A", count: 8, max: 8 },
  { grade: "A-", count: 5, max: 8 },
  { grade: "B+", count: 4, max: 8 },
  { grade: "B", count: 2, max: 8 },
  { grade: "C+", count: 1, max: 8 },
];

const CustomLabel = (props) => {
  const { x, y, width, height, value } = props;
  return (
    <text
      x={x + width - 15}
      y={y + height / 2}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="12px"
      fontWeight="bold"
    >
      {value}
    </text>
  );
};

const GradesDistribution = ({ distributionData = [], loading = false }) => {
  const maxCount = Math.max(1, ...distributionData.map((item) => Number(item?.count) || 0));
  const chartData = distributionData.length > 0
    ? distributionData.map((item) => ({
        grade: item?.grade || "N/A",
        count: Number(item?.count) || 0,
        max: maxCount,
      }))
    : fallbackData;

  return (
    <div className="w-full min-h-[320px] flex flex-col">
      <h2 className="mb-4 text-lg sm:text-xl font-bold text-slate-900">Grades Distribution</h2>

      {loading ? (
        <div className="h-[280px] sm:h-[300px] rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-500 text-sm">
          Loading grade distribution...
        </div>
      ) : (

      <div className="w-full h-[280px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
          data={chartData}
          layout="vertical"
          barCategoryGap="35%"
          barGap={-25}
          margin={{
            top: 10,
            right: 8,
            left: 8,
            bottom: 10,
          }}
        >
          <XAxis type="number" hide />

          <YAxis
            dataKey="grade"
            type="category"
            width={56}
            tick={{
              dx: -5,
              fontSize: 12,
              fill: "#64748B",
              whiteSpace: "nowrap",
              textAnchor: "start",
            }}
            axisLine={false}
            tickLine={false}
            tickMargin={20}
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
            formatter={(value) => [value, "Count"]}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #CBD5E1",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
            }}
          />

          {/* Background (shadow) bar */}
          <Bar
            dataKey="max"
            fill="#E5E7EB"
            barSize={22}
            radius={[20, 20, 20, 20]}
          />

          {/* Main bar */}
          <Bar
            dataKey="count"
            fill="#4F46E5"
            barSize={22}
            radius={[20, 20, 20, 20]}
            label={<CustomLabel />}
          />
        </BarChart>
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
};

export default GradesDistribution;

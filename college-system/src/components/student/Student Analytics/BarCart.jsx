import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from "recharts";

// #region Sample data
const data = [
  { grade: "A", count: 8, max: 8 },
  { grade: "A-", count: 5, max: 8 },
  { grade: "B+", count: 4, max: 8 },
  { grade: "B", count: 2, max: 8 },
  { grade: "C+", count: 1, max: 8 },
];
// #endregion

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

const GradesDistribution = () => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getChartDimensions = () => {
    if (chartWidth < 640) {
      // Mobile
      return { width: Math.min(chartWidth - 40, 500), height: 350, yAxisWidth: 50, barSize: 24 };
    } else if (chartWidth < 1024) {
      // Tablet
      return { width: Math.min(chartWidth * 0.5, 600), height: 300, yAxisWidth: 60, barSize: 22 };
    } else {
      // Desktop
      return { width: 700, height: 260, yAxisWidth: 70, barSize: 22 };
    }
  };

  const dimensions = getChartDimensions();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "100%",
        height: "auto",
        minHeight: "300px",
        padding: chartWidth < 640 ? "0 10px" : "0 20px",
      }}
    >
      <h2
        style={{
          marginBottom: "15px",
          color: "#1F2937",
          fontSize: chartWidth < 640 ? "16px" : "18px",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        Grades Distribution
      </h2>

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          overflowX: "auto",
        }}
      >
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
          layout="vertical"
          barCategoryGap="35%"
          barGap={-25}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <XAxis type="number" hide />

          <YAxis
            dataKey="grade"
            type="category"
            width={dimensions.yAxisWidth}
            tick={{
              dx: -5,
              fontSize: chartWidth < 640 ? 12 : 14,
              whiteSpace: "nowrap",
              textAnchor: "start",
            }}
            axisLine={false}
            tickLine={false}
            tickMargin={20}
          />

          <Tooltip cursor={{ fill: "transparent" }} />

          {/* Background (shadow) bar */}
          <Bar
            dataKey="max"
            fill="#E5E7EB"
            barSize={dimensions.barSize}
            radius={[20, 20, 20, 20]}
          />

          {/* Main bar */}
          <Bar
            dataKey="count"
            fill="#4F46E5"
            barSize={dimensions.barSize}
            radius={[20, 20, 20, 20]}
            label={<CustomLabel />}
          />
        </BarChart>
      </div>
    </div>
  );
};

export default GradesDistribution;

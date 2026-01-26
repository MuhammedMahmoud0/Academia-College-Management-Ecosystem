import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// #region Sample data
const data = [
  { name: "Semester 1", semester: "Fall 2021", GPA: 3.5 },
  { name: "Semester 2", semester: "Spring 2022", GPA: 3.6 },
  { name: "Semester 3", semester: "Fall 2022", GPA: 3.7 },
  { name: "Semester 4", semester: "Spring 2023", GPA: 3.8 },
  { name: "Semester 5", semester: "Fall 2023", GPA: 3.6 },
  { name: "Semester 6", semester: "Spring 2024", GPA: 3.4 },
];
// #endregion

export default function GPA_LineChart() {
  const [chartWidth, setChartWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getChartDimensions = () => {
    if (chartWidth < 640) {
      // Mobile
      return { width: Math.min(chartWidth - 40, 500), height: 300 };
    } else if (chartWidth < 1024) {
      // Tablet
      return { width: Math.min(chartWidth * 0.6, 600), height: 350 };
    } else {
      // Desktop
      return { width: 800, height: 350 };
    }
  };

  const dimensions = getChartDimensions();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "auto",
        minHeight: "400px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#1F2937",
          fontSize: window.innerWidth < 640 ? "18px" : "20px",
          fontWeight: "bold",
        }}
      >
        GPA Trend
      </h2>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", overflowX: "auto" }}>
        <LineChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
          margin={{
            top: 5,
            right: window.innerWidth < 640 ? 10 : 30,
            left: window.innerWidth < 640 ? 10 : 0,
            bottom: 5,
          }}
        >
          <CartesianGrid stroke="#ccc" strokeWidth={1} strokeDasharray="3 3" />
          <XAxis dataKey="semester" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
          <YAxis
            dataKey="GPA"
            allowDataOverflow
            tickCount={8}
            width="auto"
            domain={[0, 4]}
            tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="GPA"
            stroke="#4f46e5"
            dot={{ fill: "#4f46e5", r: window.innerWidth < 640 ? 3 : 4 }}
            activeDot={{ r: 8 }}
            strokeWidth={window.innerWidth < 640 ? 2 : 3}
          />
        </LineChart>
      </div>
    </div>
  );
}

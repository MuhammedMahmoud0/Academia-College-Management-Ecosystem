import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function DonutChart({
  percentage = 92,
  attended = 120,
  total = 130,
  title = 'Attendance',
  color = '#4F46E5',
  isAnimationActive = true,
} = {}) {
  const data = [
    { name: 'Attended', value: percentage },
    { name: 'Absent', value: 100 - percentage },
  ];

  const COLORS = [color, '#E5E7EB'];

  return (
    <div className="w-full min-h-[320px] flex flex-col items-center">
      <h2 className="mb-4 text-lg sm:text-xl font-bold text-slate-900 text-center">{title}</h2>

      <div className="relative w-full h-[280px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="84%"
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={isAnimationActive}
              animationDuration={900}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-4xl sm:text-5xl font-bold leading-none" style={{ color }}>
            {percentage}%
          </div>
          <div className="text-xs sm:text-sm text-slate-400 mt-2">
            {attended}/{total} classes
          </div>
        </div>

        <div className="absolute bottom-1 text-center text-xs text-slate-500">
          <Link
            to="/dashboard/attendance"
            className="text-slate-700 font-semibold text-sm underline underline-offset-2 hover:text-indigo-600"
          >
            show more details
          </Link>
        </div>
      </div>
    </div>
  );
}
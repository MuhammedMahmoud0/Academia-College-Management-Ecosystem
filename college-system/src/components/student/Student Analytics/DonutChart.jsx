import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export default function DonutChart({
  percentage = 92,
  attended = 120,
  total = 130,
  title = 'Attendance',
  color = '#4F46E5',
} = {}) {
  const [chartWidth, setChartWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = [
    { name: 'Attended', value: percentage },
    { name: 'Absent', value: 100 - percentage },
  ];

  const COLORS = [color, '#E5E7EB'];

  const getChartDimensions = () => {
    if (chartWidth < 640) {
      // Mobile
      return { size: 220, innerRadius: 60, outerRadius: 85, percentFontSize: '32px', textFontSize: '12px', margin: '10px' };
    } else if (chartWidth < 1024) {
      // Tablet
      return { size: 270, innerRadius: 70, outerRadius: 100, percentFontSize: '40px', textFontSize: '13px', margin: '15px' };
    } else {
      // Desktop
      return { size: 320, innerRadius: 80, outerRadius: 110, percentFontSize: '48px', textFontSize: '14px', margin: '20px' };
    }
  };

  const dimensions = getChartDimensions();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: 'auto', minHeight: '400px', padding: '10px' }}>
      <h2 style={{ marginBottom: dimensions.margin, color: '#1F2937', fontSize: chartWidth < 640 ? '18px' : '20px', fontWeight: 'bold' }}>
        {title}
      </h2>
      <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <PieChart width={dimensions.size} height={dimensions.size} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={dimensions.innerRadius}
            outerRadius={dimensions.outerRadius}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
        
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: dimensions.percentFontSize, fontWeight: 'bold', color: color, marginBottom: '6px', lineHeight: 1 }}>
            {percentage}%
          </div>
          <div style={{ fontSize: dimensions.textFontSize, color: '#9CA3AF' }}>
            {attended}/{total} classes
          </div>
        </div>
      </div>
    </div>
  );
}
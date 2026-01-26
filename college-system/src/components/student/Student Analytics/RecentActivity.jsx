export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: 'Problem Set 3 (CS462)',
      time: '2 days ago',
      icon: '⬆️',
      iconBg: '#DBEAFE',
    },
    {
      id: 2,
      title: 'Lab 2 (CS360) - Grade: A',
      time: '5 days ago',
      icon: '✓',
      iconBg: '#DCFCE7',
    },
    {
      id: 3,
      title: 'Midterm Exam Scheduled for CS350',
      time: '1 week ago',
      icon: '📋',
      iconBg: '#FEE2E2',
    },
  ];

  return (
    <div style={{ width: '100%', height: '300px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{paddingLeft: '12px', marginBottom: '15px', color: '#1F2937', fontSize: '18px', fontWeight: 'bold' }}>
        Recent Activity
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, paddingRight: '8px' }}>
        {activities.map((activity) => (
          <div
            key={activity.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: activity.iconBg,
                borderRadius: '8px',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              {activity.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#1F2937', fontSize: '16px', fontWeight: '600' }}>
                {activity.title}
              </h3>
              <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

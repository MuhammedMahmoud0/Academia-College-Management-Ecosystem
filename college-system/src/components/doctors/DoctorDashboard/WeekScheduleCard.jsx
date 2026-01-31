export default function WeekScheduleCard() {
    const scheduleItems = [
        {
            day: 'Monday',
            time: '10:00 - 12:00',
            title: 'CS380 Lecture',
            location: 'Hall C-105'
        },
        {
            day: 'Tuesday',
            time: '14:00 - 16:00',
            title: 'Office Hours',
            location: 'Office E-212'
        },
        {
            day: 'Wednesday',
            time: '10:00 - 12:00',
            title: 'CS380 Lecture',
            location: 'Hall C-105'
        },
        {
            day: 'Wednesday',
            time: '14:00 - 16:00',
            title: 'CS421 Lecture',
            location: 'Hall B-201'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Schedule</h2>
            <div className="space-y-3">
                {scheduleItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.day}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                        </div>
                        <div className="flex-1 text-right">
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

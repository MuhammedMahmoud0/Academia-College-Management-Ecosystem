const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default function WeekScheduleCard({ schedule = [], loading = false }) {
    // Flatten all days with slots into a list of schedule items
    const scheduleItems = schedule
        .filter(({ slots = [] }) => slots.length > 0)
        .flatMap(({ day, slots }) =>
            slots.map((slot) => ({
                day,
                time: `${slot.startTime} - ${slot.endTime}`,
                title: `${slot.courseCode} ${capitalize(slot.type)}`,
                location: slot.location,
            }))
        );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Schedule</h2>
            {loading ? (
                <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between pb-3 border-b border-gray-100">
                            <div className="space-y-1">
                                <div className="h-3 bg-gray-200 rounded w-16" />
                                <div className="h-3 bg-gray-200 rounded w-24" />
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="h-3 bg-gray-200 rounded w-20" />
                                <div className="h-3 bg-gray-200 rounded w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : scheduleItems.length === 0 ? (
                <p className="text-sm text-gray-500">No sessions scheduled this week.</p>
            ) : (
                <div className="space-y-3">
                    {scheduleItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{item.day}</p>
                                <p className="text-xs text-gray-500">{item.time}</p>
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-indigo-500">{item.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

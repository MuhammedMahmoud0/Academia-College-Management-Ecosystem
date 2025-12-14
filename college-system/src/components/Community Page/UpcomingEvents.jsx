import DateRangeIcon from '@mui/icons-material/DateRange';
export default function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: 'Coding Club Weekly Meetup',
      date: 'Oct 17, 6:00 PM'
    },
    {
      id: 2,
      title: 'Guest Lecture: AI Ethics',
      date: 'Oct 19, 2:00 PM'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
      <h4 className="text-base font-semibold mb-4 text-gray-900">
        Upcoming Events
      </h4>
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3 items-start">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              <DateRangeIcon className="text-indigo-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {event.title}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {event.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
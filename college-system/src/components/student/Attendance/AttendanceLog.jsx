import React, { useMemo, useState } from 'react';

const toTitleCase = (value) => {
  if (!value) return 'Unknown';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getClassType = (record) => {
  const primaryType = String(record?.session_type || '').toLowerCase();
  const fallbackType = String(record?.tutorial_type || '').toLowerCase();

  if (primaryType.includes('lecture')) return 'Lecture';
  if (primaryType.includes('lab') || primaryType.includes('tutorial')) return 'Lab';
  if (fallbackType.includes('lab') || fallbackType.includes('tutorial')) return 'Lab';

  return 'Other';
};

const getStatusStyle = (status) => {
  switch (String(status || '').toLowerCase()) {
    case 'present':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'absent':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'excused':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'late':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    default:
      return 'text-gray-700 bg-gray-50 border-gray-200';
  }
};

const getTypeStyle = (type) => {
  switch (type.toLowerCase()) {
    case 'lecture':
      return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    case 'lab':
      return 'text-teal-700 bg-teal-50 border-teal-200';
    default:
      return 'text-slate-700 bg-slate-50 border-slate-200';
  }
};

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const formatClockTime = (value) => {
  if (!value) return '';

  const raw = String(value).trim();
  const parsed = new Date(raw);

  if (!Number.isNaN(parsed.getTime())) {
    const hasTimezoneInfo = /z$/i.test(raw) || /[+-]\d{2}:\d{2}$/.test(raw);

    return parsed.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      ...(hasTimezoneInfo ? { timeZone: 'UTC' } : {}),
    });
  }

  const timeOnlyMatch = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (timeOnlyMatch) {
    const hours = Number(timeOnlyMatch[1]);
    const minutes = timeOnlyMatch[2];

    if (Number.isFinite(hours) && hours >= 0 && hours <= 23) {
      const hour12 = hours % 12 || 12;
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${period}`;
    }
  }

  return raw;
};

const formatTimeRange = (startTime, endTime) => {
  if (!startTime && !endTime) return 'N/A';

  const formattedStart = formatClockTime(startTime);
  const formattedEnd = formatClockTime(endTime);

  if (formattedStart && formattedEnd) return `${formattedStart} - ${formattedEnd}`;
  return formattedStart || formattedEnd || 'N/A';
};

const exportToCsv = (rows) => {
  const headers = ['Date', 'Course Code', 'Course Name', 'Class Type', 'Group', 'Day', 'Time', 'Status'];

  const csvRows = rows.map((row) => [
    row.date || '',
    row.course_code || '',
    row.course_name || '',
    getClassType(row),
    row.group || '',
    row.day_of_week || '',
    formatTimeRange(row.start_time, row.end_time),
    toTitleCase(row.status),
  ]);

  const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const csvContent = [headers, ...csvRows]
    .map((line) => line.map(escapeCell).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `attendance-report-${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const AttendanceLog = ({ attendanceData = [] }) => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const courseOptions = useMemo(() => {
    const seen = new Map();

    attendanceData.forEach((record) => {
      const code = record?.course_code || '';
      const name = record?.course_name || '';

      if (!code && !name) return;
      const key = code || name;
      if (!seen.has(key)) {
        seen.set(key, {
          key,
          label: code ? `${code}: ${name || 'Unnamed Course'}` : name,
        });
      }
    });

    return Array.from(seen.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [attendanceData]);

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return attendanceData
      .filter((record) => {
        const classType = getClassType(record).toLowerCase();
        const status = String(record?.status || '').toLowerCase();
        const courseKey = record?.course_code || record?.course_name || '';
        const day = String(record?.day_of_week || '').toLowerCase();

        if (selectedType !== 'all' && classType !== selectedType) return false;
        if (selectedCourse !== 'all' && courseKey !== selectedCourse) return false;
        if (selectedStatus !== 'all' && status !== selectedStatus) return false;
        if (selectedDay !== 'all' && day !== selectedDay) return false;

        if (dateFrom && record?.date && record.date < dateFrom) return false;
        if (dateTo && record?.date && record.date > dateTo) return false;

        if (!normalizedSearch) return true;

        const searchable = [
          record?.course_code,
          record?.course_name,
          record?.group,
          record?.day_of_week,
          record?.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchable.includes(normalizedSearch);
      })
      .sort((a, b) => {
        const aDate = `${a?.date || ''} ${a?.start_time || ''}`;
        const bDate = `${b?.date || ''} ${b?.start_time || ''}`;
        return bDate.localeCompare(aDate);
      });
  }, [attendanceData, dateFrom, dateTo, searchTerm, selectedCourse, selectedDay, selectedStatus, selectedType]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">My Attendance Log</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredData.length} of {attendanceData.length} sessions
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportToCsv(filteredData)}
          disabled={filteredData.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="attendance-filter-type" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Class Type
          </label>
          <select
            id="attendance-filter-type"
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">All Class Types</option>
            <option value="lecture">Lecture</option>
            <option value="lab">Lab</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="attendance-filter-course" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Course
          </label>
          <select
            id="attendance-filter-course"
            value={selectedCourse}
            onChange={(event) => setSelectedCourse(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">All Courses</option>
            {courseOptions.map((course) => (
              <option key={course.key} value={course.key}>
                {course.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="attendance-filter-status" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Status
          </label>
          <select
            id="attendance-filter-status"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="attendance-filter-day" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Day
          </label>
          <select
            id="attendance-filter-day"
            value={selectedDay}
            onChange={(event) => setSelectedDay(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="all">All Days</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="attendance-filter-from" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            From Date
          </label>
          <input
            id="attendance-filter-from"
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Filter from date"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="attendance-filter-to" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            To Date
          </label>
          <input
            id="attendance-filter-to"
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Filter to date"
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="attendance-filter-search" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Search
          </label>
          <input
            id="attendance-filter-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by course, day, group..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setSelectedType('all');
            setSelectedCourse('all');
            setSelectedStatus('all');
            setSelectedDay('all');
            setDateFrom('');
            setDateTo('');
            setSearchTerm('');
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </div>

      {filteredData.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg py-10 px-4 text-center text-gray-500">
          No sessions match your selected filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[920px]">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Course</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Class Type</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Group</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Day / Time</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => {
                const classType = getClassType(record);
                const rowKey = `${record.record_id}-${record.date || 'no-date'}-${record.start_time || 'no-time'}`;

                return (
                  <tr key={rowKey} className="border-b border-gray-100 odd:bg-white even:bg-gray-50/40 hover:bg-indigo-50/40 transition-colors">
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{formatDate(record.date)}</td>
                    <td className="py-3 px-4 text-gray-700">
                      <div className="font-medium text-gray-900">{record.course_code || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{record.course_name || 'Unnamed Course'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeStyle(classType)}`}>
                        {classType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{record.group || '-'}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                      <div>{record.day_of_week || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{formatTimeRange(record.start_time, record.end_time)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(record.status)}`}>
                        {toTitleCase(record.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceLog;

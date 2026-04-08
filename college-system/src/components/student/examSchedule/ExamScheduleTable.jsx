import { useMemo } from 'react';
import { CalendarDays, Loader2 } from 'lucide-react';

function formatDate(dateValue) {
  if (!dateValue) {
    return '-';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('en-GB');
}

function formatTime(timeValue) {
  if (!timeValue) {
    return '-';
  }

  return String(timeValue).slice(0, 5);
}

function deriveStatus(examDate) {
  if (!examDate) {
    return 'Upcoming';
  }

  const date = new Date(examDate);
  if (Number.isNaN(date.getTime())) {
    return 'Upcoming';
  }

  const examDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  return examDay < todayOnly ? 'Completed' : 'Upcoming';
}

export default function ExamScheduleTable({ rows = [], isLoading = false }) {
  const tableRows = useMemo(() => {
    return (rows || []).map((exam, index) => ({
      id: exam.exam_id || `${exam.course_code || 'exam'}-${exam.exam_date || index}`,
      course: exam.course_code,
      exam: `${exam.course_name || ''} ${exam.exam_type || ''}`.trim() || '-',
      date: formatDate(exam.exam_date),
      time: `${formatTime(exam.start_time)} - ${formatTime(exam.end_time)}`,
      location: exam.location || '-',
      status: deriveStatus(exam.exam_date),
    }));
  }, [rows]);

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-[#d9fdd3] text-green-900 border-none';
    if (status === 'Upcoming') return 'bg-[#d3e3fd] text-blue-900 border-none';
    return 'bg-gray-100 text-gray-700 border-none';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm">Loading exam schedule...</span>
      </div>
    );
  }

  if (!tableRows.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white">
        <CalendarDays className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-base">No exams found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-gray-200">
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Course</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Exam</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Date</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Time</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Location</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tableRows.map((examRow) => (
            <tr
              key={examRow.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-800">{examRow.course || '-'}</td>
              <td className="py-4 px-5 text-sm text-gray-800 font-medium">{examRow.exam}</td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-600">{examRow.date}</td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-700">{examRow.time}</td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-600">{examRow.location}</td>
              <td className="py-4 px-5 whitespace-nowrap">
                <span className={`inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(examRow.status)}`}>
                  {examRow.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

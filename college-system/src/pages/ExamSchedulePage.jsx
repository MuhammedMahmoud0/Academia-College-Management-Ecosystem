import { useCallback, useEffect, useMemo, useState } from 'react';
import ExamScheduleTable from '../components/student/examSchedule/ExamScheduleTable';
import { getStudentExamSchedule } from '../services/scheduleService';
import { useToast } from '../hooks/useToast';
import { CalendarClock, CheckCircle2, Clock3, FileCheck2 } from 'lucide-react';

function formatDate(dateValue) {
    if (!dateValue) {
        return '--';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return '--';
    }

    return date.toLocaleDateString('en-GB');
}

export default function ExamSchedulePage() {
    const [examRows, setExamRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const stats = useMemo(() => {
        const today = new Date();
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        let upcomingCount = 0;
        let completedCount = 0;
        let nextExamDate = null;

        for (const exam of examRows) {
            const parsedDate = new Date(exam?.exam_date);
            if (Number.isNaN(parsedDate.getTime())) {
                continue;
            }

            const examDay = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()).getTime();

            if (examDay >= todayOnly) {
                upcomingCount += 1;
                if (!nextExamDate || examDay < nextExamDate.getTime()) {
                    nextExamDate = parsedDate;
                }
            } else {
                completedCount += 1;
            }
        }

        return {
            total: examRows.length,
            upcoming: upcomingCount,
            completed: completedCount,
            nextExam: nextExamDate,
        };
    }, [examRows]);

    const fetchExamSchedule = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getStudentExamSchedule();
            setExamRows(response?.data || []);
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to load exam schedule.';
            toast.error(message);
            setExamRows([]);
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchExamSchedule();
    }, [fetchExamSchedule]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-3">Exam Schedule</h1>
                    <p className="text-gray-500 text-base md:text-lg">Stay prepared with your full exam calendar and upcoming sessions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Exams</p>
                        <h2 className="text-3xl font-bold text-gray-900">{stats.total}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                        <FileCheck2 className="w-6 h-6 text-indigo-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Upcoming</p>
                        <h2 className="text-3xl font-bold text-gray-900">{stats.upcoming}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <Clock3 className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                        <h2 className="text-3xl font-bold text-gray-900">{stats.completed}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between sm:col-span-2 lg:col-span-1">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Next Exam</p>
                        <h2 className="text-2xl font-bold text-gray-900">{formatDate(stats.nextExam)}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center">
                        <CalendarClock className="w-6 h-6 text-violet-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-indigo-600" />
                        Exam Schedule
                    </h3>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <ExamScheduleTable rows={examRows} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

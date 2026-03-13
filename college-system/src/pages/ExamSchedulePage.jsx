import { useCallback, useEffect, useState } from 'react';
import ExamScheduleTable from '../components/student/examSchedule/ExamScheduleTable';
import { getStudentExamSchedule } from '../services/scheduleService';
import { useToast } from '../hooks/useToast';

export default function ExamSchedulePage() {
    const [examRows, setExamRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

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
         <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 ">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Exam Schedule</h1>

            {/* Info Card */}
               <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <ExamScheduleTable rows={examRows} isLoading={isLoading} />
            </div>
        </div>
    );
}

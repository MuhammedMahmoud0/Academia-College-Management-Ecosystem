import React from 'react';
import ExamScheduleTable from '../components/student/examSchedule/ExamScheduleTable';

export default function ExamSchedulePage() {
    return (
        <div className="w-full">
            <div className="px-4 sm:px-6 md:px-8">
                <h1 className="text-xl sm:text-2xl font-semibold mb-4">Exam Schedule</h1>
                <ExamScheduleTable />
            </div>
        </div>
    );
}

import React from 'react';
import ExamScheduleTable from './ExamScheduleTable';
export default function ExamSchedulePage() {
    return (
        <div>
            <div>
                <h1 className="text-2xl font-semibold mb-4">Exam Schedule</h1>
                <ExamScheduleTable />
            </div>
        </div>
    );
}

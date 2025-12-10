import { useState } from 'react';
import LeaderboardTable from './LeaderboardTable';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function LeaderBoardPage() {
    const [selectedYear, setSelectedYear] = useState('all');

    const yearOptions = [
        { value: 'all', label: 'All Years' },
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' },
    ];

    return (
        <div className="w-full min-h-screen">
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">Student Leaderboard</h1>
                
                {/* Description and Filter Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <p className="text-sm text-gray-600">Ranking based on overall performance.</p>
                    
                    {/* Year Filter Buttons */}
                    <ButtonGroup
                        variant="outlined"
                        size="small"
                        sx={{
                            '& .MuiButton-root': {
                                textTransform: 'none',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                padding: { xs: '4px 12px', sm: '6px 16px' },
                                borderColor: '#e5e7eb',
                                color: '#6b7280',
                                '&:hover': {
                                    borderColor: '#d1d5db',
                                    backgroundColor: '#f9fafb',
                                },
                            },
                            '& .MuiButton-root.active': {
                                backgroundColor: '#6366f1',
                                color: '#ffffff',
                                borderColor: '#6366f1',
                                '&:hover': {
                                    backgroundColor: '#4f46e5',
                                    borderColor: '#4f46e5',
                                },
                            },
                        }}
                    >
                        {yearOptions.map((option) => (
                            <Button
                                key={option.value}
                                className={selectedYear === option.value ? 'active' : ''}
                                onClick={() => setSelectedYear(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                {/* Leaderboard Table */}
                <LeaderboardTable selectedYear={selectedYear} />
            </div>
        </div>
    );
}
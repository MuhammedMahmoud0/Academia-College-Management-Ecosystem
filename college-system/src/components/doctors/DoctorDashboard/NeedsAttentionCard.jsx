export default function NeedsAttentionCard() {
    const attentionItems = [
        {
            id: 1,
            type: 'submission',
            message: '15 new submissions for "Assignment 3" need grading.',
            color: 'text-red-500',
            bgColor: 'bg-red-50',
            dotColor: 'bg-red-500'
        },
        {
            id: 2,
            type: 'message',
            message: 'You have 3 new messages from students.',
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-50',
            dotColor: 'bg-yellow-500'
        },
        {
            id: 3,
            type: 'reminder',
            message: 'Reminder: "CS421 Midterm Grades" are due this Friday.',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            dotColor: 'bg-blue-500'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Needs Attention</h2>
            <div className="space-y-3">
                {attentionItems.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className={`w-2 h-2 rounded-full ${item.dotColor} mt-1.5 flex-shrink-0`}></div>
                        <p className="text-sm text-gray-700 flex-1">{item.message}</p>
                        <svg 
                            className="w-5 h-5 text-gray-400 flex-shrink-0" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
}

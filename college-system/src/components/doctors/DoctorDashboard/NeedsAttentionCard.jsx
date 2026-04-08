import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

export default function NeedsAttentionCard({ alerts = [], loading = false }) {
    const navigate = useNavigate();

    const getAlertStyle = (type) => {
        switch (type) {
            case 'ungraded_submissions':
            case 'expired_task':
                return { color: 'text-red-500', bgColor: 'bg-red-50', dotColor: 'bg-red-500' };
            case 'low_score_counts':
                return { color: 'text-yellow-500', bgColor: 'bg-yellow-50', dotColor: 'bg-yellow-500' };
            case 'active_task':
                return { color: 'text-blue-500', bgColor: 'bg-blue-50', dotColor: 'bg-blue-500' };
            default:
                return { color: 'text-gray-500', bgColor: 'bg-gray-50', dotColor: 'bg-gray-500' };
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-6 bg-gray-100 rounded w-full"></div>
                    <div className="h-6 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-6 bg-gray-100 rounded w-4/6"></div>
                </div>
            </div>
        );
    }

    if (!alerts || alerts.length === 0) {
        return null;
    }

    const visibleAlerts = alerts.slice(0, 5);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Needs Attention</h2>
                <button
                    onClick={() => navigate('/dashboard/doctor/alerts')}
                    title="View all alerts"
                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                    <ArrowUpRight className="w-4 h-4" />
                </button>
            </div>
            <div className="space-y-3">
                {visibleAlerts.map((alert, index) => {
                    const style = getAlertStyle(alert.type);
                    return (
                        <div 
                            key={index} 
                            onClick={() => navigate('/dashboard/doctor/alerts')}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full ${style.dotColor} mt-1.5 flex-shrink-0`}></div>
                                <p className="text-sm text-gray-700 flex-1">{alert.label}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

import { useState } from 'react';
import RecordPaymentModal from './RecordPaymentModal';

export default function PaymentTracking() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [payments, setPayments] = useState([
        {
            id: 1,
            studentName: 'Sarah Johnson',
            studentId: 'AC-123457',
            date: '2025-10-15',
            amount: '$2500.00',
            method: 'Credit Card',
            status: 'Completed'
        },
        {
            id: 2,
            studentName: 'David Chen',
            studentId: 'AC-123458',
            date: '2025-10-14',
            amount: '$50.00',
            method: 'Fawry',
            status: 'Completed'
        }
    ]);

    const handleRecordPayment = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSubmit = (formData) => {
        const newPayment = {
            id: payments.length + 1,
            studentName: formData.student,
            studentId: `AC-${Math.floor(100000 + Math.random() * 900000)}`,
            date: formData.transactionDate,
            amount: `$${formData.amount}`,
            method: formData.paymentMethod,
            status: 'Completed'
        };
        setPayments([newPayment, ...payments]);
        setIsModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'failed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
                        {/* Search Input */}
                        <div className="flex-1">
                            <div className="relative">
                                <svg
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by student name or transaction ID..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm md:text-base"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="w-full lg:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm md:text-base"
                            >
                                <option value="all">All Statuses</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div className="w-full lg:w-48">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm md:text-base"
                            />
                        </div>

                        {/* Record Payment Button */}
                        <button
                            onClick={handleRecordPayment}
                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 md:px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Record Manual Payment
                        </button>
                    </div>
                </div>
            </div>

        {/*payments table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-semibold text-gray-700">
                                    Student
                                </th>
                                <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-semibold text-gray-700">
                                    Date
                                </th>
                                <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-semibold text-gray-700">
                                    Amount
                                </th>
                                <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-semibold text-gray-700">
                                    Method
                                </th>
                                <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-semibold text-gray-700">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 px-4 md:px-6">
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm md:text-base">
                                                {payment.studentName}
                                            </div>
                                            <div className="text-xs md:text-sm text-gray-500">
                                                {payment.studentId}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 md:px-6 text-sm md:text-base text-gray-900">
                                        {payment.date}
                                    </td>
                                    <td className="py-4 px-4 md:px-6 font-medium text-sm md:text-base text-gray-900">
                                        {payment.amount}
                                    </td>
                                    <td className="py-4 px-4 md:px-6 text-sm md:text-base text-gray-600">
                                        {payment.method}
                                    </td>
                                    <td className="py-4 px-4 md:px-6">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(
                                                payment.status
                                            )}`}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Payment Modal */}
            <RecordPaymentModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
}
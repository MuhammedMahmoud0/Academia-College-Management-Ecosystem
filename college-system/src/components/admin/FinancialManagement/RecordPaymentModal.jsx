import { useState } from 'react';

export default function RecordPaymentModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        student: '',
        amount: '',
        paymentMethod: 'Cash',
        transactionDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form
        setFormData({
            student: '',
            amount: '',
            paymentMethod: 'Cash',
            transactionDate: ''
        });
    };

    const handleCancel = () => {
        // Reset form
        setFormData({
            student: '',
            amount: '',
            paymentMethod: 'Cash',
            transactionDate: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md my-8">
                {/* Modal Header */}
                <div className="p-4 md:p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Record Manual Payment</h2>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-5">
                    {/* Student */}
                    <div>
                        <label htmlFor="student" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                            Student
                        </label>
                        <input
                            type="text"
                            id="student"
                            name="student"
                            value={formData.student}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Search by name or ID..."
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label htmlFor="amount" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Enter amount"
                        />
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label htmlFor="paymentMethod" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                            Payment Method
                        </label>
                        <select
                            id="paymentMethod"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Fawry">Fawry</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>

                    {/* Transaction Date */}
                    <div>
                        <label htmlFor="transactionDate" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                            Transaction Date
                        </label>
                        <input
                            type="date"
                            id="transactionDate"
                            name="transactionDate"
                            value={formData.transactionDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {/* Modal Footer */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 md:px-6 py-2.5 text-sm md:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 md:px-6 py-2.5 text-sm md:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto"
                        >
                            Record Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { useState } from 'react';

export default function AddFeeModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        feeName: '',
        amount: '',
        type: 'Per Semester'
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
            feeName: '',
            amount: '',
            type: 'Per Semester'
        });
    };

    const handleCancel = () => {
        // Reset form
        setFormData({
            feeName: '',
            amount: '',
            type: 'Per Semester'
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md my-8">
                {/* Modal Header */}
                <div className="p-4 md:p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add New Campus Fee</h2>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-5">
                    {/* Fee Name */}
                    <div>
                        <label htmlFor="feeName" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                            Fee Name
                        </label>
                        <input
                            type="text"
                            id="feeName"
                            name="feeName"
                            value={formData.feeName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="Enter fee name"
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

                    {/* Type */}
                    <div>
                        <label htmlFor="type" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        >
                            <option value="Per Semester">Per Semester</option>
                            <option value="Per Course">Per Course</option>
                            <option value="Per Year">Per Year</option>
                            <option value="One-time">One-time</option>
                        </select>
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
                            Add Fee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

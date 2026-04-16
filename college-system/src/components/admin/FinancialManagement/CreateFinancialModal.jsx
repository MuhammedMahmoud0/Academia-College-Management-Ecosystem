import { useState, useEffect } from 'react';

export default function CreateFinancialModal({ isOpen, onClose, onSubmit, departments, submitting }) {
    const [formData, setFormData] = useState({ department_id: '', credit_price: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData({ department_id: '', credit_price: '' });
            setError('');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!formData.department_id) { setError('Please select a department.'); return; }
        if (!formData.credit_price || Number(formData.credit_price) <= 0) { setError('Please enter a valid credit price.'); return; }
        onSubmit({ department_id: formData.department_id, credit_price: Number(formData.credit_price) });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Add Credit-Hour Pricing</h2>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <select
                                    name="department_id"
                                    value={formData.department_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    required
                                >
                                    <option value="">Select a department…</option>
                                    {departments.map(dep => (
                                        <option key={dep.department_id} value={dep.department_id}>
                                            {dep.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Credit-Hour Price (EGP) *</label>
                                <input
                                    type="number"
                                    name="credit_price"
                                    value={formData.credit_price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. 300"
                                    min="1"
                                    step="1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Creating…' : 'Create Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

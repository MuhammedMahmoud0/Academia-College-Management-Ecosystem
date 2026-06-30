import { useState, useEffect } from 'react';

export default function EditTuitionModal({ isOpen, onClose, onSubmit, record, submitting }) {
    const [creditPrice, setCreditPrice] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (record) {
            setCreditPrice(String(record.credit_price));
            setError('');
        }
    }, [record]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const price = Number(creditPrice);
        if (!creditPrice || price <= 0) { setError('Please enter a valid credit price.'); return; }
        onSubmit(price);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Edit Credit-Hour Price</h2>
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
                            {/* Read-only department name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    value={record?.departments?.name || ''}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            {/* Editable credit price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Credit-Hour Price (EGP) *</label>
                                <input
                                    type="number"
                                    value={creditPrice}
                                    onChange={e => setCreditPrice(e.target.value)}
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
                            {submitting ? 'Saving…' : 'Update Price'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

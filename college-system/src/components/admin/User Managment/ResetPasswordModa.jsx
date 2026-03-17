import { useState } from 'react';
import { useToast } from '../../../hooks/useToast';

export default function ResetPasswordModal({ user, onClose, onConfirm, isSubmitting = false }) {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }
        
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }

        const isSuccess = await onConfirm(formData.password);
        if (isSuccess) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                                <p className="text-gray-500 mt-1">Update your password for enhanced security.</p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="border-t border-gray-200 my-6"></div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
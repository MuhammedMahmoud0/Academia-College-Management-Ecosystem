import { X } from 'lucide-react';

export default function ChangeStudentRoleModal({ user, role, onRoleChange, onClose, onSubmit, loading = false }) {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900">Change Student Role</h2>
                    <p className="mt-1 text-sm text-gray-500">Update role for {user.name || user.full_name || `Student #${user.id}`}</p>

                    <div className="mt-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                            value={role}
                            onChange={(e) => onRoleChange(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="student">Student</option>
                            <option value="leader">Leader</option>
                        </select>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

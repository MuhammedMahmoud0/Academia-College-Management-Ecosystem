import { useEffect, useMemo, useState } from 'react';
import { getDepartments } from '../../../services/userManagement';
import { useToast } from '../../../hooks/useToast';

export default function EditModal({
    user,
    onClose,
    onSave,
    isSaving = false,
    mode,
}) {
    const resolvedMode = mode || (user?.role === 'admin' || user?.role === 'super_admin'
        ? 'admin'
        : Boolean(user?.student_profiles?.student_id || user?.studentId)
            ? 'student'
            : 'staff');
    const isStudent = resolvedMode === 'student';
    const isAdmin = resolvedMode === 'admin';
    const showRoleField = resolvedMode === 'staff';
    const showDepartmentField = resolvedMode !== 'admin';
    const toast = useToast();
    const getDepartmentId = (department) => String(department?.department_id || department?.id || '');
    const getDepartmentName = (department) => department?.name || department?.department_name || 'Unnamed Department';

    const [departments, setDepartments] = useState([]);
    const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

    const initialDepartmentId = useMemo(() => {
        return (
            user?.student_profiles?.department_id
            || user?.doctor_profiles?.department_id
            || user?.faculty_profiles?.department_id
            || ''
        );
    }, [user]);

    const initialDepartmentName = useMemo(() => {
        return (
            user?.student_profiles?.departments?.name
            || user?.doctor_profiles?.departments?.name
            || user?.faculty_profiles?.departments?.name
            || user?.department
            || user?.major
            || ''
        );
    }, [user]);

    const [formData, setFormData] = useState({
        name: user?.full_name || user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        phone: user?.phone || '',
        national_id: user?.national_id || '',
        address: user?.address || '',
        department_id: initialDepartmentId,
        department_name: initialDepartmentName,
        avatar: null,
    });

    useEffect(() => {
        if (!showDepartmentField) {
            setIsLoadingDepartments(false);
            setDepartments([]);
            return;
        }

        const loadDepartments = async () => {
            try {
                setIsLoadingDepartments(true);
                const response = await getDepartments();
                const departmentsList = response?.departments || response?.data || [];
                setDepartments(departmentsList);

                if (!initialDepartmentId && initialDepartmentName) {
                    const matchedDepartment = departmentsList.find(
                        (department) => getDepartmentName(department)?.toLowerCase() === initialDepartmentName.toLowerCase()
                    );

                    if (getDepartmentId(matchedDepartment)) {
                        setFormData((prev) => ({
                            ...prev,
                            department_id: getDepartmentId(matchedDepartment),
                        }));
                    }
                }
            } catch (error) {
                const message = error?.response?.data?.message || 'Failed to load departments.';
                toast.error(message);
            } finally {
                setIsLoadingDepartments(false);
            }
        };

        loadDepartments();
    }, [initialDepartmentId, initialDepartmentName, showDepartmentField, toast]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'avatar') {
            setFormData((prev) => ({
                ...prev,
                avatar: files?.[0] || null,
            }));
            return;
        }

        if (name === 'department_id') {
            const selectedDepartment = departments.find((department) => getDepartmentId(department) === value);
            setFormData((prev) => ({
                ...prev,
                department_id: value,
                department_name: getDepartmentName(selectedDepartment),
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...user,
            ...formData,
            full_name: formData.name,
            department: formData.department_name,
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Edit {isStudent ? 'Student' : isAdmin ? 'Admin' : 'Doctor/Faculty'}
                            </h2>
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

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="user@example.com"
                                />
                            </div>

                            {showRoleField && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isSaving}
                                    >
                                        <option value="doctor">Doctor</option>
                                        <option value="teaching_assistant">Teaching Assistant</option>
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="01234567890"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        National ID
                                    </label>
                                    <input
                                        type="text"
                                        name="national_id"
                                        value={formData.national_id}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="30001011234567"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Alexandria, Egypt"
                                />
                            </div>

                            {showDepartmentField && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {isStudent ? 'Major' : 'Department'}
                                    </label>
                                    <select
                                        name="department_id"
                                        value={formData.department_id}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isLoadingDepartments || isSaving}
                                    >
                                        <option value="">
                                            {isLoadingDepartments ? 'Loading departments...' : 'Select department'}
                                        </option>
                                        {departments.map((department) => (
                                            <option key={getDepartmentId(department)} value={getDepartmentId(department)}>
                                                {getDepartmentName(department)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Avatar
                                </label>
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex gap-3 rounded-b-lg">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

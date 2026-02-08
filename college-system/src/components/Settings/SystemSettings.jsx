import { useState } from 'react';
import AddUserModal from './AddUserModal';

export default function SystemSettings() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [semesterDates, setSemesterDates] = useState({
        startDate: '2025-09-01',
        registrationDeadline: '2025-09-15'
    });
    const [announcement, setAnnouncement] = useState('');

    const handleDateChange = (field, value) => {
        setSemesterDates(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveCalendar = () => {
        console.log('Saving calendar:', semesterDates);
        // Add your save logic here
    };

    const handlePublishAnnouncement = () => {
        console.log('Publishing announcement:', announcement);
        // Add your publish logic here
        setAnnouncement('');
    };

    const handleAddUser = () => {
        setShowAddUserModal(true);
    };

    const handleSaveUser = (userData) => {
        const newUser = {
            id: users.length + 1,
            ...userData,
            createdAt: new Date().toISOString()
        };
        setUsers([...users, newUser]);
        console.log('User added:', newUser);
        alert('User added successfully!');
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    return (
        <div className="w-full p-4 md:p-6 space-y-6">
            {/* User Management Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">User Management</h1>
                    <p className="text-xs md:text-sm text-gray-500">Add, search, and manage user roles.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="flex-1 px-4 py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button
                        onClick={handleAddUser}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 md:px-5 py-2.5 text-sm md:text-base rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Add User
                    </button>
                </div>

                {users.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                        <p className="text-gray-500">No users added yet. Click "Add User" to create a new user.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Academic Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Year
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users
                                    .filter(user => 
                                        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        user.email.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">{user.academicEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{user.department}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">Year {user.year}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Academic Calendar Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Academic Calendar</h1>
                    <p className="text-xs md:text-sm text-gray-500">Set important dates for the semester.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                    <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                            Semester Start Date
                        </label>
                        <input
                            type="date"
                            value={semesterDates.startDate}
                            onChange={(e) => handleDateChange('startDate', e.target.value)}
                            className="w-full px-4 py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Registration Deadline
                        </label>
                        <input
                            type="date"
                            value={semesterDates.registrationDeadline}
                            onChange={(e) => handleDateChange('registrationDeadline', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSaveCalendar}
                        className="bg-indigo-600 text-white px-5 md:px-6 py-2.5 text-sm md:text-base rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto"
                    >
                        Save Calendar
                    </button>
                </div>
            </div>

            {/* Site-wide Announcement Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Site-wide Announcement</h1>
                    <p className="text-xs md:text-sm text-gray-500">Publish an announcement to all users.</p>
                </div>

                <textarea
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    placeholder="Compose your announcement..."
                    rows={6}
                    className="w-full px-4 py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none mb-6"
                />

                <div className="flex justify-end">
                    <button
                        onClick={handlePublishAnnouncement}
                        className="bg-indigo-600 text-white px-5 md:px-6 py-2.5 text-sm md:text-base rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto"
                    >
                        Publish Now
                    </button>
                </div>
            </div>

            {showAddUserModal && (
                <AddUserModal
                    onClose={() => setShowAddUserModal(false)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
}
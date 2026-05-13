import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// ─── Icon helpers (inline SVGs) ─────────────────────────────────────────────
const Icon = ({ d, extra }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {extra}
        <path d={d} />
    </svg>
);

// ─── Role-based menus ────────────────────────────────────────────────────────
const buildMenu = (role) => {
    const icons = {
        dashboard:   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
        pulse:       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
        clipboard:   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/><path d="M9 12l2 2 4-4"/></svg>,
        info:        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
        book:        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
        file:        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
        attendance:  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
        users:       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
        check:       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
        folder:      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
        bar:         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
        trophy:      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
        community:   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
        payment:     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
        bell:        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
        idcard:      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="8" y1="2" x2="8" y2="22"/><line x1="16" y1="2" x2="16" y2="22"/></svg>,
        faq:         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
        settings:    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
        academic:    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>,
        config:      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
        finance:     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
        report:      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>,
        sparkles:    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/></svg>,
    };

    const item = (name, path, icon) => ({ name, path, icon });

    if (role === 'student') return [
        {
            category: 'OVERVIEW',
            items: [
                item('Dashboard',        '/dashboard/analytics',      icons.bar),
                item('Info',             '/dashboard/info',           icons.info),
                item('Leaderboard',      '/dashboard/leaderboard',    icons.trophy),
            ]
        },
        {
            category: 'ACADEMICS',
            items: [
                item('Courses & Grades', '/dashboard/courses',        icons.book),
                item('Exams',            '/dashboard/exams',          icons.file),
                item('Attendance',       '/dashboard/attendance',     icons.attendance),
                item('Courses Register', '/dashboard/register',       icons.check),
            ]
        },
        {
            category: 'LEARNING',
            items: [
                item('Student Tasks',    '/dashboard/student-tasks',  icons.check),
                item('Material',         '/dashboard/material',       icons.folder),
                item('Summarize PDF',    '/dashboard/summarization',  icons.file),
                item('Course Recommender', '/dashboard/recommendation-courses', icons.sparkles),
            ]
        },
        {
            category: 'DIRECTORY',
            items: [
                item("Students's Table", '/dashboard/students',       icons.users),
            ]
        },
        {
            category: 'SOCIAL',
            items: [
                item('Community',        '/dashboard/community',      icons.community),
            ]
        },
        {
            category: 'ACCOUNT',
            items: [
                item('Payment',          '/dashboard/payment',        icons.payment),
                item('ID Card',          '/dashboard/id-card',        icons.idcard),
                item('Notifications',    '/dashboard/notifications',  icons.bell),
                item('FAQ',              '/dashboard/faq',            icons.faq),
                item('Settings',         '/dashboard/settings',       icons.settings),
            ]
        },
    ];

    if (role === 'doctor' || role === 'teaching_assistant') {
        const isTA = role === 'teaching_assistant';
        return [
            {
                category: 'OVERVIEW',
                items: [
                    item(isTA ? 'TA Dashboard' : 'Doctor Dashboard', '/dashboard/doctor', icons.pulse),
                ]
            },
            {
                category: 'TEACHING',
                items: [
                    item('Daily Tasks',                                     '/dashboard/tasks',            icons.check),
                    item('Material',                                        '/dashboard/doctormaterial',   icons.folder),
                    item(isTA ? 'TA Attendance' : 'Doctor Attendance',     '/dashboard/doctor-attendance',icons.clipboard),
                ]
            },
            {
                category: 'DIRECTORY',
                items: [
                    item(isTA ? "TA's Table" : "Doctor's Table",           '/dashboard/teachers',         icons.users),
                ]
            },
            {
                category: 'SOCIAL',
                items: [
                    item('Community',      '/dashboard/community',    icons.community),
                ]
            },
            {
                category: 'ACCOUNT',
                items: [
                    item('Notifications',  '/dashboard/notifications', icons.bell),
                    item('Settings',       '/dashboard/settings',      icons.settings),
                ]
            },
        ];
    }

    if (role === 'super_admin' || role === 'admin') {
        const isSuperAdmin = role === 'super_admin';
        return [
            {
                category: 'OVERVIEW',
                items: [
                    item('Admin Dashboard',     '/dashboard/admin',              icons.dashboard),
                ]
            },
            {
                category: 'MANAGEMENT',
                items: [
                    item('Academic Management', '/dashboard/academic-management', icons.academic),
                    item('User Management',     '/dashboard/user-management',     icons.users),
                    item('Exam Management',     '/dashboard/exams-management',    icons.file),
                    item('Admin Attendance',    '/dashboard/admin-attendance',    icons.attendance),
                    ...(isSuperAdmin ? [item('System Configuration', '/dashboard/system-configuration', icons.config)] : []),
                ]
            },
            {
                category: 'FINANCE',
                items: [
                    item('Financial Management', '/dashboard/financial-management', icons.finance),
                    item('Payments Reports',      '/dashboard/admin-payment',        icons.report),
                ]
            },
            {
                category: 'SOCIAL',
                items: [
                    item('Community',    '/dashboard/community',    icons.community),
                ]
            },
            {
                category: 'ACCOUNT',
                items: [
                    item('Notifications', '/dashboard/notifications', icons.bell),
                    item('Settings',      '/dashboard/settings',      icons.settings),
                ]
            },
        ];
    }

    return [];
};

// ─── Route access map ────────────────────────────────────────────────────────
export const ROUTE_ACCESS = {
    '/dashboard/info':                  ['student'],
    '/dashboard/courses':               ['student'],
    '/dashboard/exams':                 ['student'],
    '/dashboard/attendance':            ['student'],
    '/dashboard/students':              ['student'],
    '/dashboard/register':              ['student'],
    '/dashboard/student-tasks':         ['student'],
    '/dashboard/material':              ['student'],
    '/dashboard/summarization':         ['student'],
    '/dashboard/recommendation-courses':['student'],
    '/dashboard/analytics':             ['student'],
    '/dashboard/leaderboard':           ['student'],
    '/dashboard/payment':               ['student'],
    '/dashboard/id-card':               ['student'],
    '/dashboard/faq':                   ['student'],

    '/dashboard/doctor':                ['doctor', 'teaching_assistant'],
    '/dashboard/doctor-attendance':     ['doctor', 'teaching_assistant'],
    '/dashboard/teachers':              ['doctor', 'teaching_assistant'],
    '/dashboard/tasks':                 ['doctor', 'teaching_assistant'],
    '/dashboard/doctormaterial':        ['doctor', 'teaching_assistant'],

    '/dashboard/admin':                 ['admin', 'super_admin'],
    '/dashboard/exams-management':      ['admin', 'super_admin'],
    '/dashboard/academic-management':   ['admin', 'super_admin'],
    '/dashboard/admin-attendance':      ['admin', 'super_admin'],
    '/dashboard/user-management':       ['admin', 'super_admin'],
    '/dashboard/admin-payment':         ['admin', 'super_admin'],
    '/dashboard/financial-management':  ['admin', 'super_admin'],
    '/dashboard/system-configuration':  ['super_admin'],

    // Shared
    '/dashboard/community':             ['student', 'doctor', 'teaching_assistant', 'admin', 'super_admin'],
    '/dashboard/notifications':         ['student', 'doctor', 'teaching_assistant', 'admin', 'super_admin'],
    '/dashboard/settings':              ['student', 'doctor', 'teaching_assistant', 'admin', 'super_admin'],
};

// ─── Sidebar component ───────────────────────────────────────────────────────
export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const menuSections = buildMenu(user?.role);
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/login');
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={onClose} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 overflow-y-auto`}
                data-lenis-prevent="true"
            >
                <nav className="p-4">
                    {menuSections.map((section, idx) => (
                        <div key={idx} className="mb-5">
                            <h3 className="text-[10px] font-bold text-gray-400 tracking-widest mb-2 px-3">
                                {section.category}
                            </h3>
                            <ul className="space-y-0.5">
                                {section.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                                isActive(item.path)
                                                    ? 'bg-indigo-50 text-indigo-600'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                            onClick={onClose}
                                        >
                                            <span className={isActive(item.path) ? 'text-indigo-600' : 'text-gray-400'}>
                                                {item.icon}
                                            </span>
                                            <span className="text-sm font-medium">{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Logout */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-red-500 hover:bg-red-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>
        </>
    );
}

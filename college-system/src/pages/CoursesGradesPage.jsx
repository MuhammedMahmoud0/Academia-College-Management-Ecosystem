import React, { useState, useEffect, useMemo } from 'react';
import GradesTable from "../components/student/courses&grades/coursesTable";
import { getStudentCourses } from "../services/courseService";
import { BookOpen, GraduationCap, TrendingUp, AlertCircle, Loader2, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function CoursesAndGradesPage() {
    const [data, setData] = useState({ courses: [], cumulativeGPA: 0, totalCredits: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dynamic View State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [semesterFilter, setSemesterFilter] = useState('All');
    const [sortBy, setSortBy] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getStudentCourses();
                // Ensure data falls back cleanly in case of partial response
                setData({
                    courses: response.courses || [],
                    cumulativeGPA: response.cumulativeGPA || 0,
                    totalCredits: response.totalCredits || 0
                });
            } catch (err) {
                console.error("Failed to fetch courses:", err);
                setError("Failed to load your academic record. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Derived Unique Options
    const uniqueStatuses = useMemo(() => {
        return ['All', ...new Set(data.courses.map(c => c.status).filter(Boolean))];
    }, [data.courses]);

    const uniqueSemesters = useMemo(() => {
        return ['All', ...new Set(data.courses.map(c => `${c.semester} ${c.year}`).filter(c => c && c.trim() !== 'undefined undefined'))];
    }, [data.courses]);

    // Apply Search, Filters, and Sorting
    const processedCourses = useMemo(() => {
        let result = [...data.courses];

        // 1. Search Query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(c => 
                (c.code && c.code.toLowerCase().includes(q)) || 
                (c.name && c.name.toLowerCase().includes(q)) || 
                (c.instructor && c.instructor.toLowerCase().includes(q)) ||
                (c.grade && c.grade.toLowerCase() === q)
            );
        }

        // 2. Status Filter
        if (statusFilter !== 'All') {
            result = result.filter(c => c.status === statusFilter);
        }

        // 3. Semester Filter
        if (semesterFilter !== 'All') {
            result = result.filter(c => `${c.semester} ${c.year}` === semesterFilter);
        }

        // 4. Sort
        if (sortBy !== 'default') {
            result.sort((a, b) => {
                const [key, dir] = sortBy.split('-');
                let valA = a[key];
                let valB = b[key];

                if (key === 'grade') {
                    const gradeValues = { 'A+': 12, 'A': 11, 'A-': 10, 'B+': 9, 'B': 8, 'B-': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 1, 'N/A': 0 };
                    valA = gradeValues[(valA || '').trim().toUpperCase()] ?? -1;
                    valB = gradeValues[(valB || '').trim().toUpperCase()] ?? -1;
                } else if (key === 'credits') {
                    valA = Number(valA || 0);
                    valB = Number(valB || 0);
                } else {
                    valA = String(valA || '').toLowerCase();
                    valB = String(valB || '').toLowerCase();
                }

                if (valA < valB) return dir === 'asc' ? -1 : 1;
                if (valA > valB) return dir === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data.courses, searchQuery, statusFilter, semesterFilter, sortBy]);

    // Reset pagination when any view state changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, semesterFilter, sortBy]);

    // Final Paginated View
    const totalPages = Math.max(1, Math.ceil(processedCourses.length / ITEMS_PER_PAGE));
    const paginatedCourses = processedCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                    <p className="text-gray-500 font-medium">Loading your academic record...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center p-4">
                <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-red-100 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header Section */}
            <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 md:mb-3">
                        Courses & Grades
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg">Track your academic progress and monitor enrolled courses.</p>
                </div>
            </div>

            {/* Stats Cards Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
                {/* GPA Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Cumulative GPA</p>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {typeof data.cumulativeGPA === 'number' ? data.cumulativeGPA.toFixed(2) : data.cumulativeGPA}
                        </h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                {/* Total Credits Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Credits</p>
                        <h2 className="text-3xl font-bold text-gray-900">{data.totalCredits}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                </div>

                {/* Enrolled Courses Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-center justify-between sm:col-span-2 lg:col-span-1">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Enrolled Courses</p>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {data.courses.filter(c => c.status === 'enrolled').length}
                        </h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-emerald-600" />
                    </div>
                </div>
            </div>

            {/* Courses Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                        Academic Record
                    </h3>
                </div>

                {/* Advanced Tools bar (Search, Filter, Sort) */}
                <div className="bg-gray-50/50 p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Search Field */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search courses, instructors, codes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                    </div>

                    {/* Filters & Sorting */}
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            {uniqueStatuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                        
                        <select 
                            value={semesterFilter} 
                            onChange={(e) => setSemesterFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            {uniqueSemesters.map(s => <option key={s} value={s}>{s === 'All' ? 'All Semesters' : s}</option>)}
                        </select>

                        <div className="h-6 w-px bg-gray-300 my-auto hidden sm:block mx-1"></div>

                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="default">Default Sort</option>
                            <option value="code-asc">Course Code (A-Z)</option>
                            <option value="code-desc">Course Code (Z-A)</option>
                            <option value="grade-desc">Highest Grade</option>
                            <option value="grade-asc">Lowest Grade</option>
                            <option value="credits-desc">Most Credits</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto">
                    <GradesTable courses={paginatedCourses} />
                </div>

                {/* Pagination Footer */}
                {totalPages > 0 && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{processedCourses.length === 0 ? 0 : ((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, processedCourses.length)}</span> of <span className="font-semibold text-gray-900">{processedCourses.length}</span> entries
                        </span>
                        
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <div className="px-3 py-1 text-sm font-medium text-gray-700">
                                Page {currentPage} of {totalPages}
                            </div>
                            
                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                aria-label="Next page"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
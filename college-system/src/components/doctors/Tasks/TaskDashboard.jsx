import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, BookOpen, FlaskConical, Calendar,
    Edit2, Trash2, Clock, CheckCircle2,
    Users, Loader2, AlertCircle, ChevronDown, Filter
} from 'lucide-react';
import TaskFormModal from './TaskFormModal';
import { getTeacherSchedule } from '../../../services/scheduleService';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    extractScheduleOptions,
} from '../../../services/tasks';

export default function TaskDashboard() {
    const navigate = useNavigate();

    // All tasks merged from every lecture/lab in the doctor's schedule
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // All schedule slots (for the course filter dropdown)
    const [scheduleOptions, setScheduleOptions] = useState([]);

    // Map: "lecture-1" | "tutorial-5" → option object (for label resolution on cards)
    const [scheduleOptionsMap, setScheduleOptionsMap] = useState({});

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');       // 'all' | 'lecture' | 'tutorial'
    const [filterSlotKey, setFilterSlotKey] = useState('all'); // 'all' | 'lecture-1' | 'tutorial-5' …

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // ── Fetch all tasks for every slot in the teacher's schedule ────────────
    const fetchAllTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const scheduleData = await getTeacherSchedule();
            const options = extractScheduleOptions(scheduleData);

            // Build lookup map
            const map = {};
            options.forEach(opt => { map[`${opt.type}-${opt.id}`] = opt; });
            setScheduleOptions(options);
            setScheduleOptionsMap(map);

            // Fetch tasks for every unique slot concurrently
            const taskPromises = options.map(opt => {
                const params = opt.type === 'lecture'
                    ? { lecture_id: opt.id }
                    : { tutorial_lab_id: opt.id };
                return getTasks(params).then(res => res.tasks || []).catch(() => []);
            });

            const results = await Promise.all(taskPromises);

            // Flatten and de-duplicate
            const seen = new Set();
            const merged = [];
            results.flat().forEach(task => {
                if (!seen.has(task.id)) { seen.add(task.id); merged.push(task); }
            });

            merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setTasks(merged);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            setError('Failed to load tasks. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllTasks(); }, [fetchAllTasks]);

    // ── Derived filtered list ────────────────────────────────────────────────
    const filteredTasks = tasks.filter(task => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());

        // Lecture / Lab type filter
        const matchesType =
            filterType === 'all'
                ? true
                : filterType === 'lecture'
                    ? task.lecture_id && task.lecture_id !== 0
                    : task.tutorial_lab_id && task.tutorial_lab_id !== 0;

        // Specific course / slot filter
        let matchesSlot = true;
        if (filterSlotKey !== 'all') {
            const [slotType, slotIdStr] = filterSlotKey.split('-');
            const slotId = parseInt(slotIdStr, 10);
            if (slotType === 'lecture') {
                matchesSlot = task.lecture_id === slotId;
            } else {
                matchesSlot = task.tutorial_lab_id === slotId;
            }
        }

        return matchesSearch && matchesType && matchesSlot;
    });

    // ── CRUD handlers ──────────────────────────────────────────────────────
    const handleCreateTask = async (data) => {
        setSubmitting(true);
        try {
            const res = await createTask(data);
            setTasks(prev => [res.task, ...prev]);
            setIsFormOpen(false);
        } catch (err) {
            console.error('Create task failed:', err);
            alert(err?.response?.data?.message || 'Failed to create task.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateTask = async (data) => {
        setSubmitting(true);
        try {
            const updates = {
                title: data.title,
                description: data.description,
                due_date: data.due_date,
            };
            const res = await updateTask(editingTask.id, updates);
            setTasks(prev => prev.map(t =>
                t.id === editingTask.id ? { ...t, ...res.task } : t
            ));
            setEditingTask(null);
            setIsFormOpen(false);
        } catch (err) {
            console.error('Update task failed:', err);
            alert(err?.response?.data?.message || 'Failed to update task.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Delete task failed:', err);
            alert(err?.response?.data?.message || 'Failed to delete task.');
        }
    };

    const openEditForm = (task) => { setEditingTask(task); setIsFormOpen(true); };
    const openCreateForm = () => { setEditingTask(null); setIsFormOpen(true); };

    // When the type pill changes, reset the slot filter so both work independently
    const handleTypeChange = (type) => {
        setFilterType(type);
        setFilterSlotKey('all');
    };

    // When a specific slot is chosen, auto-switch the type pill accordingly
    const handleSlotChange = (key) => {
        setFilterSlotKey(key);
        if (key === 'all') {
            setFilterType('all');
        } else {
            const [slotType] = key.split('-');
            setFilterType(slotType === 'lecture' ? 'lecture' : 'tutorial');
        }
    };

    // ── Helpers ────────────────────────────────────────────────────────────
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (dueDateStr) => {
        const daysLeft = (new Date(dueDateStr).getTime() - Date.now()) / (1000 * 3600 * 24);
        if (daysLeft < 0) return 'text-red-600 bg-red-50 border-red-200';
        if (daysLeft < 3) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    };

    const getTaskTargetLabel = (task) => {
        if (task.lecture_id && task.lecture_id !== 0) {
            const opt = scheduleOptionsMap[`lecture-${task.lecture_id}`];
            return opt
                ? { label: `${opt.courseName} (${opt.courseCode})`, isLecture: true }
                : { label: `Lecture #${task.lecture_id}`, isLecture: true };
        }
        if (task.tutorial_lab_id && task.tutorial_lab_id !== 0) {
            const opt =
                scheduleOptionsMap[`tutorial-${task.tutorial_lab_id}`] ||
                scheduleOptionsMap[`lab-${task.tutorial_lab_id}`];
            return opt
                ? { label: `${opt.courseName} (${opt.courseCode}) [${opt.type}]`, isLecture: false }
                : { label: `Lab #${task.tutorial_lab_id}`, isLecture: false };
        }
        return { label: 'Unknown', isLecture: true };
    };

    // Slots divided by category for the dropdown's optgroups
    const lectureSlots = scheduleOptions.filter(o => o.type === 'lecture');
    const labSlots = scheduleOptions.filter(o => o.type !== 'lecture');

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Tasks Management
                    </h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Manage assignments, labs, and activities for your courses
                    </p>
                </div>
                <button
                    onClick={openCreateForm}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
                >
                    <Plus size={20} />
                    Create Task
                </button>
            </div>

            {/* Filters toolbar */}
            <div className="flex flex-col gap-3 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                {/* Row 1 — Search + Type pills */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tasks by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {/* Type toggle pills */}
                    <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'lecture', label: 'Lectures', Icon: BookOpen },
                            { key: 'tutorial', label: 'Labs', Icon: FlaskConical },
                        ].map(({ key, label, Icon }) => (
                            <button
                                key={key}
                                onClick={() => handleTypeChange(key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filterType === key ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                {Icon
                                    ? <span className="flex items-center gap-1.5"><Icon size={14} />{label}</span>
                                    : label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Row 2 — Course / slot dropdown */}
                <div className="flex items-center gap-2">
                    <Filter size={15} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-500 font-medium shrink-0">Filter by course:</span>

                    <div className="relative flex-1 max-w-sm">
                        <select
                            value={filterSlotKey}
                            onChange={(e) => handleSlotChange(e.target.value)}
                            className="w-full appearance-none pl-3 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                        >
                            <option value="all">All courses & labs</option>

                            {lectureSlots.length > 0 && (
                                <optgroup label="📖 Lectures">
                                    {lectureSlots.map(opt => (
                                        <option key={`lecture-${opt.id}`} value={`lecture-${opt.id}`}>
                                            {opt.courseName} ({opt.courseCode}) — {opt.day} {opt.startTime}
                                        </option>
                                    ))}
                                </optgroup>
                            )}

                            {labSlots.length > 0 && (
                                <optgroup label="🧪 Tutorials / Labs">
                                    {labSlots.map(opt => (
                                        <option key={`${opt.type}-${opt.id}`} value={`${opt.type}-${opt.id}`}>
                                            {opt.courseName} ({opt.courseCode}) — {opt.day} {opt.startTime} [{opt.type}]
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                        <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                    </div>

                    {/* Active filter badge */}
                    {filterSlotKey !== 'all' && (
                        <button
                            onClick={() => handleSlotChange('all')}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap"
                        >
                            Clear ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 size={40} className="animate-spin text-indigo-500" />
                    <p className="text-gray-500 font-medium">Loading your tasks…</p>
                </div>
            )}

            {/* Error state */}
            {!loading && error && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-red-100">
                    <AlertCircle size={40} className="text-red-400" />
                    <p className="text-gray-700 font-medium">{error}</p>
                    <button
                        onClick={fetchAllTasks}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Tasks Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => {
                            const target = getTaskTargetLabel(task);
                            return (
                                <div
                                    key={task.id}
                                    className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 pr-4">
                                                {task.title}
                                            </h3>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 -mr-2 -mt-2">
                                                <button
                                                    onClick={() => openEditForm(task)}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Task"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {target.isLecture ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                    <BookOpen size={12} /> {target.label}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100">
                                                    <FlaskConical size={12} /> {target.label}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                                            {task.description}
                                        </p>

                                        <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                                                    <Calendar size={14} className="text-gray-400" /> Created
                                                </span>
                                                <span className="text-gray-700">
                                                    {new Date(task.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className={`flex items-center justify-between text-sm p-2 rounded-lg border ${getStatusColor(task.due_date)}`}>
                                                <span className="flex items-center gap-1.5 font-semibold">
                                                    <Clock size={16} /> Due By
                                                </span>
                                                <span className="font-bold">{formatDate(task.due_date)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 group-hover:bg-indigo-50 transition-colors">
                                        <button
                                            onClick={() => navigate(`/dashboard/tasks/${task.id}/submissions`)}
                                            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                            <Users size={16} /> View Submissions
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <BookOpen size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No tasks found</h3>
                            <p className="text-gray-500 max-w-sm">
                                {searchQuery || filterType !== 'all' || filterSlotKey !== 'all'
                                    ? "No tasks match your current filters."
                                    : "You haven't created any tasks yet. Click 'Create Task' to add one."}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Task Form Modal */}
            <TaskFormModal
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask}
                loading={submitting}
            />
        </div>
    );
}

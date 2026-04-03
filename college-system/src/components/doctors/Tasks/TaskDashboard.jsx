import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, Search, Filter, BookOpen, FlaskConical, Calendar,
    MoreVertical, Edit2, Trash2, Eye, Clock, CheckCircle2,
    Users
} from 'lucide-react';
import TaskFormModal from './TaskFormModal';

// Mock data matching the swagger schema
const initialTasks = [
    {
        id: 1,
        title: "Assignment 1: Linked Lists",
        description: "Implement a singly linked list with insert, delete, and search operations. Ensure memory is managed properly without leaks.",
        due_date: "2026-04-10T23:59:00.000Z",
        lecture_id: 101,
        tutorial_lab_id: null,
        created_at: "2026-04-03T18:26:29.424Z"
    },
    {
        id: 2,
        title: "Lab 3: Binary Trees",
        description: "Create a binary search tree and perform in-order, pre-order, and post-order traversals. Write tests for each scenario.",
        due_date: "2026-04-15T23:59:00.000Z",
        lecture_id: null,
        tutorial_lab_id: 205,
        created_at: "2026-04-01T10:00:00.000Z"
    },
    {
        id: 3,
        title: "Midterm Project Proposal",
        description: "Submit a 2-page proposal for your midterm project. Include team members, chosen tech stack, and timeline.",
        due_date: "2026-04-20T12:00:00.000Z",
        lecture_id: 102,
        tutorial_lab_id: null,
        created_at: "2026-04-02T14:30:00.000Z"
    }
];

export default function TaskDashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState(initialTasks);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'lecture', 'tutorial'
    
    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Derived filtered tasks
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' 
            ? true 
            : filterType === 'lecture' ? task.lecture_id !== null && task.lecture_id !== 0
            : task.tutorial_lab_id !== null && task.tutorial_lab_id !== 0;
            
        return matchesSearch && matchesFilter;
    });

    const handleCreateTask = (data) => {
        const newTask = {
            ...data,
            id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            created_at: new Date().toISOString()
        };
        setTasks([newTask, ...tasks]);
        setIsFormOpen(false);
    };

    const handleUpdateTask = (data) => {
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...data } : t));
        setEditingTask(null);
        setIsFormOpen(false);
    };

    const handleDeleteTask = (id) => {
        if(window.confirm('Are you sure you want to delete this task?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const openEditForm = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const openCreateForm = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (dueDateStr) => {
        const due = new Date(dueDateStr).getTime();
        const now = new Date().getTime();
        const daysLeft = (due - now) / (1000 * 3600 * 24);
        
        if (daysLeft < 0) return 'text-red-600 bg-red-50 border-red-200';
        if (daysLeft < 3) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
            {/* Header Section */}
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

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
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
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setFilterType('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'all' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilterType('lecture')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'lecture' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <span className="flex items-center gap-1.5"><BookOpen size={14}/> Lectures</span>
                        </button>
                        <button 
                            onClick={() => setFilterType('tutorial')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'tutorial' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <span className="flex items-center gap-1.5"><FlaskConical size={14}/> Labs</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div key={task.id} className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                            {/* Card Header Status Line */}
                            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 pr-4">
                                        {task.title}
                                    </h3>
                                    
                                    {/* Action Menu (Simplified as simple buttons for UI purposes) */}
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

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {task.lecture_id ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            <BookOpen size={12} />
                                            Lecture #{task.lecture_id}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100">
                                            <FlaskConical size={12} />
                                            Lab #{task.tutorial_lab_id}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                                    {task.description}
                                </p>

                                <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                                            <Calendar size={14} className="text-gray-400" />
                                            Created
                                        </span>
                                        <span className="text-gray-700">{new Date(task.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className={`flex items-center justify-between text-sm p-2 rounded-lg border ${getStatusColor(task.due_date)}`}>
                                        <span className="flex items-center gap-1.5 font-semibold">
                                            <Clock size={16} />
                                            Due By
                                        </span>
                                        <span className="font-bold">{formatDate(task.due_date)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* View Submissions Footer */}
                            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 group-hover:bg-indigo-50 transition-colors">
                                <button 
                                    onClick={() => navigate(`/dashboard/tasks/${task.id}/submissions`)}
                                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <Users size={16} />
                                    View Submissions
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <BookOpen size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No tasks found</h3>
                        <p className="text-gray-500 max-w-sm">
                            You haven't created any tasks matching your filters. Click 'Create Task' to add a new one.
                        </p>
                    </div>
                )}
            </div>

            {/* Task Form Modal */}
            <TaskFormModal 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask}
            />
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import {
    X, Calendar as CalendarIcon, Type, AlignLeft,
    BookOpen, FlaskConical, Loader2, AlertCircle, ChevronDown
} from 'lucide-react';
import { getTeacherSchedule } from '../../../services/scheduleService';
import { extractScheduleOptions } from '../../../services/tasks';

export default function TaskFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const isEdit = !!initialData;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        selectedOptionKey: '', // "<type>-<id>", e.g. "lecture-1" or "tutorial-5"
    });

    // Schedule options fetched from API
    const [scheduleOptions, setScheduleOptions] = useState([]);
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [scheduleError, setScheduleError] = useState(null);

    // Fetch teacher schedule when modal opens
    useEffect(() => {
        if (!isOpen) return;

        const fetchSchedule = async () => {
            setLoadingSchedule(true);
            setScheduleError(null);
            try {
                const data = await getTeacherSchedule();
                const options = extractScheduleOptions(data);
                setScheduleOptions(options);
            } catch (err) {
                console.error('Failed to fetch teacher schedule:', err);
                setScheduleError('Could not load your schedule. Please try again.');
            } finally {
                setLoadingSchedule(false);
            }
        };

        fetchSchedule();
    }, [isOpen]);

    // Populate form when editing
    useEffect(() => {
        if (isOpen && initialData) {
            const type = initialData.tutorial_lab_id ? 'tutorial' : 'lecture';
            const id = initialData.tutorial_lab_id || initialData.lecture_id || '';
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                due_date: initialData.due_date ? initialData.due_date.slice(0, 16) : '',
                selectedOptionKey: id ? `${type}-${id}` : '',
            });
        } else if (isOpen && !initialData) {
            setFormData({ title: '', description: '', due_date: '', selectedOptionKey: '' });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    // Group options per category for a cleaner <optgroup> dropdown
    const lectureOptions = scheduleOptions.filter(o => o.type === 'lecture');
    const labOptions = scheduleOptions.filter(o => o.type !== 'lecture');

    // Resolve current option object
    const selectedOption = scheduleOptions.find(
        o => `${o.type}-${o.id}` === formData.selectedOptionKey
    ) || null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedOption) return;

        const isLecture = selectedOption.type === 'lecture';
        const output = {
            title: formData.title,
            description: formData.description,
            due_date: new Date(formData.due_date).toISOString(),
            lecture_id: isLecture ? selectedOption.id : 0,
            tutorial_lab_id: !isLecture ? selectedOption.id : 0,
        };
        onSubmit(output);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {isEdit ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEdit
                                ? 'Update the details of the task below.'
                                : 'Fill in the information to assign a new task.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Type size={16} className="text-indigo-500" /> Task Title
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Assignment 1: React Basics"
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <AlignLeft size={16} className="text-indigo-500" /> Description
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed instructions for the task..."
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <CalendarIcon size={16} className="text-indigo-500" /> Due Date & Time
                        </label>
                        <input
                            required
                            type="datetime-local"
                            value={formData.due_date}
                            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-700"
                        />
                    </div>

                    {/* Target — Course / Lab Dropdown */}
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                        <label className="block text-sm font-semibold text-indigo-900 mb-3">
                            Assign to Course / Lab
                        </label>

                        {loadingSchedule ? (
                            <div className="flex items-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-gray-500 text-sm">
                                <Loader2 size={16} className="animate-spin text-indigo-500" />
                                Loading your schedule…
                            </div>
                        ) : scheduleError ? (
                            <div className="flex items-center gap-2 py-2.5 px-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                <AlertCircle size={16} />
                                {scheduleError}
                            </div>
                        ) : scheduleOptions.length === 0 ? (
                            <div className="flex items-center gap-2 py-2.5 px-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                                <AlertCircle size={16} />
                                No lectures or labs found in your schedule.
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    required
                                    value={formData.selectedOptionKey}
                                    onChange={(e) =>
                                        setFormData({ ...formData, selectedOptionKey: e.target.value })
                                    }
                                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm text-gray-700 cursor-pointer"
                                >
                                    <option value="" disabled>
                                        — Select a lecture or lab —
                                    </option>

                                    {lectureOptions.length > 0 && (
                                        <optgroup label="📖 Lectures">
                                            {lectureOptions.map((opt) => (
                                                <option
                                                    key={`${opt.type}-${opt.id}`}
                                                    value={`${opt.type}-${opt.id}`}
                                                >
                                                    {opt.courseName} ({opt.courseCode}) — {opt.day} {opt.startTime}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}

                                    {labOptions.length > 0 && (
                                        <optgroup label="🧪 Tutorials / Labs">
                                            {labOptions.map((opt) => (
                                                <option
                                                    key={`${opt.type}-${opt.id}`}
                                                    value={`${opt.type}-${opt.id}`}
                                                >
                                                    {opt.courseName} ({opt.courseCode}) — {opt.day} {opt.startTime} [{opt.type}]
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>
                        )}

                        {/* Preview badge of selection */}
                        {selectedOption && (
                            <div className="mt-3 flex items-center gap-2 text-xs font-medium">
                                {selectedOption.type === 'lecture' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                                        <BookOpen size={12} /> Lecture ID: {selectedOption.id}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200">
                                        <FlaskConical size={12} /> {selectedOption.type.charAt(0).toUpperCase() + selectedOption.type.slice(1)} ID: {selectedOption.id}
                                    </span>
                                )}
                                <span className="text-gray-500">{selectedOption.location}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedOption && !isEdit}
                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

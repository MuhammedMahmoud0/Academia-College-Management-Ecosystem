import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Hash, Type, AlignLeft } from 'lucide-react';

export default function TaskFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const isEdit = !!initialData;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        target_type: 'lecture', // 'lecture' or 'tutorial'
        target_id: ''
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                due_date: initialData.due_date ? initialData.due_date.slice(0, 16) : '',
                target_type: initialData.tutorial_lab_id ? 'tutorial' : 'lecture',
                target_id: initialData.tutorial_lab_id || initialData.lecture_id || ''
            });
        } else if (isOpen && !initialData) {
            setFormData({
                title: '',
                description: '',
                due_date: '',
                target_type: 'lecture',
                target_id: ''
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const output = {
            title: formData.title,
            description: formData.description,
            due_date: new Date(formData.due_date).toISOString(),
            lecture_id: formData.target_type === 'lecture' ? parseInt(formData.target_id) : 0,
            tutorial_lab_id: formData.target_type === 'tutorial' ? parseInt(formData.target_id) : 0
        };
        onSubmit(output);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {isEdit ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEdit ? 'Update the details of the task below.' : 'Fill in the information to assign a new task.'}
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
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-700"
                        />
                    </div>

                    {/* Target Association */}
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                        <label className="block text-sm font-semibold text-indigo-900 mb-3">
                            Task Assignment Target
                        </label>
                        <div className="flex gap-4 mb-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="target" 
                                    checked={formData.target_type === 'lecture'}
                                    onChange={() => setFormData({...formData, target_type: 'lecture', target_id: ''})}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Lecture</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="target" 
                                    checked={formData.target_type === 'tutorial'}
                                    onChange={() => setFormData({...formData, target_type: 'tutorial', target_id: ''})}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700">Tutorial / Lab</span>
                            </label>
                        </div>

                        <div className="relative">
                            <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                required
                                type="number"
                                placeholder={`Enter ${formData.target_type === 'lecture' ? 'Lecture' : 'Tutorial/Lab'} ID`}
                                value={formData.target_id}
                                onChange={(e) => setFormData({...formData, target_id: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
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
                            className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

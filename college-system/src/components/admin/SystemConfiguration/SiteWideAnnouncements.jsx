import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const SiteWideAnnouncements = () => {
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'General'
  });

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Library System Upgrade',
      publishedDate: '2025-10-12',
      type: 'General'
    },
    {
      id: 2,
      title: 'Mid-term Schedule Posted',
      publishedDate: '2025-10-10',
      type: 'Urgent'
    }
  ]);

  const handleInputChange = (field, value) => {
    setNewAnnouncement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePublishAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('Please fill in all fields');
      return;
    }

    const announcement = {
      id: Date.now(),
      title: newAnnouncement.title,
      publishedDate: new Date().toISOString().split('T')[0],
      type: newAnnouncement.type
    };

    setAnnouncements(prev => [announcement, ...prev]);
    setNewAnnouncement({ title: '', content: '', type: 'General' });
    alert('Announcement published successfully!');
  };

  const handleEditAnnouncement = (id) => {
    console.log('Edit announcement:', id);
    // Add edit functionality
  };

  const handleDeleteAnnouncement = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Create New Announcement */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Create New Announcement</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Title</label>
            <input
              type="text"
              value={newAnnouncement.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter announcement title"
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Content</label>
            <textarea
              value={newAnnouncement.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter announcement content"
              rows={6}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm sm:text-base"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Type</label>
            <select
              value={newAnnouncement.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            >
              <option value="General">General</option>
              <option value="Urgent">Urgent</option>
              <option value="Event">Event</option>
              <option value="Academic">Academic</option>
            </select>
          </div>

          {/* Publish Button */}
          <button
            onClick={handlePublishAnnouncement}
            className="w-full bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
          >
            Publish Announcement
          </button>
        </div>
      </div>

      {/* Published Announcements */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Published Announcements</h2>
        
        <div className="space-y-2 sm:space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate">{announcement.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <p className="text-xs sm:text-sm text-gray-500">Published {announcement.publishedDate}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium w-fit ${
                        announcement.type === 'Urgent'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {announcement.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditAnnouncement(announcement.id)}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    title="Edit announcement"
                  >
                    <Edit2 size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete announcement"
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteWideAnnouncements;

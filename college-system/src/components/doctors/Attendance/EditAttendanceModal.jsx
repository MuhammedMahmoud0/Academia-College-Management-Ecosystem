import React, { useState } from 'react';

const EditAttendanceModal = ({ isOpen, onClose, studentName, date, currentStatus, onSave }) => {
  // Normalize currentStatus casing to Title Case (e.g. "present" -> "Present")
  const normalizedStatus = currentStatus 
    ? currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).toLowerCase() 
    : 'Present';
    
  const [selectedStatus, setSelectedStatus] = useState(normalizedStatus);

  // Update selected status if currentStatus prop changes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedStatus(normalizedStatus);
    }
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  const statuses = [
    { value: 'Present', label: 'Present', color: 'border-emerald-500 hover:bg-emerald-50' },
    { value: 'Absent', label: 'Absent', color: 'border-red-500 hover:bg-red-50' }
  ];

  const handleSave = () => {
    onSave(selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Edit Attendance</h2>
        <p className="text-sm text-gray-600 mb-6">
          {studentName} - {date}
        </p>

        <div className="space-y-3">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`w-full px-4 py-3 text-left rounded-lg border-2 transition-all ${
                selectedStatus === status.value
                  ? `${status.color} border-opacity-100 font-medium`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAttendanceModal;

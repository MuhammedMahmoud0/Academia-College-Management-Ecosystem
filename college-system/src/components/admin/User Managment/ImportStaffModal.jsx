import { useState } from 'react';

export default function ImportStaffModal({ isOpen, isSubmitting, onClose, onSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setSelectedFile(null);
    onClose();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || isSubmitting) {
      return;
    }

    const isDone = await onSubmit(selectedFile);
    if (isDone) {
      setSelectedFile(null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Import Doctors/Teaching Assistants</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close import modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-lg border border-dashed border-gray-300 p-6 bg-gray-50">
            <p className="text-sm text-gray-700 mb-3">
              Upload .xlsx file with columns: Name | Email | Password | Role
            </p>
            <p className="text-xs text-amber-700 mb-3">
              Email column will be auto-converted to plain text before upload. Allowed role values: doctor, teaching_assistant.
            </p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {selectedFile && (
              <p className="mt-3 text-xs text-gray-600">Selected file: {selectedFile.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Importing...' : 'Import File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DeleteExamModal({ isOpen, onClose, onConfirm, exam, isDeleting }) {
  if (!isOpen || !exam) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Exam</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this exam? This action cannot be undone.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase w-20">Course</span>
              <span className="text-sm font-semibold text-indigo-600">{exam.course_code}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase w-20">Name</span>
              <span className="text-sm text-gray-800">{exam.course_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase w-20">Type</span>
              <span className="text-sm text-gray-800">{exam.exam_type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase w-20">Date</span>
              <span className="text-sm text-gray-800">{String(exam.exam_date || '').split('T')[0]}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isDeleting ? 'Deleting...' : 'Delete Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}

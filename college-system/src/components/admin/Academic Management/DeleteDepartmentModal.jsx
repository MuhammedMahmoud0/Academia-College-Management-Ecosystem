// ── Icon ─────────────────────────────────────────────────────────────────────
const WarningIcon = () => (
  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// ── Modal: Delete Confirmation ───────────────────────────────────────────────
export default function DeleteDepartmentModal({ department, loading = false, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm animate-slideUp">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-red-50">
              <WarningIcon />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Delete Department</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete{' '}
              <span className="text-gray-800 font-medium">"{department.name}"</span>?
            </p>
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 w-full">
              This fails if there are linked courses or students.
            </p>
          </div>

          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-70 transition"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

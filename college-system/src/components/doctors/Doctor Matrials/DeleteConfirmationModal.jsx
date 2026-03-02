import { Close, Warning } from '@mui/icons-material';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, materialTitle }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Warning className="text-white" style={{ fontSize: '28px' }} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Delete Material
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <Close className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 text-base leading-relaxed">
            Are you sure you want to delete this material?
          </p>
          
          {materialTitle && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Material:</p>
              <p className="text-base font-semibold text-gray-900 break-words">
                {materialTitle}
              </p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Warning className="text-yellow-600 flex-shrink-0 mt-0.5" style={{ fontSize: '20px' }} />
            <p className="text-sm text-yellow-800">
              This action cannot be undone. The material will be permanently deleted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 active:from-red-700 active:to-rose-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Delete Material
          </button>
        </div>
      </div>
    </div>
  );
}

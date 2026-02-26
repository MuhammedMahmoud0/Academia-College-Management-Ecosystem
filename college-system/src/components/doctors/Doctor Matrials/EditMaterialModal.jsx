import { useState, useEffect } from 'react';
import { Close, CloudUpload, InsertLink } from '@mui/icons-material';

export default function EditMaterialModal({ isOpen, onClose, onSave, material }) {
  const [section, setSection] = useState('Lecture Materials');
  const [uploadType, setUploadType] = useState('file');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (material) {
      setSection(material.section || 'Lecture Materials');
      setUploadType(material.type || 'file');
      setLink(material.url || '');
      setFile(material.file || null);
    }
  }, [material]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleSubmit = () => {
    if (uploadType === 'file' && (file || material?.title)) {
      onSave({ ...material, section, type: 'file', file });
    } else if (uploadType === 'link' && link) {
      onSave({ ...material, section, type: 'link', link });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsDragging(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Edit Material
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Close className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
          {/* Section Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Lecture Materials">Lecture Materials</option>
              <option value="External Resources">External Resources</option>
            </select>
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="file"
                  checked={uploadType === 'file'}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm sm:text-base text-gray-700">File Upload</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="link"
                  checked={uploadType === 'link'}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm sm:text-base text-gray-700">Link</span>
              </label>
            </div>
          </div>

          {/* File Upload Area */}
          {uploadType === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  id="edit-file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="edit-file-upload" className="cursor-pointer">
                  <CloudUpload className="text-indigo-600 mx-auto mb-3" style={{ fontSize: '40px' }} />
                  <p className="text-sm sm:text-base text-indigo-600 font-medium mb-1">
                    {file ? file.name : material?.title || 'Upload a file or drag and drop'}
                  </p>
                  {!file && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      Upload = Supervised Learning.pdf
                    </p>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Link Input */}
          {uploadType === 'link' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <div className="relative">
                <InsertLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Save Material
          </button>
        </div>
      </div>
    </div>
  );
}

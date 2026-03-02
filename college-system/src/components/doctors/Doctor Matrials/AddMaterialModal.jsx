import { useState } from 'react';
import { Close, CloudUpload, InsertLink, Description, PictureAsPdf, Image, VideoLibrary, AudioFile } from '@mui/icons-material';

export default function AddMaterialModal({ isOpen, onClose, onSave, selectedCourse }) {
  const [uploadType, setUploadType] = useState('file');
  const [file, setFile] = useState(null);
  const [fileTitle, setFileTitle] = useState('');
  const [link, setLink] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  // File size limit: 50MB
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const validateFile = (selectedFile) => {
    const newErrors = {};
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      newErrors.file = `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
      return newErrors;
    }
    
    return null;
  };

  const validateLink = () => {
    const newErrors = {};
    
    if (!linkTitle.trim()) {
      newErrors.linkTitle = 'Title is required';
    }
    
    if (!link.trim()) {
      newErrors.link = 'URL is required';
    } else {
      try {
        new URL(link);
      } catch {
        newErrors.link = 'Please enter a valid URL';
      }
    }
    
    return Object.keys(newErrors).length > 0 ? newErrors : null;
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') {
      return <PictureAsPdf className="text-red-500" style={{ fontSize: '32px' }} />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return <Image className="text-blue-500" style={{ fontSize: '32px' }} />;
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
      return <VideoLibrary className="text-purple-500" style={{ fontSize: '32px' }} />;
    } else if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
      return <AudioFile className="text-green-500" style={{ fontSize: '32px' }} />;
    } else {
      return <Description className="text-gray-500" style={{ fontSize: '32px' }} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileErrors = validateFile(selectedFile);
      if (fileErrors) {
        setErrors(fileErrors);
        setFile(null);
      } else {
        setFile(selectedFile);
        setErrors({});
      }
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
      const fileErrors = validateFile(droppedFile);
      if (fileErrors) {
        setErrors(fileErrors);
        setFile(null);
      } else {
        setFile(droppedFile);
        setErrors({});
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileTitle('');
    setErrors({});
  };

  const handleSubmit = () => {
    if (uploadType === 'file') {
      if (!file) {
        setErrors({ file: 'Please select a file' });
        return;
      }
      const section = 'Lecture Materials';
      // Use custom title if provided, otherwise use filename
      const materialTitle = fileTitle.trim() || file.name;
      onSave({ section, type: 'file', file, fileTitle: materialTitle });
    } else {
      const linkErrors = validateLink();
      if (linkErrors) {
        setErrors(linkErrors);
        return;
      }
      const section = 'External Resources';
      onSave({ section, type: 'link', link, linkTitle });
    }
    handleClose();
  };

  const handleClose = () => {
    setUploadType('file');
    setFile(null);
    setFileTitle('');
    setLink('');
    setLinkTitle('');
    setIsDragging(false);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl overflow-hidden transform transition-all animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Add New Material
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                {selectedCourse 
                  ? `Adding to: ${selectedCourse.courseCode} - ${selectedCourse.courseName}`
                  : 'Upload files or add external links'
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <Close className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Type Selection with Cards */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Material Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setUploadType('file');
                  setErrors({});
                }}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  uploadType === 'file'
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <div className="flex flex-col items-center">
                  <CloudUpload
                    className={uploadType === 'file' ? 'text-indigo-600' : 'text-gray-400'}
                    style={{ fontSize: '32px' }}
                  />
                  <span
                    className={`mt-2 font-medium ${
                      uploadType === 'file' ? 'text-indigo-900' : 'text-gray-700'
                    }`}
                  >
                    Upload File
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PDFs, Images, Videos
                  </span>
                </div>
                {uploadType === 'file' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadType('link');
                  setErrors({});
                }}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  uploadType === 'link'
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <div className="flex flex-col items-center">
                  <InsertLink
                    className={uploadType === 'link' ? 'text-indigo-600' : 'text-gray-400'}
                    style={{ fontSize: '32px' }}
                  />
                  <span
                    className={`mt-2 font-medium ${
                      uploadType === 'link' ? 'text-indigo-900' : 'text-gray-700'
                    }`}
                  >
                    Add Link
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    External Resources
                  </span>
                </div>
                {uploadType === 'link' && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          {uploadType === 'file' && (
            <div className="space-y-3">
              {!file ? (
                <>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-indigo-500 bg-indigo-50 scale-105'
                        : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer block">
                      <CloudUpload
                        className="text-indigo-600 mx-auto mb-4"
                        style={{ fontSize: '48px' }}
                      />
                      <p className="text-base sm:text-lg text-gray-700 font-semibold mb-2">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF, DOC, PPT, Images, Videos (Max {MAX_FILE_SIZE / (1024 * 1024)}MB)
                      </p>
                    </label>
                  </div>
                  {errors.file && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.file}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        {getFileIcon(file.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 break-all">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      aria-label="Remove file"
                    >
                      <Close />
                    </button>
                  </div>
                </div>
              )}

              {/* Optional Title for File */}
              {file && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custom Title <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                    placeholder="e.g., Week 1 Lecture Notes (defaults to filename if empty)"
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {fileTitle.length}/100 characters
                    {!fileTitle.trim() && <span className="ml-2">• Will use filename: "{file.name}"</span>}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Link Input */}
          {uploadType === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => {
                    setLinkTitle(e.target.value);
                    if (errors.linkTitle) {
                      setErrors({ ...errors, linkTitle: null });
                    }
                  }}
                  placeholder="e.g., Machine Learning Course by Andrew Ng"
                  maxLength={100}
                  className={`w-full px-4 py-3 border rounded-xl text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.linkTitle
                      ? 'border-red-300 focus:ring-red-500 bg-red-50'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.linkTitle ? (
                    <span className="text-xs text-red-600">{errors.linkTitle}</span>
                  ) : (
                    <span className="text-xs text-gray-400">Give your resource a descriptive name</span>
                  )}
                  <span className={`text-xs ${linkTitle.length >= 90 ? 'text-orange-600' : 'text-gray-400'}`}>
                    {linkTitle.length}/100
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <InsertLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                      if (errors.link) {
                        setErrors({ ...errors, link: null });
                      }
                    }}
                    placeholder="https://example.com/resource"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.link
                        ? 'border-red-300 focus:ring-red-500 bg-red-50'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                  />
                </div>
                {errors.link ? (
                  <p className="text-xs text-red-600 mt-1">{errors.link}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">Enter a complete URL starting with http:// or https://</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all shadow-sm hover:shadow"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploadType === 'file' ? !file : (!link.trim() || !linkTitle.trim())}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center gap-2"
          >
            <CloudUpload style={{ fontSize: '18px' }} />
            {uploadType === 'file' ? 'Upload Material' : 'Add Resource'}
          </button>
        </div>
      </div>
    </div>
  );
}

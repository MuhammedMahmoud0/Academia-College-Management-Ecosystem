import React, { useRef, useState } from 'react';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function SummaryUploader({ onUpload, isLoading }) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateAndSetFile = (file) => {
        if (!file) return false;
        
        if (file.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            setSelectedFile(null);
            return false;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
            setSelectedFile(null);
            return false;
        }

        setError('');
        setSelectedFile(file);
        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onUpload(selectedFile);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            <div 
                className={`relative px-6 py-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                    dragActive 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                        : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input 
                    ref={inputRef}
                    type="file" 
                    accept=".pdf"
                    className="hidden" 
                    onChange={handleChange}
                    disabled={isLoading}
                />
                
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600 mb-4"></div>
                        <p className="text-xl font-bold text-gray-800">Summarizing Document...</p>
                        <p className="text-sm text-gray-500 mt-2">This may take a few minutes using the local AI model.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-indigo-100 p-4 rounded-full mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Upload your Lecture (PDF)</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-sm">
                            Drag and drop your document here, or click to browse. Maximum file size is {MAX_FILE_SIZE_MB}MB.
                        </p>
                        <button 
                            onClick={onButtonClick}
                            className="bg-white border-2 border-indigo-600 text-indigo-600 font-semibold py-2 px-6 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            Browse Files
                        </button>
                    </>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-3 text-red-700 animate-pulse border border-red-100">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="font-medium text-sm">{error}</p>
                </div>
            )}

            {selectedFile && !error && !isLoading && (
                <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4 px-2">
                        <div className="bg-red-100 p-2 rounded text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 line-clamp-1">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Generate Summary
                    </button>
                </div>
            )}
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { summarizePdfStructured, checkModelHealth } from '../services/summarizationModel';
import SummaryUploader from '../components/models/SummaryUploader';
import SummaryResult from '../components/models/SummaryResult';
import ModelOfflineState from '../components/models/ModelOfflineState';

export default function SummarizationPage() {
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [isOffline, setIsOffline] = useState(false);
    const [isCheckingHealth, setIsCheckingHealth] = useState(true);

    const verifyHealth = async (silent = false) => {
        setIsCheckingHealth(true);
        const isHealthy = await checkModelHealth();
        setIsOffline(!isHealthy);
        setIsCheckingHealth(false);
        
        if (!silent && isHealthy) {
            showNotification('Connected to Local AI Model!', 'success');
        } else if (!silent && !isHealthy) {
            showNotification('Local AI Model is currently offline.', 'error');
        }
        return isHealthy;
    };

    useEffect(() => {
        verifyHealth(true);
    }, []);

    const handleUpload = async (file) => {
        const isHealthy = await checkModelHealth();
        if (!isHealthy) {
            setIsOffline(true);
            showNotification('Connection lost to local AI Model.', 'error');
            return;
        }

        setIsLoading(true);
        setSummaryData(null); // clear previous results
        try {
            const data = await summarizePdfStructured(file);
            setSummaryData(data);
            showNotification('Document summarized successfully', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Failed to summarize document. Ensure local AI is running.', 'error');
            if (error.code === 'ERR_NETWORK' || !error.response) {
                setIsOffline(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                    AI Lecture Summarization
                </h1>
                <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                    Upload your lecture PDF and our locally hosted AI model will generate a structured, easy-to-read summary including main topics, key points, and exam tips.
                </p>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {isCheckingHealth && !isOffline && !summaryData && !isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-indigo-200">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">Checking model status...</p>
                    </div>
                ) : isOffline ? (
                    <ModelOfflineState onRetry={() => verifyHealth(false)} isChecking={isCheckingHealth} />
                ) : (
                    <>
                        {!summaryData && (
                            <SummaryUploader onUpload={handleUpload} isLoading={isLoading} />
                        )}

                        {summaryData && !isLoading && (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Your Summary</h2>
                                    <button 
                                        onClick={() => setSummaryData(null)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                        Upload Another
                                    </button>
                                </div>
                                <SummaryResult summaryData={summaryData} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

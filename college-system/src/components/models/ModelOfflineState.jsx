import React from 'react';

export default function ModelOfflineState({ onRetry, isChecking }) {
    return (
        <div className="w-full max-w-2xl mx-auto mt-8 p-10 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
            {/* Animated SVG Graphic */}
            <div className="relative mb-8 mt-4">
                {/* Background pulse */}
                <div className="absolute inset-0 bg-yellow-100 rounded-full blur-xl scale-150 animate-pulse"></div>
                
                {/* Main Icon */}
                <div className="relative bg-white p-6 rounded-full shadow-md border-4 border-yellow-50 flex items-center justify-center">
                    <svg className="w-16 h-16 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2H6A2 2 0 0 0 4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Zzz animation for sleeping model */}
                        <path className="animate-bounce" style={{ animationDelay: '0ms' }} d="M8 12h3l-3 3h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path className="animate-bounce" style={{ animationDelay: '200ms' }} d="M13 10h2l-2 2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path className="animate-bounce" style={{ animationDelay: '400ms' }} d="M17 8h1.5l-1.5 1.5h1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    {/* Disconnected bubble */}
                    <div className="absolute -bottom-2 -right-2 bg-red-100 p-1.5 rounded-full border border-red-200 shadow-sm">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                        <div className="absolute inset-[6px] w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 tracking-tight mb-3">
                Local AI Model is Offline
            </h3>
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                The lecture summarization relies on a locally hosted AI model which is currently not running. It consumes significant resources, so it's typically started only when needed.
            </p>

            <button 
                onClick={onRetry}
                disabled={isChecking}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-md hover:shadow-lg"
            >
                {/* Button shine effect */}
                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                    <div className="relative h-full w-8 bg-white/20"></div>
                </div>

                {isChecking ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Connecting...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Retry Connection
                    </>
                )}
            </button>
        </div>
    );
}

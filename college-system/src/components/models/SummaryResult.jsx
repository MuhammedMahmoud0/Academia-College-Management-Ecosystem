import React from 'react';

export default function SummaryResult({ summaryData }) {
    if (!summaryData || !summaryData.structured_pages) {
        return null; // Empty state
    }

    const { structured_pages, filename, page_count } = summaryData;

    return (
        <div className="w-full mt-10 space-y-8 max-w-5xl mx-auto">
            {/* Header info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Summary Report</h2>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                        {filename}
                    </p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm border border-indigo-100 shadow-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                    {page_count} Pages Processed
                </div>
            </div>

            {/* Pages iteration */}
            <div className="space-y-6">
                {structured_pages.map((pageData, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Page Header */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <span className="bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-md text-sm font-bold shadow-sm">
                                    {pageData.page_number}
                                </span>
                                Page {pageData.page_number}
                            </h3>
                            {pageData.source_type && (
                                <span className="text-xs font-semibold uppercase tracking-wider bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                                    {pageData.source_type}
                                </span>
                            )}
                        </div>

                        {/* Page Content */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Main Content Column */}
                            <div className="md:col-span-2 space-y-6">
                                {pageData.main_topic && (
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            Main Topic
                                        </h4>
                                        <p className="text-gray-800 font-medium text-lg border-l-4 border-indigo-300 pl-3 py-1">{pageData.main_topic}</p>
                                    </div>
                                )}

                                {pageData.key_points?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                            Key Points
                                        </h4>
                                        <ul className="space-y-2">
                                            {pageData.key_points.map((point, idx) => (
                                                <li key={idx} className="flex gap-3 text-gray-700">
                                                    <span className="text-indigo-400 mt-1 shrink-0">•</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {pageData.one_line_recap && (
                                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                        <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">One-Line Recap</h4>
                                        <p className="text-indigo-900 text-sm font-medium italic">"{pageData.one_line_recap}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Terms & Exam Tips Column */}
                            <div className="space-y-6">
                                {pageData.terms_to_remember?.length > 0 && (
                                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 h-full">
                                        <h4 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                            Terms to Remember
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {pageData.terms_to_remember.map((term, idx) => (
                                                <span key={idx} className="bg-white border border-blue-200 text-blue-800 px-3 py-1 rounded-md text-sm font-medium shadow-sm">
                                                    {term}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {pageData.exam_tip && (
                                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                                        <h4 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                                            Exam Tip Let's Try
                                        </h4>
                                        <p className="text-amber-900 text-sm">{pageData.exam_tip}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

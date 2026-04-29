import AdmissionCard from './AdmissionCard';

export default function Admission() {
    return (
        <div id="admissions" className="admission-section py-12 md:py-20 px-4 md:px-8 bg-slate-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        Admissions & How to Apply
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Your journey to excellence starts here. Let's get started.
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Left Side - Application Process Card */}
                    <AdmissionCard />

                    {/* Right Side - Ready to Begin */}
                    <div className="p-6 md:p-8 flex flex-col justify-center items-center">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">
                            Ready to Begin?
                        </h3>
                        <p className="text-slate-600 mb-6 md:mb-8 text-sm md:text-base text-center">
                            Take the next step in your academic career. Our admissions team is ready to help you with any questions.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
                                Apply Now
                            </button>
                            <button className="cursor-pointer bg-white border-2 border-slate-300 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
                                Request Info
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

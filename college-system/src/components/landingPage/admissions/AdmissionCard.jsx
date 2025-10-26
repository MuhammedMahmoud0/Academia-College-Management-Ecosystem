export default function AdmissionCard() {
    return (
        <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
                Application Process
            </h3>

            <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                            1
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                            Submit Your Application
                        </h4>
                        <p className="text-sm text-slate-600">
                            Complete the online application form and submit all required documents before the deadline.
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                            2
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                            Entrance Examination
                        </h4>
                        <p className="text-sm text-slate-600">
                            Register and sit for the mandatory national entrance exam.
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                            3
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-1">
                            Admission Decision
                        </h4>
                        <p className="text-sm text-slate-600">
                            Receive your admission decision via our online portal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

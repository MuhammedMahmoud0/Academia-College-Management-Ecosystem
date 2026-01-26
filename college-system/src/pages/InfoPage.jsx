import InfoCard from '../components/student/info page/InfoCard';

export default function Info() {
    const studentData = {
        name: "John Doe",
        major: "Computer Science",
        studentId: "AC-123456",
        year: "3rd Year",
        gpa: "3.85",
        email: "john.doe@academia.edu.eg",
        phone: "+20 100 123 4567",
        advisor: "Dr. Evelyn Reed",
        address: "123 University St, Alexandria, Egypt"
    };

    return (
        <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 ">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Student Information</h1>

            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <div className="w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-6xl font-bold text-indigo-600">JD</span>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                {studentData.name}
                            </h2>
                            <p className="text-lg text-indigo-600 font-semibold">
                                {studentData.major}
                            </p>
                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoCard 
                                label="Student ID"
                                value={studentData.studentId}
                            />
                            <InfoCard 
                                label="Year"
                                value={studentData.year}
                            />
                            <InfoCard 
                                label="Cumulative GPA"
                                value={studentData.gpa}
                            />
                            <InfoCard 
                                label="Email Address"
                                value={studentData.email}
                            />
                            <InfoCard 
                                label="Phone"
                                value={studentData.phone}
                            />
                            <InfoCard 
                                label="Faculty Advisor"
                                value={studentData.advisor}
                            />
                        </div>

                        {/* Address - Full Width */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <InfoCard 
                                label="Address"
                                value={studentData.address}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

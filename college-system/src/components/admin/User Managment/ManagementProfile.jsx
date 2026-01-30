import { Link } from 'react-router-dom';
export default function ManagementProfile() {
  // Sample student data
  const student = {
    id: 1,
    name: 'Student A1',
    studentId: 'AC-123457',
    status: 'Active',
    email: 'student1@academia.edu',
    phone: '+20 100 123 4557',
    major: 'Computer Science',
    year: 1,
    gpa: 3.85,
    grades: [
      { course: 'CS101', semester: 'Fall 2024', grade: 'A' },
      { course: 'MA203', semester: 'Fall 2024', grade: 'B+' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/dashboard/user-management">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base">Back to User List</span>
          </button>
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0">
              S{student.id}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{student.studentId}</p>
              <span className="inline-flex mt-2 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                {student.status}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 sm:gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 order-1 lg:order-none">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Contact Information</h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-700">Email:</span>
                <span className="ml-0 sm:ml-2 text-sm text-gray-600 break-all">{student.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-700">Phone:</span>
                <span className="ml-0 sm:ml-2 text-sm text-gray-600">{student.phone}</span>
              </div>
            </div>
          </div>

          {/* Grade History */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 order-2 lg:order-none">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Grade History</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="min-w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semester
                      </th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {student.grades.map((grade, index) => (
                      <tr key={index}>
                        <td className="px-2 sm:px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{grade.course}</td>
                        <td className="px-2 sm:px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{grade.semester}</td>
                        <td className="px-2 sm:px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">{grade.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Academic Summary */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 order-3 lg:order-none">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Academic Summary</h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-700">Major:</span>
                <span className="ml-0 sm:ml-2 text-sm text-gray-600">{student.major}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-700">Year:</span>
                <span className="ml-0 sm:ml-2 text-sm text-gray-600">{student.year}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-700">Cumulative GPA:</span>
                <span className="ml-0 sm:ml-2 text-sm text-gray-600">{student.gpa}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
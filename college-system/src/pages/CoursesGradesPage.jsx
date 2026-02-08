import GradesTable from "../components/student/courses&grades/coursesTable";
export default function CoursesAndGradesPage() {    
    return (
                <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 ">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Courses & Grades</h1>

            {/* Info Card */}
               <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
               <GradesTable/>
           </div>
        </div>
    );
}
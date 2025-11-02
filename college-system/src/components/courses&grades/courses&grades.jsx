import GradesTable from "./coursesTable";
export default function CoursesAndGradesPage() {    
    return (
        <div>
            <div>
                <h1 className="text-2xl font-semibold mb-4">Courses & Grades</h1>
            </div>


           <div>
               <GradesTable/>
           </div>
        </div>
    );
}
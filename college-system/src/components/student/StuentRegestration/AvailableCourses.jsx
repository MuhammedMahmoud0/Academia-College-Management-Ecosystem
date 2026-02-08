import { useState } from 'react';
import CourseCard from "./CourseCard";

// Sample course data
const initialCourses = [
    {
        id: 1,
        name: 'Machine Learning',
        code: 'CS462',
        instructor: 'Dr. Samuel Chen',
        schedule: 'Sun, Tue 10:00-12:00',
        credits: 3,
        registered: 45,
        capacity: 50,
        isEnrolled: true
    },
    {
        id: 2,
        name: 'Compiler Design',
        code: 'CS421',
        instructor: 'Dr. Evelyn Reed',
        schedule: 'Mon, Wed 14:00-16:00',
        credits: 3,
        registered: 30,
        capacity: 40,
        isEnrolled: true
    },
    {
        id: 3,
        name: 'Embedded Systems',
        code: 'EE320',
        instructor: 'Dr. Olivia Garcia',
        schedule: 'Sun, Tue 12:00-14:00',
        credits: 3,
        registered: 45,
        capacity: 45,
        isEnrolled: false
    },
    {
        id: 4,
        name: 'Linear Algebra',
        code: 'MA310',
        instructor: 'Dr. Ben Carter',
        schedule: 'Mon, Wed 08:00-10:00',
        credits: 3,
        registered: 55,
        capacity: 60,
        isEnrolled: true
    },
    {
        id: 5,
        name: 'Cybersecurity Fundamentals',
        code: 'CS360',
        instructor: 'Dr. Evelyn Reed',
        schedule: 'Mon, Wed 10:00-12:00',
        credits: 3,
        registered: 25,
        capacity: 50,
        isEnrolled: false
    },
    {
        id: 6,
        name: 'Quantum Mechanics',
        code: 'PHY301',
        instructor: 'Dr. Isaac Vance',
        schedule: 'Tue, Thu 14:00-16:00',
        credits: 4,
        registered: 15,
        capacity: 35,
        isEnrolled: false
    },
];

export default function AvailableCourses() {
    const [courses, setCourses] = useState(initialCourses);

    const handleCourseAction = (courseId, isRemove) => {
        setCourses(courses.map(course => 
            course.id === courseId 
                ? { 
                    ...course, 
                    isEnrolled: !isRemove,
                    registered: isRemove ? course.registered - 1 : course.registered + 1
                  }
                : course
        ));
    };

    return (
        <div className="w-full">
            <div className="px-4 sm:px-6 md:px-8">
                      <h1 className="text-3xl font-bold text-slate-900 mb-6">Available Courses</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {courses.map(course => (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            onAction={handleCourseAction}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
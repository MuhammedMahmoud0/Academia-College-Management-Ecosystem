import { motion } from "motion/react";
import StudentSayCard from "./studentSayCard";

import student1 from "../../../assets/students/student2.png";
import student2 from "../../../assets/students/student4.jpg";

export default function StudentSay() {
    const students = [
        {
            id: 1,
            name: "Sarah Johnson",
            title: "Computer Science Graduate",
            comment: "The hands-on projects and mentorship from professors were invaluable. I felt more than prepared for my career in tech.",
            image: student2,
            initials: "SJ",
            bgColor: "bg-indigo-300"
        },
        {
            id: 2,
            name: "David Chen",
            title: "Mechanical Engineering Student",
            comment: "The collaborative environment and access to state-of-the-art labs have been incredible. I've been able to bring my most ambitious ideas to life.",
            image: student1,
            initials: "DC",
            bgColor: "bg-indigo-300"
        }
    ];

    return (
        <div className="student-say py-20 px-8 bg-slate-50 border border-slate-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        What Our Students Say
                    </h2>
                    <p className="text-slate-600">
                        Real stories from our vibrant community.
                    </p>
                </motion.div>

                {/* Student Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {students.map((student, index) => (
                        <StudentSayCard 
                            key={student.id} 
                            student={student}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
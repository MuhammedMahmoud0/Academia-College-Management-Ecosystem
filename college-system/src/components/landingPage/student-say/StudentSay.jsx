import StudentSayCard from "./studentSayCard";
import student1 from "../../../assets/students/student2.webp";
import student2 from "../../../assets/students/student4.webp";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StudentSay() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.gsap-header', 
            { opacity: 0, y: -20 },
            { 
                opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
                scrollTrigger: {
                    trigger: '.gsap-header',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.gsap-students-grid',
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        tl.fromTo('.gsap-student-card',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" }
        )
        .fromTo('.gsap-quote',
            { opacity: 0 },
            { opacity: 1, duration: 0.6, stagger: 0.2 },
            "-=0.4"
        )
        .fromTo('.gsap-info',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 },
            "-=0.6"
        );

    }, { scope: containerRef });

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
        <div id="student-say" className="student-say py-12 md:py-20 px-4 md:px-8 bg-slate-50" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div 
                    className="text-center mb-12 md:mb-16 gsap-header"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        What Our Students Say
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Real stories from our vibrant community.
                    </p>
                </div>

                {/* Student Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-13 md:gap-8 max-w-5xl mx-auto gsap-students-grid">
                    {students.map((student, index) => (
                        <div key={student.id} className="gsap-student-card">
                            <StudentSayCard 
                                student={student}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

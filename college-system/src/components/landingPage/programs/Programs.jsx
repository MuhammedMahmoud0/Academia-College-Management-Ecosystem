import ProgramsCard from "./ProgramsCard";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const programs = [
    {
        id: 1,
        name: "Computer Science",
        description: "Cutting-edge curriculum focused on AI, cybersecurity, and software development.",
        icon: "code",
    },
    {
        id: 2,
        name: "Mechanical Engineering",
        description: "Hands-on experience in robotics, sustainable energy, and advanced manufacturing.",
        icon: "settings",
    },
    {
        id: 3,
        name: "Business Administration",
        description: "Developing future leaders with a focus on entrepreneurship and global markets.",
        icon: "briefcase",
    },
];

export default function Programs() {
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
    }, { scope: containerRef });

    return (
        <div id="programs" className="programs-section py-12 md:py-20 px-4 md:px-8 bg-white border border-slate-200" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div 
                    className="text-center mb-12 md:mb-16 gsap-header"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        Flagship Academic Programs
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Explore our top-ranked programs designed for excellence.
                    </p>
                </div>

                {/* Programs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {programs.map((program, index) => (
                        <ProgramsCard 
                            key={program.id}
                            program={program}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

import EventsCard from "./EvventsCard";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
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

    const events = [
        {
            id: 1,
            month: "NOV",
            day: "15",
            title: "Guest Lecture: The Future of Quantum Computing",
            time: "2:00 PM",
            location: "Main Auditorium"
        },
        {
            id: 2,
            month: "NOV",
            day: "22",
            title: "Annual Sports Day Championship",
            time: "9:00 AM",
            location: "University Grounds"
        },
        {
            id: 3,
            month: "DEC",
            day: "05",
            title: "Winter Code-a-thon 2025",
            time: "10:00 AM",
            location: "CS Department Labs"
        }
    ];

    return (
        <div id="events" className="events-section py-12 md:py-20 px-4 md:px-8 bg-slate-100" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div 
                    className="text-center mb-12 md:mb-16 gsap-header"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        Upcoming Events
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Join us for our upcoming workshops, lectures, and campus activities.
                    </p>
                </div>

                {/* Events List */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {events.map((event, index) => (
                        <EventsCard 
                            key={event.id} 
                            event={event}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

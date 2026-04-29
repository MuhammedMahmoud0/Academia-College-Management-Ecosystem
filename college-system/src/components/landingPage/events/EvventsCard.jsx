import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function EventsCard({ event, index }) {
    const cardRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        tl.fromTo(cardRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.5, delay: index * 0.1, ease: "power2.out" }
        )
        .fromTo('.gsap-date',
            { scale: 0.8 },
            { scale: 1, duration: 0.4 },
            "-=0.2"
        )
        .fromTo('.gsap-title',
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4 },
            "-=0.3"
        )
        .fromTo('.gsap-desc',
            { opacity: 0 },
            { opacity: 1, duration: 0.4 },
            "-=0.3"
        );
    }, { scope: cardRef });

    return (
        <div 
            ref={cardRef}
            className="flex items-center bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
        >
            {/* Date Section */}
            <div className="flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center bg-white border-r-2 border-slate-100">
                <div 
                    className="text-center gsap-date"
                >
                    <div className="text-2xl font-bold text-indigo-600">
                        {event.month}
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {event.day}
                    </div>
                </div>
            </div>

            {/* Event Details */}
            <div className="flex-1 p-6">
                <h3 
                    className="text-lg font-bold text-slate-900 mb-2 gsap-title"
                >
                    {event.title}
                </h3>
                <p 
                    className="text-sm text-slate-600 gsap-desc"
                >
                    {event.time} - {event.location}
                </p>
            </div>
        </div>
    );
}

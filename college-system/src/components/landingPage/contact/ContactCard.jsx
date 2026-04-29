import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Icon Components
const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.92 14.9 14.9 0 0 0 .36 2.78 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 14.9 14.9 0 0 0 2.78.36A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const iconMap = {
    "map-pin": MapPinIcon,
    "phone": PhoneIcon,
    "mail": MailIcon
};

export default function ContactCard({ contact, index }) {
    const IconComponent = iconMap[contact.icon] || MapPinIcon;
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
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, delay: index * 0.15, ease: "power2.out" }
        )
        .fromTo('.gsap-icon',
            { scale: 0, rotate: -180 },
            { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" },
            "-=0.4"
        )
        .fromTo('.gsap-title',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.4"
        )
        .fromTo('.gsap-info',
            { opacity: 0 },
            { opacity: 1, duration: 0.5 },
            "-=0.3"
        );
    }, { scope: cardRef });

    return (
        <div 
            ref={cardRef}
            className="flex flex-col items-center bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] hover:-translate-y-[5px] transition-all duration-300 p-8 text-center border border-slate-100"
        >
            {/* Icon */}
            <div 
                className="mb-6 text-indigo-600 gsap-icon"
            >
                <IconComponent />
            </div>

            {/* Title */}
            <h3 
                className="text-xl font-bold text-slate-900 mb-3 gsap-title"
            >
                {contact.title}
            </h3>

            {/* Info */}
            <p 
                className="text-slate-600 leading-relaxed gsap-info"
            >
                {contact.info}
            </p>
        </div>
    );
}

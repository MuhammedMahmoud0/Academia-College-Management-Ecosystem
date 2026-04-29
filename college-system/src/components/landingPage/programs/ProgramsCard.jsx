import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Icon components
const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4f46e5"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    <path d="M12 2v2" />
    <path d="M12 22v-2" />
    <path d="m17 20.66-1-1.73" />
    <path d="M11 10.27 7 3.34" />
    <path d="m20.66 17-1.73-1" />
    <path d="m3.34 7 1.73 1" />
    <path d="M14 12h8" />
    <path d="M2 12h2" />
    <path d="m20.66 7-1.73 1" />
    <path d="m3.34 17 1.73-1" />
    <path d="m17 3.34-1 1.73" />
    <path d="m11 13.73 4 6.93" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const iconMap = {
  code: CodeIcon,
  settings: SettingsIcon,
  briefcase: BriefcaseIcon,
};

export default function ProgramsCard({ program, index }) {
  const IconComponent = iconMap[program.icon] || CodeIcon;
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
    .fromTo('.gsap-desc',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      "-=0.3"
    );
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] hover:-translate-y-[5px] transition-all duration-300 p-8 text-center"
    >
      {/* Icon Circle */}
      <div
        className="w-20 h-20 mb-6 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-600 gsap-icon"
      >
        <IconComponent />
      </div>

      {/* Program Name */}
      <h3
        className="text-xl font-bold text-slate-900 mb-3 gsap-title"
      >
        {program.name}
      </h3>

      {/* Description */}
      <p
        className="text-slate-600 leading-relaxed gsap-desc"
      >
        {program.description}
      </p>
    </div>
  );
}

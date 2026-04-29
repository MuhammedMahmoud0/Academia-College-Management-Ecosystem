import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import appleLogo from "../../../assets/logos/apple.svg";
import googleLogo from "../../../assets/logos/google.svg";
import microsoftLogo from "../../../assets/logos/microsoft.svg";
import nasaLogo from "../../../assets/logos/nasa.svg";
import nvidiaLogo from "../../../assets/logos/nvidia.svg";

gsap.registerPlugin(ScrollTrigger);

export default function Career() {
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

  const stats = [
    { value: 95, label: "Job Placement Rate", suffix: "%" },
    { value: 80000, label: "Average Starting Salary", prefix: "$", suffix: "+" },
    { value: 500, label: "Industry Partners", suffix: "+" },
  ];

  const partners = [
    { name: "Apple", logo: appleLogo },
    { name: "Google", logo: googleLogo },
    { name: "Microsoft", logo: microsoftLogo },
    { name: "NASA", logo: nasaLogo },
    { name: "NVIDIA", logo: nvidiaLogo },
  ];

  function Counter({ value, prefix = "", suffix = "" }) {
    const [displayValue, setDisplayValue] = useState("0");
    const ref = useRef(null);

    useGSAP(() => {
        const obj = { val: 0 };
        gsap.to(obj, {
            val: value,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ref.current,
                start: "top 85%",
                once: true
            },
            onUpdate: function() {
                const num = Math.round(obj.val);
                const formatted = num.toLocaleString();
                setDisplayValue(`${prefix}${formatted}${suffix}`);
            }
        });
    }, { scope: ref });

    return <span ref={ref}>{displayValue}</span>;
  }

  return (
    <div id="careers" className="career-section py-12 md:py-20 px-4 md:px-8 bg-slate-50" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 gsap-header">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Career Outcomes & Industry Partners
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Your degree is a passport to a world of opportunity.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-600 mb-2">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-slate-600 font-medium text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-slate-600 max-w-3xl mx-auto text-sm md:text-base">
            Our graduates are highly sought after by leading companies across
            the globe.
          </p>
        </div>

        {/* Partner Logos */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="hover:scale-125 transition-transform duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-8 md:h-10 w-auto object-contain transform-gpu"
                loading="lazy"
                style={{ willChange: 'transform' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import collegeImage from '../../../assets/images/fcds.webp';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo('.gsap-text', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1,
        scrollTrigger: {
          trigger: '.about-text',
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo('.gsap-stat',
      { opacity: 0, scale: 0.8, y: 30 },
      {
        opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1,
        scrollTrigger: {
          trigger: ".gsap-stats-container",
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    gsap.fromTo('.gsap-image',
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1, scale: 1, duration: 1, ease: "power2.out",
        scrollTrigger: {
          trigger: '.gsap-image',
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: containerRef });

  function Counter({ value, suffix = "" }) {
    const [displayValue, setDisplayValue] = useState("0");
    const ref = useRef(null);

    useGSAP(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration: 2,
        ease: "power2.out",
        delay: 0.5,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        onUpdate: () => {
          setDisplayValue(`${Math.round(obj.val).toLocaleString()}${suffix}`);
        }
      });
    }, [value, suffix]);

    return <span ref={ref}>{displayValue}</span>;
  }

  return (
    <div id="about" className="about-section py-12 md:py-20 px-4 md:px-8 bg-white border border-slate-200" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="about-text">
            <h1 
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4 gsap-text"
            >
              About Academia College
            </h1>
            <h2 
              className="text-base md:text-lg font-semibold text-indigo-600 mb-4 md:mb-6 gsap-text"
            >
              Fostering a Legacy of Innovation and Excellence.
            </h2>
            <p 
              className="text-slate-600 mb-3 md:mb-4 leading-relaxed text-sm md:text-base gsap-text"
            >
              Founded in 1985, Academia College has been at the forefront of higher
              education, consistently ranked among the nation's top institutions.
              Our mission is to cultivate critical thinking, inspire lifelong
              learning, and prepare students to tackle the world's most pressing
              challenges.
            </p>
            <p 
              className="text-slate-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base gsap-text"
            >
              With state-of-the-art facilities, a world-renowned faculty, and a
              diverse student body, we provide a dynamic and supportive environment
              where ideas flourish and futures are forged.
            </p>

            {/* Stats */}
            <div 
              className="grid grid-cols-3 gap-4 md:gap-8 gsap-stats-container"
            >
              <div
                className="gsap-stat"
              >
                <div className="text-2xl md:text-4xl font-bold text-indigo-600 mb-1">
                  <Counter value={1985} />
                </div>
                <div className="text-xs md:text-sm text-slate-600">Founded In</div>
              </div>
              <div
                className="gsap-stat"
              >
                <div className="text-2xl md:text-4xl font-bold text-indigo-600 mb-1">
                  <Counter value={50} suffix="+" />
                </div>
                <div className="text-xs md:text-sm text-slate-600">Student Clubs</div>
              </div>
              <div
                className="gsap-stat"
              >
                <div className="text-2xl md:text-4xl font-bold text-indigo-600 mb-1">
                  <Counter value={10000} suffix="+" />
                </div>
                <div className="text-xs md:text-sm text-slate-600">Alumni Network</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="about-image gsap-image">
            <div className="rounded-2xl h-64 md:h-96 flex items-center justify-center shadow-xl shadow-black/30 overflow-hidden bg-slate-200">
                <img 
                  src={collegeImage} 
                  alt="College Campus" 
                  className="rounded-2xl h-64 md:h-96 w-full object-cover"
                  loading="lazy"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

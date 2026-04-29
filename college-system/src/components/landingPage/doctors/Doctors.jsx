import doctor1 from '../../../assets/Doctors/Doctor2.webp';
import doctor2 from '../../../assets/Doctors/Doctor3.webp';
import doctor3 from '../../../assets/Doctors/Doctor4.webp';
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Doctors() {
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

    gsap.fromTo('.gsap-doctor-card',
      { opacity: 0, y: 50 },
      { 
        opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out",
        scrollTrigger: {
          trigger: '.gsap-doctor-grid',
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

  }, { scope: containerRef });

  const faculty = [
    {
      id: 1,
      name: "Dr. Evelyn Reed",
      title: "Head of Computer Science",
      image: doctor1,
    },
    {
      id: 2,
      name: "Dr. Samuel Chen",
      title: "Professor of AI & ML",
      image: doctor2,
    },
    {
      id: 3,
      name: "Dr. Olivia Garcia",
      title: "Dean of Engineering",
      image: doctor3,
    }
  ];

  return (
    <div id="doctors" className="faculty-section py-12 md:py-20 px-4 md:px-8 bg-white" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div 
          className="text-center mb-12 md:mb-16 gsap-header"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Our Esteemed Faculty
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Learn from the brightest minds in the industry.
          </p>
        </div>

        {/* Faculty Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 gsap-doctor-grid">
          {faculty.map((member, index) => (
            <div 
              key={member.id} 
              className="text-center gsap-doctor-card transform-gpu"
            >
              {/* Image Circle */}
              <div 
                className="relative w-52 h-52 mx-auto mb-6 hover:scale-105 transition-transform duration-300"
              >
                <div 
                  className="absolute inset-[-20%] rounded-full opacity-50 gsap-doctor-bg"
                  style={{ background: 'radial-gradient(circle, rgba(165,180,252,0.8) 0%, rgba(165,180,252,0) 70%)' }}
                ></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-black/50">
                  <div 
                    className="w-full h-full bg-slate-200"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Name and Title */}
              <h3 
                className="text-xl font-bold text-slate-900 mb-2 gsap-doctor-name"
              >
                {member.name}
              </h3>
              <p 
                className="text-indigo-600 font-medium gsap-doctor-title"
              >
                {member.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

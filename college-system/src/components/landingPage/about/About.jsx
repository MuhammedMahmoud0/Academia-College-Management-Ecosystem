import { motion,animate, useMotionValue, useInView } from "motion/react";
import { useEffect, useState, useRef } from "react";
import collegeImage from '../../../assets/images/college2.jpg';


export default function About() {
  function Counter({ value, suffix = "" }) {
    const count = useMotionValue(0);
    const [displayValue, setDisplayValue] = useState("0");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
      if (!isInView) return;

      const unsubscribe = count.on("change", (latest) => {
        const num = Math.round(latest);
        const formatted = num.toLocaleString();
        setDisplayValue(`${formatted}${suffix}`);
      });

      const controls = animate(count, value, { 
        duration: 2,
        ease: "easeOut",
        delay: 1.5
      });

      return () => {
        unsubscribe();
        controls.stop();
      };
    }, [value, count, suffix, isInView]);

    return <span ref={ref}>{displayValue}</span>;
  }

  return (
    <div className="about-section py-20 px-8 bg-white border border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="about-text">
            <motion.h1 
              className="text-4xl font-bold text-slate-900 mb-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              About Academia College
            </motion.h1>
            <motion.h2 
              className="text-lg font-semibold text-indigo-600 mb-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Fostering a Legacy of Innovation and Excellence.
            </motion.h2>
            <motion.p 
              className="text-slate-600 mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              Founded in 1985, Academia College has been at the forefront of higher
              education, consistently ranked among the nation's top institutions.
              Our mission is to cultivate critical thinking, inspire lifelong
              learning, and prepare students to tackle the world's most pressing
              challenges.
            </motion.p>
            <motion.p 
              className="text-slate-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              With state-of-the-art facilities, a world-renowned faculty, and a
              diverse student body, we provide a dynamic and supportive environment
              where ideas flourish and futures are forged.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="text-4xl font-bold text-indigo-600 mb-1">
                  <Counter value={1985} />
                </div>
                <div className="text-sm text-slate-600">Founded In</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="text-4xl font-bold text-indigo-600 mb-1">
                  <Counter value={50} suffix="+" />
                </div>
                <div className="text-sm text-slate-600">Student Clubs</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="text-4xl font-bold text-indigo-600 mb-1">
                  <Counter value={10000} suffix="+" />
                </div>
                <div className="text-sm text-slate-600">Alumni Network</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - Image Placeholder */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1, ease: "easeOut" }} className="about-image">
            <div className="rounded-2xl h-96 flex items-center justify-center shadow-xl shadow-black/30 overflow-hidden bg-slate-200">
                <img 
                  src={collegeImage} 
                  alt="College Campus" 
                  className="rounded-2xl h-96 w-full object-cover transform-gpu"
                  loading="lazy"
                  style={{ 
                    willChange: 'transform',
                    contentVisibility: 'auto'
                  }}
                />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

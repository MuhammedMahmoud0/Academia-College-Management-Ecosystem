import { motion } from "motion/react";
import doctor1 from '../../../assets/Doctors/Doctor2.jpg';
import doctor2 from '../../../assets/Doctors/Doctor3.jpg';
import doctor3 from '../../../assets/Doctors/Doctor4.jpg';

export default function Doctors() {
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
    <div id="doctors" className="faculty-section py-12 md:py-20 px-4 md:px-8 bg-white border border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Our Esteemed Faculty
          </h1>
          <p className="text-slate-600 text-sm md:text-base">
            Learn from the brightest minds in the industry.
          </p>
        </motion.div>

        {/* Faculty Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          {faculty.map((member, index) => (
            <motion.div 
              key={member.id} 
              className="text-center"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut"
              }}
            >
              {/* Image Circle */}
              <motion.div 
                className="relative w-52 h-52 mx-auto mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 opacity-50 blur-xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 0.5, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ 
                    duration: 0.8,
                    delay: index * 0.2 + 0.2
                  }}
                ></motion.div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-black/50">
                  <div 
                    className="w-full h-full bg-slate-200"
                    style={{ contentVisibility: 'auto' }}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform-gpu"
                      loading="lazy"
                      style={{ willChange: 'transform' }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Name and Title */}
              <motion.h3 
                className="text-xl font-bold text-slate-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.2 + 0.3
                }}
              >
                {member.name}
              </motion.h3>
              <motion.p 
                className="text-indigo-600 font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.2 + 0.4
                }}
              >
                {member.title}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

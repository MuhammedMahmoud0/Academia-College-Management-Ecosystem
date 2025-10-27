import { motion } from "motion/react";

export default function StudentSayCard({ student, index }) {
    return (
        <motion.div 
            className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut"
            }}
            whileHover={{ scale: 1.02 }}
        >
            {/* Avatar Circle - Positioned at top center */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="relative w-20 h-20">
                    <div className={`absolute inset-0 rounded-full ${student.bgColor} opacity-60 blur-lg`}></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-200">
                        <img
                            src={student.image}
                            alt={student.name}
                            className="w-full h-full object-cover transform-gpu"
                            loading="lazy"
                            style={{ 
                                willChange: 'transform',
                                contentVisibility: 'auto'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mt-12 text-center">
                {/* Quote */}
                <motion.p 
                    className="text-slate-600 italic mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                        duration: 0.6,
                        delay: index * 0.2 + 0.2
                    }}
                >
                    "{student.comment}"
                </motion.p>

                {/* Student Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                        duration: 0.5,
                        delay: index * 0.2 + 0.3
                    }}
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {student.name}
                    </h3>
                    <p className="text-indigo-600 font-medium">
                        {student.title}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}
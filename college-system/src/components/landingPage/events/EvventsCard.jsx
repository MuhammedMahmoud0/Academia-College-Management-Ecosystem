import { motion } from "motion/react";

export default function EventsCard({ event, index }) {
    return (
        <motion.div 
            className="flex items-center bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            whileHover={{ scale: 1.02 }}
        >
            {/* Date Section */}
            <div className="flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center bg-white border-r-2 border-slate-100">
                <motion.div 
                    className="text-center"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                        duration: 0.4,
                        delay: index * 0.1 + 0.2
                    }}
                >
                    <div className="text-2xl font-bold text-indigo-600">
                        {event.month}
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {event.day}
                    </div>
                </motion.div>
            </div>

            {/* Event Details */}
            <div className="flex-1 p-6">
                <motion.h3 
                    className="text-lg font-bold text-slate-900 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                        duration: 0.4,
                        delay: index * 0.1 + 0.3
                    }}
                >
                    {event.title}
                </motion.h3>
                <motion.p 
                    className="text-sm text-slate-600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ 
                        duration: 0.4,
                        delay: index * 0.1 + 0.4
                    }}
                >
                    {event.time} - {event.location}
                </motion.p>
            </div>
        </motion.div>
    );
}
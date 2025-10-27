import { motion } from "motion/react"

export default function NewsCard({ image, date, title, index = 0 }) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }} 
            transition={{ 
                duration: 0.5,
                delay: index * 0.5,
                ease: "easeOut"
            }}
            className="news-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white transform-gpu"
        >
            {/* Image Header */}
            <div className="h-48 overflow-hidden bg-slate-200">
                <img 
                    src={image} 
                    alt={title} 
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    style={{ 
                        contentVisibility: 'auto',
                        willChange: 'transform'
                    }}
                />
            </div>
            
            {/* Content Section */}
            <div className="p-6">
                <div className="text-sm text-indigo-600 font-medium mb-2">{date}</div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4 leading-snug">
                    {title}
                </h4>
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm inline-flex items-center">
                    Read More →
                </a>
            </div>
        </motion.div>
    );
}
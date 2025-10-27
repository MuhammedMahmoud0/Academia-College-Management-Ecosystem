import { motion } from "motion/react";

export default function ImagesCard({ title, bgImage, bgColor = "bg-indigo-500", isHovered, isOtherHovered, onHover, onLeave }) {
    return (
        <motion.div 
            className="relative rounded-lg h-100 flex items-center justify-center text-white text-2xl font-bold cursor-pointer overflow-hidden"
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            animate={{
                width: isHovered ? 320 : isOtherHovered ? 128 : 240,
                scale: isHovered ? 1.05 : 1
            }}
            transition={{
                width: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                scale: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.8 },
                y: { duration: 0.8, ease: "easeOut" }
            }}
            whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
            }}
            style={{ 
                willChange: 'transform, width',
                backfaceVisibility: 'hidden'
            }}
        >
            {/* Background Image with optimization */}
            {bgImage ? (
                <motion.div 
                    className="absolute inset-0 bg-slate-200"
                    animate={{
                        scale: isHovered ? 1.1 : 1
                    }}
                    transition={{
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                >
                    <img
                        src={bgImage}
                        alt={title}
                        className="w-full h-full object-cover transform-gpu"
                        loading="lazy"
                        style={{ 
                            willChange: 'transform',
                            contentVisibility: 'auto'
                        }}
                    />
                </motion.div>
            ) : (
                <div className={`absolute inset-0 ${bgColor}`}></div>
            )}
            
            {/* Overlay for better text readability */}
            <motion.div 
                className="absolute inset-0 bg-black/40"
                animate={{
                    opacity: isHovered ? 0.2 : 0.4
                }}
                transition={{ duration: 0.4 }}
            ></motion.div>
            
            {/* Title */}
            <motion.span 
                className="relative z-10"
                animate={{
                    scale: isHovered ? 1.1 : 1,
                    opacity: isOtherHovered ? 0 : 1
                }}
                transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                }}
            >
                {title}
            </motion.span>
        </motion.div>
    );
}
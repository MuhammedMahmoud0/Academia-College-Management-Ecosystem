import { useState, useEffect } from "react";

export default function ImagesCard({ title, bgImage, bgColor = "bg-indigo-500", isHovered, isOtherHovered, onHover, onLeave }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Mobile: full width, Desktop: animated widths
    const getWidth = () => {
        if (isMobile) return '100%';
        return isHovered ? 320 : isOtherHovered ? 128 : 240;
    };

    return (
        <div 
            className={`relative rounded-lg h-80 md:h-96 flex items-center justify-center text-white text-xl md:text-2xl font-bold cursor-pointer overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isHovered ? 'scale-105' : 'scale-100'}`}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            style={{ 
                width: getWidth(),
                minWidth: isMobile ? '100%' : undefined
            }}
        >
            {/* Background Image with optimization */}
            {bgImage ? (
                <div 
                    className={`absolute inset-0 bg-slate-200 transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isHovered ? 'scale-110' : 'scale-100'}`}
                >
                    <img
                        src={bgImage}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className={`absolute inset-0 ${bgColor}`}></div>
            )}
            
            {/* Overlay for better text readability */}
            <div 
                className={`absolute inset-0 bg-black transition-opacity duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isHovered ? 'opacity-20' : 'opacity-40'}`}
            ></div>
            
            {/* Title */}
            <span 
                className={`relative z-10 px-4 text-center transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${isHovered ? 'scale-110' : 'scale-100'} ${isMobile ? 'opacity-100' : (isOtherHovered ? 'opacity-0' : 'opacity-100')}`}
            >
                {title}
            </span>
        </div>
    );
}

export default function ImagesCard({ title, bgImage, bgColor = "bg-indigo-500", isHovered, isOtherHovered, onHover, onLeave }) {
    return (
        <div 
            className={`relative rounded-lg h-100 flex items-center justify-center text-white text-2xl font-bold transition-all duration-800 cursor-pointer overflow-hidden ${
                isHovered ? 'w-80 scale-105' : isOtherHovered ? 'w-32' : 'w-60'
            }`}
            style={bgImage ? {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            } : {}}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* Fallback background color if no image */}
            {!bgImage && <div className={`absolute inset-0 ${bgColor}`}></div>}
            
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Title */}
            <span className="relative z-10">{title}</span>
        </div>
    );
}
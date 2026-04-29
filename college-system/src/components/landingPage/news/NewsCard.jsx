export default function NewsCard({ image, date, title }) {
    return (
        <div 
            className="news-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white h-full flex flex-col"
        >
            {/* Image Header */}
            <div className="h-48 overflow-hidden bg-slate-200 shrink-0">
                <img 
                    src={image} 
                    alt={title} 
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
            </div>
            
            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div className="text-sm text-indigo-600 font-medium mb-2">{date}</div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 leading-snug">
                        {title}
                    </h4>
                </div>
                <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm inline-flex items-center mt-auto">
                    Read More →
                </a>
            </div>
        </div>
    );
}

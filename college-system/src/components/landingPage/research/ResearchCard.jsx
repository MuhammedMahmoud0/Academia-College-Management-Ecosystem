export default function ResearchCard({icon , title, description}) {
    return (
        <div className="p-8 flex flex-col justify-center items-start bg-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="mb-4">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-start">{description}</p>
        </div>
    );
}

export default function StudentSayCard({ student }) {
    return (
        <div 
            className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full transform-gpu"
        >
            {/* Avatar Circle - Positioned at top center */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <div className="relative w-20 h-20">
                    <div 
                        className="absolute inset-[-30%] rounded-full opacity-60"
                        style={{ background: 'radial-gradient(circle, rgba(165,180,252,0.8) 0%, rgba(165,180,252,0) 70%)' }}
                    ></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-200">
                        <img
                            src={student.image}
                            alt={student.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mt-12 text-center">
                {/* Quote */}
                <p 
                    className="text-slate-600 italic mb-6 leading-relaxed gsap-quote"
                >
                    "{student.comment}"
                </p>

                {/* Student Info */}
                <div
                    className="gsap-info"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {student.name}
                    </h3>
                    <p className="text-indigo-600 font-medium">
                        {student.title}
                    </p>
                </div>
            </div>
        </div>
    );
}

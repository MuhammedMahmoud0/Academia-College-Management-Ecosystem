
export default function Hero() {
    const videoUrl = "https://www.dropbox.com/scl/fi/clvhheuxaph83tp4ugc1r/college.mp4?rlkey=9cs1a8ahjrnue75w1hsaqllii&st=bm6qpujs&raw=1";
    return (
        <div className="relative hero h-[100vh] w-full flex justify-center items-center overflow-hidden border-b border-slate-200">
            {/* Overlay for darkening video */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0"></div>
            
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230f172a' width='1920' height='1080'/%3E%3C/svg%3E"
                style={{ 
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    perspective: 1000
                }}
                
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            
            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col gap-4 md:gap-6 items-center text-center px-4 md:px-8">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg">
                    Welcome To Academia 
                </h1>
                <h1 className="text-base md:text-xl lg:text-2xl font-bold text-white drop-shadow-lg max-w-4xl">
                    A tradition of excellence, a future of innovation. Join a community dedicated to shaping the leaders of tomorrow.
                </h1>
            </div>
        </div>
    )
}

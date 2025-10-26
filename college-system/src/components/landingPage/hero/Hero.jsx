
export default function Hero() {
    const videoUrl = "https://www.dropbox.com/scl/fi/clvhheuxaph83tp4ugc1r/college.mp4?rlkey=9cs1a8ahjrnue75w1hsaqllii&st=bm6qpujs&dl=1";
    return (
        <div className="relative hero h-[100vh] w-full flex justify-center items-center overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
            />
            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col gap-6 items-center text-center px-4">
                <h1 className="text-7xl font-bold text-white drop-shadow-lg">
                    Welcome To Academia 
                </h1>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                    A tradition of excellence, a future of innovation. Join a community dedicated to shaping the leaders of tomorrow.
                </h1>
            </div>
            {/* Optional: Overlay for darkening video */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-5"></div>
        </div>
    )
}
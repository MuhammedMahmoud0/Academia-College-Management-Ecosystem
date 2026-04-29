import { useState, useRef, useEffect } from 'react';
import ImagesCard from "./ImagesCard.jsx"; 

import libraryImg from '../../../assets/images/library.webp';
import labsImg from '../../../assets/images/labs.webp';
import sportsImg from '../../../assets/images/sports1.webp';
import loungeImg from '../../../assets/images/lounge.webp';

export default function Campus() {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const videoRef = useRef(null);
    const videoUrl = "https://www.dropbox.com/scl/fi/zjhqrknt4iydbgr3ui3ky/college-tour.mp4?rlkey=jcig7h9frhakec6fmjk1w3ufx&st=vlto9bp1&raw=1";

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setShouldLoadVideo(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '200px' }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div id="campus" className="campus-life-section py-12 md:py-20 px-4 md:px-8 bg-slate-100 border border-slate-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        Campus Life & Virtual Tour
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base">
                        Experience the vibrant heart of our community.
                    </p>
                </div>

                {/* Image Cards Grid */}
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-6 md:justify-center mb-12 md:mb-16">
                    <ImagesCard 
                        title="Library" 
                        bgColor="bg-indigo-600"
                        bgImage={libraryImg}  
                        isHovered={hoveredCard === 0}
                        isOtherHovered={hoveredCard !== null && hoveredCard !== 0}
                        onHover={() => setHoveredCard(0)}
                        onLeave={() => setHoveredCard(null)}
                    />
                    <ImagesCard 
                        title="Modern Labs" 
                        bgColor="bg-indigo-500"
                        bgImage={labsImg}  
                        isHovered={hoveredCard === 1}
                        isOtherHovered={hoveredCard !== null && hoveredCard !== 1}
                        onHover={() => setHoveredCard(1)}
                        onLeave={() => setHoveredCard(null)}
                    />
                    <ImagesCard 
                        title="Sports Complex" 
                        bgColor="bg-indigo-400"
                        bgImage={sportsImg} 
                        isHovered={hoveredCard === 2}
                        isOtherHovered={hoveredCard !== null && hoveredCard !== 2}
                        onHover={() => setHoveredCard(2)}
                        onLeave={() => setHoveredCard(null)}
                    />
                    <ImagesCard 
                        title="Student Lounge" 
                        bgColor="bg-indigo-300"
                        bgImage={loungeImg} 
                        isHovered={hoveredCard === 3}
                        isOtherHovered={hoveredCard !== null && hoveredCard !== 3}
                        onHover={() => setHoveredCard(3)}
                        onLeave={() => setHoveredCard(null)}
                    />
                </div>

                {/* Virtual Tour Section */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Take a Virtual Tour
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Can't make it to campus? Explore our facilities from anywhere in the world with our interactive virtual tour.
                    </p>
                </div>

                {/* Video */}
                <div className="max-w-4xl mx-auto" ref={videoRef}>
                    <div className="bg-slate-900 rounded-lg overflow-hidden shadow-2xl relative">
                        {shouldLoadVideo ? (
                            <video 
                                controls
                                playsInline
                                preload="metadata"
                                className="w-full h-auto relative z-10"
                                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230f172a' width='1920' height='1080'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='%23fff' text-anchor='middle' dominant-baseline='middle'%3EClick to load video%3C/text%3E%3C/svg%3E"
                            >
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="w-full aspect-video bg-slate-900 flex items-center justify-center">
                                <p className="text-slate-400">Loading video...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}   
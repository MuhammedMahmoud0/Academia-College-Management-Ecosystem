import { useState } from 'react';
import ImagesCard from "./ImagesCard.jsx"; 

import libraryImg from '../../../assets/images/library.jpg';
import labsImg from '../../../assets/images/labs.jpg';
import sportsImg from '../../../assets/images/sports1.jpg';
import loungeImg from '../../../assets/images/lounge.jpg';

export default function Campus() {
    const [hoveredCard, setHoveredCard] = useState(null);
    const videoUrl = "https://www.dropbox.com/scl/fi/zjhqrknt4iydbgr3ui3ky/college-tour.mp4?rlkey=jcig7h9frhakec6fmjk1w3ufx&st=vlto9bp1&dl=1";

    return (
        <div className="campus-life-section py-20 px-8 bg-slate-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Campus Life & Virtual Tour
                    </h1>
                    <p className="text-slate-600">
                        Experience the vibrant heart of our community.
                    </p>
                </div>

                {/* Image Cards Grid */}
                <div className="flex flex-wrap gap-6 justify-center mb-16">
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
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-900 rounded-lg overflow-hidden shadow-2xl">
                        <video 
                            src={videoUrl} 
                            controls
                            controlsList="nodownload"
                            disablePictureInPicture
                            className="w-full h-auto"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
}   
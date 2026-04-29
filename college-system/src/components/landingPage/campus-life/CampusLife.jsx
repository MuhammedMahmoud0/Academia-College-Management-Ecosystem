import { useState, useRef } from 'react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ImagesCard from "./ImagesCard.jsx"; 

import libraryImg from '../../../assets/images/library.webp';
import labsImg from '../../../assets/images/labs.webp';
import sportsImg from '../../../assets/images/sports1.webp';
import loungeImg from '../../../assets/images/lounge.webp';

gsap.registerPlugin(ScrollTrigger);

export default function CampusLife() {
    const [hoveredCard, setHoveredCard] = useState(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.gsap-campus-card');
        gsap.fromTo(cards,
            { opacity: 0, y: 50 },
            { 
                opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out",
                scrollTrigger: {
                    trigger: '.gsap-campus-grid',
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    }, { scope: containerRef });

    return (
        <div id="campus" className="campus-life-section pt-12 md:pt-20 px-4 md:px-8 bg-white border-t border-slate-200" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        Campus Life
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base">
                        Experience the vibrant heart of our community.
                    </p>
                </div>

                {/* Image Cards Grid */}
                <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-6 md:justify-center pb-12 md:pb-16 gsap-campus-grid">
                    <div className="gsap-campus-card">
                        <ImagesCard 
                            title="Library" 
                            bgColor="bg-indigo-600"
                            bgImage={libraryImg}  
                            isHovered={hoveredCard === 0}
                            isOtherHovered={hoveredCard !== null && hoveredCard !== 0}
                            onHover={() => setHoveredCard(0)}
                            onLeave={() => setHoveredCard(null)}
                        />
                    </div>
                    <div className="gsap-campus-card">
                        <ImagesCard 
                            title="Modern Labs" 
                            bgColor="bg-indigo-500"
                            bgImage={labsImg}  
                            isHovered={hoveredCard === 1}
                            isOtherHovered={hoveredCard !== null && hoveredCard !== 1}
                            onHover={() => setHoveredCard(1)}
                            onLeave={() => setHoveredCard(null)}
                        />
                    </div>
                    <div className="gsap-campus-card">
                        <ImagesCard 
                            title="Sports Complex" 
                            bgColor="bg-indigo-400"
                            bgImage={sportsImg} 
                            isHovered={hoveredCard === 2}
                            isOtherHovered={hoveredCard !== null && hoveredCard !== 2}
                            onHover={() => setHoveredCard(2)}
                            onLeave={() => setHoveredCard(null)}
                        />
                    </div>
                    <div className="gsap-campus-card">
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
                </div>
            </div>
        </div>
    );
}

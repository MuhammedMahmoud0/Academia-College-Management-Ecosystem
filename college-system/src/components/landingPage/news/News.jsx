import NewsCard from "./NewsCard";
import techEvent from '../../../assets/events/tech event.webp';
import musicEvent from '../../../assets/events/music event.webp';
import showEvent from '../../../assets/events/show event.webp';
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function News() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.gsap-news-card',
            { opacity: 0, y: 50 },
            { 
                opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out",
                scrollTrigger: {
                    trigger: '.gsap-news-grid',
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    }, { scope: containerRef });

    const newsItems = [
        {
            date: "Oct 12, 2025",
            title: "Machine Learning Vs Neural Networks ",
            image: techEvent
        },
        {
            date: "Oct 10, 2025",
            title: "Campus Music Festival Rocks the Grounds",
            image: musicEvent
        },
        {
            date: "Oct 5, 2025",
            title: "Annual Drama Showcase Captivates Audience",
            image: showEvent
        }
    ];

    return (
        <div id="news" className="news-section py-12 md:py-20 px-4 md:px-8 bg-slate-100" ref={containerRef}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        Latest News
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Stay updated with the latest happenings on campus.
                    </p>
                </div>

                {/* News Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 gsap-news-grid">
                    {newsItems.map((item, index) => (
                        <div key={index} className="gsap-news-card">
                            <NewsCard
                                image={item.image}
                                date={item.date}
                                title={item.title}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

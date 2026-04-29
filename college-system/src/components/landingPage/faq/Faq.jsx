import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(null);
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo('.gsap-header', 
            { opacity: 0, y: -20 },
            { 
                opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
                scrollTrigger: {
                    trigger: '.gsap-header',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        const items = gsap.utils.toArray('.gsap-faq-item');
        gsap.fromTo(items,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
                scrollTrigger: {
                    trigger: '.gsap-faq-container',
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );
    }, { scope: containerRef });

    const faqs = [
        {
            id: 1,
            question: "What are the admission requirements for the CS program?",
            answer: "Applicants need a strong background in mathematics and science, a minimum GPA of 3.0, and completion of prerequisite courses in calculus and programming. SAT/ACT scores are also considered."
        },
        {
            id: 2,
            question: "Are there scholarships available for international students?",
            answer: "Yes, we offer various merit-based and need-based scholarships for international students. These include academic excellence scholarships, diversity scholarships, and program-specific awards."
        },
        {
            id: 3,
            question: "What is campus life like?",
            answer: "Our campus offers a vibrant community with over 50 student clubs, state-of-the-art facilities, modern dormitories, recreational centers, and numerous cultural and social events throughout the year."
        },
        {
            id: 4,
            question: "Does the university provide career services?",
            answer: "Absolutely! Our Career Services Center offers resume workshops, mock interviews, job placement assistance, internship opportunities, and networking events with industry professionals."
        }
    ];

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div id="faq" className="faq-section py-12 md:py-20 px-4 md:px-8 bg-slate-50" ref={containerRef}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div 
                    className="text-center mb-12 md:mb-16 gsap-header"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        Frequently Asked Questions
                    </h2>
                </div>

                {/* FAQ Items */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4 gsap-faq-container">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq.id}
                            className="border-b border-slate-200 last:border-b-0 gsap-faq-item"
                        >
                            {/* Question */}
                            <button
                                className="w-full py-4 flex items-center justify-between text-left hover:text-indigo-600 transition-colors duration-300"
                                onClick={() => toggleFaq(index)}
                            >
                                <span className="text-lg font-medium text-slate-900">
                                    {faq.question}
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`flex-shrink-0 ml-4 text-slate-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Answer */}
                            <div
                                className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <p className="pb-4 text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

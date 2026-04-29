import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Icon Components
const GraduationCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
);

const LinkedinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

export default function Footer() {
    const footerRef = useRef(null);

    useGSAP(() => {
        const columns = gsap.utils.toArray('.gsap-footer-col');
        gsap.fromTo(columns,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            }
        );

        gsap.fromTo('.gsap-footer-bottom',
            { opacity: 0 },
            {
                opacity: 1, duration: 0.6, delay: 0.3, ease: "power2.out",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            }
        );
    }, { scope: footerRef });

    const quickLinks = [
        { name: "About", href: "#about" },
        { name: "Admissions", href: "#admissions" },
        { name: "Campus Life", href: "#campus" },
        { name: "Research", href: "#research" },
        { name: "Careers", href: "#careers" },
        { name: "News", href: "#news" },
        { name: "Doctors", href: "#doctors" },
        { name: "Student Say", href: "#student-say" },
        { name: "Events", href: "#events" },
        { name: "Programs", href: "#programs" },
        { name: "FAQ", href: "#faq" },
        { name: "Contact", href: "#contact" }
    ];

    const socialLinks = [
        { name: "Facebook", icon: FacebookIcon, href: "#" },
        { name: "Twitter", icon: TwitterIcon, href: "#" },
        { name: "LinkedIn", icon: LinkedinIcon, href: "#" }
    ];

    return (
        <footer className="bg-slate-900 text-slate-300 py-12 md:py-16 px-4 md:px-8 border-t border-slate-800" style={{ backgroundColor: '#0f172a' }} ref={footerRef}>
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
                    {/* Brand Section */}
                    <div className="gsap-footer-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-indigo-500">
                                <GraduationCapIcon />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white">Academia College</h3>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                            A tradition of excellence, a future of innovation. Join a community dedicated to shaping the leaders of tomorrow.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="gsap-footer-col">
                        <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a 
                                        href={link.href} 
                                        className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="gsap-footer-col">
                        <h4 className="text-base md:text-lg font-bold text-white mb-4">Contact Us</h4>
                        <div className="space-y-2 text-slate-400 text-sm md:text-base">
                            <p>123 University Ave, Alexandria, Egypt</p>
                            <p>+20 3 123 4567</p>
                            <p>contact@academia.edu.eg</p>
                        </div>

                        {/* Social Icons */}
                        <div className="mt-6">
                            <h5 className="text-white font-semibold mb-3 text-sm md:text-base">Follow Us</h5>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="text-slate-400 hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all duration-300 inline-block"
                                    >
                                        <social.icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Border */}
                <div className="border-t border-slate-800 pt-6 md:pt-8">
                    <p 
                        className="text-center text-slate-500 text-xs md:text-sm gsap-footer-bottom"
                    >
                        © 2025 Academia College. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
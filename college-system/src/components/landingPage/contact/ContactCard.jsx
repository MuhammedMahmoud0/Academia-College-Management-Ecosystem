import { motion } from "motion/react";

// Icon Components
const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.92 14.9 14.9 0 0 0 .36 2.78 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 14.9 14.9 0 0 0 2.78.36A2 2 0 0 1 22 16.92z" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const iconMap = {
    "map-pin": MapPinIcon,
    "phone": PhoneIcon,
    "mail": MailIcon
};

export default function ContactCard({ contact, index }) {
    const IconComponent = iconMap[contact.icon] || MapPinIcon;

    return (
        <motion.div 
            className="flex flex-col items-center bg-slate-50 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center border border-slate-100"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut"
            }}
            whileHover={{ scale: 1.03, y: -5 }}
        >
            {/* Icon */}
            <motion.div 
                className="mb-6 text-indigo-600"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                    duration: 0.6,
                    delay: index * 0.15 + 0.2,
                    ease: "easeOut"
                }}
            >
                <IconComponent />
            </motion.div>

            {/* Title */}
            <motion.h3 
                className="text-xl font-bold text-slate-900 mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                    duration: 0.5,
                    delay: index * 0.15 + 0.3
                }}
            >
                {contact.title}
            </motion.h3>

            {/* Info */}
            <motion.p 
                className="text-slate-600 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                    duration: 0.5,
                    delay: index * 0.15 + 0.4
                }}
            >
                {contact.info}
            </motion.p>
        </motion.div>
    );
}
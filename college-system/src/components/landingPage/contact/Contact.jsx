import { motion } from "motion/react";
import ContactCard from "./ContactCard";

export default function Contact() {
    const contactInfo = [
        {
            id: 1,
            icon: "map-pin",
            title: "Our Address",
            info: "123 University Ave, Alexandria, Egypt"
        },
        {
            id: 2,
            icon: "phone",
            title: "Call Us",
            info: "+20 3 123 4567"
        },
        {
            id: 3,
            icon: "mail",
            title: "Email Us",
            info: "contact@academia.edu.eg"
        }
    ];

    return (
        <div id="contact" className="contact-section py-12 md:py-20 px-4 md:px-8 bg-white border border-slate-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                        Get in Touch
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        We're here to help and answer any question you might have.
                    </p>
                </motion.div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {contactInfo.map((contact, index) => (
                        <ContactCard 
                            key={contact.id} 
                            contact={contact}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
import { motion } from "motion/react";
import { useState } from "react";

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(null);

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
        <div className="faq-section py-20 px-8 bg-slate-50 border border-slate-200">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                </motion.div>

                {/* FAQ Items */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            className="border-b border-slate-200 last:border-b-0"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ 
                                duration: 0.5,
                                delay: index * 0.1
                            }}
                        >
                            {/* Question */}
                            <button
                                className="w-full py-4 flex items-center justify-between text-left hover:text-indigo-600 transition-colors duration-300"
                                onClick={() => toggleFaq(index)}
                            >
                                <span className="text-lg font-medium text-slate-900">
                                    {faq.question}
                                </span>
                                <motion.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="flex-shrink-0 ml-4 text-slate-600"
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </motion.svg>
                            </button>

                            {/* Answer */}
                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? "auto" : 0,
                                    opacity: openIndex === index ? 1 : 0
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <p className="pb-4 text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
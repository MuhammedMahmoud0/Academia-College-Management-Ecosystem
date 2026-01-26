import { useState } from 'react';
import FAQCard from '../components/FAQ/FAQCard';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(1);

  const categories = ['All', 'Admissions', 'Academics', 'Campus Life', 'Financial'];

  const faqs = [
    {
      id: 1,
      question: 'What are the admission requirements?',
      answer: 'Admission requires a high school diploma with a strong background in mathematics and science. A competitive score in the national entrance exam is also necessary.',
      category: 'Admissions'
    },
    {
      id: 2,
      question: 'How do I apply for a scholarship?',
      answer: 'To apply for a scholarship, visit our financial aid office or check the scholarships section on our website. Applications are typically reviewed during the admission process.',
      category: 'Financial'
    },
    {
      id: 3,
      question: 'Can I change my major?',
      answer: 'Yes, you can change your major after completing your first year, subject to availability and meeting the requirements of the new program.',
      category: 'Academics'
    },
    {
      id: 4,
      question: 'How are grades calculated?',
      answer: 'Grades are calculated based on a combination of assignments, midterm exams, final exams, and class participation. Each course syllabus provides specific weightings.',
      category: 'Academics'
    },
    {
      id: 5,
      question: 'What student clubs are available?',
      answer: 'We offer a wide variety of student clubs including sports, arts, technology, volunteering, and academic clubs. Check the student affairs office for a complete list.',
      category: 'Campus Life'
    },
    {
      id: 6,
      question: 'Are there on-campus housing options?',
      answer: 'Yes, we provide on-campus dormitories for both male and female students with various amenities including study rooms, cafeteria, and recreational facilities.',
      category: 'Campus Life'
    },
    {
      id: 7,
      question: 'What is the tuition fee for the Computer Science program?',
      answer: 'Tuition fees vary by program and year. Please visit our admissions office or check our website for the most current tuition information for the Computer Science program.',
      category: 'Financial'
    },
    {
      id: 8,
      question: 'Are payment plans available?',
      answer: 'Yes, we offer flexible payment plans that allow you to pay tuition in installments throughout the academic year. Contact the finance office for more details.',
      category: 'Financial'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 bg-gray-50 min-h-screen">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600">
          Find answers to common questions about admissions, academics, and campus life.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative flex items-center">
          <svg 
            className="absolute left-4 pointer-events-none" 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none"
          >
            <path 
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" 
              stroke="#9CA3AF" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search for a question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm md:text-base border border-gray-300 rounded-lg outline-none bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 md:px-5 py-2 text-sm md:text-base font-medium border-none rounded-full cursor-pointer outline-none transition-all ${
              activeCategory === category
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm">
        {filteredFaqs.map((faq) => (
          <FAQCard
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            isExpanded={expandedId === faq.id}
            onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
          />
        ))}
      </div>
    </div>
  );
}
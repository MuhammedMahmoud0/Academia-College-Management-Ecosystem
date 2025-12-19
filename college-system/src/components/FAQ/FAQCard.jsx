export default function FAQCard({ question, answer, isExpanded, onToggle }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-4 md:px-6 md:py-5 bg-transparent border-none cursor-pointer text-left outline-none hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm md:text-base font-semibold text-gray-800 pr-4">
          {question}
        </span>
        <svg
          className={`flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 md:px-6 md:pb-6 bg-white">
          <p className="text-sm md:text-base leading-relaxed text-gray-600 m-0">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
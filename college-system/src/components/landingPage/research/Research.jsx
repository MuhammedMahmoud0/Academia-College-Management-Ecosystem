import ResearchCard from "./ResearchCard";

const icons = {
  research1: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4f46e5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2v7.31" />
      <path d="M14 9.31V2" />
      <path d="M8.5 2h7" />
      <path d="M14 9.31C16.57 10.47 18 12.59 18 15a6 6 0 0 1-12 0c0-2.41 1.43-4.53 4-5.69" />
      <path d="M9 15h6" />
    </svg>
  ),
  research2: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4f46e5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 2v2" />
      <path d="M12 22v-2" />
      <path d="m17 20.66-1-1.73" />
      <path d="M11 10.27 7 3.34" />
      <path d="m20.66 17-1.73-1" />
      <path d="m3.34 7 1.73 1" />
      <path d="M14 12h8" />
      <path d="M2 12h2" />
      <path d="m20.66 7-1.73 1" />
      <path d="m3.34 17 1.73-1" />
      <path d="m17 3.34-1 1.73" />
      <path d="m11 13.73 4 6.93" />
    </svg>
  ),
  research3: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4f46e5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
};
export default function ResearchSection() {
  return (
    <div id="research" className="research-section py-12 md:py-20 px-4 md:px-8 bg-white border border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Research & Innovation Hub
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Driving the future through groundbreaking research and collaborative
            innovation.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <ResearchCard
            icon={icons.research1}
            title="AI in Medicine"
            description="Developing machine learning models to predict disease outbreaks and personalized treatments."
          />
          <ResearchCard
            icon={icons.research2}
            title="AI in Education"
            description="Leveraging AI to create personalized learning experiences and improve educational outcomes."
          />
          <ResearchCard
            icon={icons.research3}
            title="Quantum Computing"
            description="Exploring the potential of quantum algorithms to solve complex global economic challenges."
          />
        </div>
      </div>
    </div>
  );
}

import collegeImage from '../../../assets/images/college2.jpg';


export default function About() {
  return (
    <div className="about-section py-20 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="about-text">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              About Academia College
            </h1>
            <h2 className="text-lg font-semibold text-indigo-600 mb-6">
              Fostering a Legacy of Innovation and Excellence.
            </h2>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Founded in 1985, Academia College has been at the forefront of higher
              education, consistently ranked among the nation's top institutions.
              Our mission is to cultivate critical thinking, inspire lifelong
              learning, and prepare students to tackle the world's most pressing
              challenges.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              With state-of-the-art facilities, a world-renowned faculty, and a
              diverse student body, we provide a dynamic and supportive environment
              where ideas flourish and futures are forged.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-1">1,985</div>
                <div className="text-sm text-slate-600">Founded In</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-1">50+</div>
                <div className="text-sm text-slate-600">Student Clubs</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-indigo-600 mb-1">10,000+</div>
                <div className="text-sm text-slate-600">Alumni Network</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image Placeholder */}
          <div className="about-image">
            <div className="rounded-2xl h-96 flex items-center justify-center shadow-xl shadow-black/30 overflow-hidden">
                <img src={collegeImage} alt="College Campus" className="rounded-2xl h-96 w-full object-cover"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

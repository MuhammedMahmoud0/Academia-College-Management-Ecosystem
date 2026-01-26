import { useState } from 'react';
import './IDCard.css';

const Card = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const studentData = {
    name: "John Doe",
    id: "AC-123456",
    level: "3rd Year",
    department: "Data Science",
    initials: "JD",
    issued: "Sep 2023",
    expiry: "Jul 2027",
    college: "Academia College",
    subtitle: "STUDENT IDENTITY"
  };

  const privileges = [
    { icon: "📚", text: "Library Access" },
    { icon: "🔬", text: "CS & Engineering Labs" },
    { icon: "💪", text: "Gym & Sports Facilities" }
  ];

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 md:mb-8 text-center">Digital Student ID</h1>
      
      <div className="perspective-1000 mb-6 md:mb-8 w-full max-w-[400px] px-4 sm:px-0">
        <div 
          className={`relative w-full max-w-[400px] h-[200px] sm:h-[220px] md:h-[240px] transition-transform duration-600 cursor-pointer ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
          onClick={handleCardClick}
        >
          {/* Front of Card */}
          <div 
            className="absolute w-full h-full rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 flex flex-col justify-between bg-gradient-to-br from-purple-200 to-blue-300"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4L4 10L16 16L28 10L16 4Z" fill="#7C3AED" stroke="#7C3AED" strokeWidth="2"/>
                  <path d="M4 16L16 22L28 16" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 22L16 28L28 22" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-800 m-0">{studentData.college}</h3>
                <p className="text-[0.6rem] sm:text-[0.7rem] text-gray-600 m-0 tracking-wider">{studentData.subtitle}</p>
              </div>
            </div>
            
            <div className="flex gap-3 sm:gap-4 items-center flex-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold text-white flex-shrink-0 shadow-lg">
                {studentData.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 m-0 mb-0.5 sm:mb-1 truncate">{studentData.name}</h2>
                <p className="text-xs sm:text-sm text-gray-600 m-0 mb-0.5 sm:mb-1 font-medium">{studentData.id}</p>
                <p className="text-xs sm:text-sm text-gray-600 m-0 mb-0.5 sm:mb-1">{studentData.department}</p>
                <p className="text-[0.7rem] sm:text-[0.8rem] text-gray-500 m-0">{studentData.level}</p>
              </div>
            </div>
            
            <div className="flex justify-between text-[0.65rem] sm:text-xs text-gray-600 pt-2 sm:pt-3 border-t border-black border-opacity-10">
              <span>Issued: {studentData.issued}</span>
              <span>Expires: {studentData.expiry}</span>
            </div>
          </div>

          {/* Back of Card */}
          <div 
            className="absolute w-full h-full rounded-xl sm:rounded-2xl shadow-2xl p-0 bg-gray-800 overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="h-full flex flex-col justify-between p-4 sm:p-5 md:p-6">
              <div className="w-[calc(100%+2rem)] sm:w-[calc(100%+2.5rem)] md:w-[calc(100%+3rem)] h-[40px] sm:h-[45px] md:h-[50px] bg-gray-800 -mt-4 sm:-mt-5 md:-mt-6 -mx-4 sm:-mx-5 md:-mx-6 mb-3 sm:mb-4"></div>
              <div className="flex gap-2 sm:gap-3 md:gap-4 items-center flex-1">
                <div className="bg-black p-1.5 sm:p-2 rounded-lg w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 80 80" fill="white">
                    <rect x="0" y="0" width="12" height="12"/>
                    <rect x="16" y="0" width="12" height="12"/>
                    <rect x="32" y="0" width="12" height="12"/>
                    <rect x="52" y="0" width="12" height="12"/>
                    <rect x="68" y="0" width="12" height="12"/>
                    
                    <rect x="0" y="16" width="12" height="12"/>
                    <rect x="68" y="16" width="12" height="12"/>
                    
                    <rect x="0" y="32" width="12" height="12"/>
                    <rect x="16" y="32" width="12" height="12"/>
                    <rect x="32" y="32" width="12" height="12"/>
                    <rect x="52" y="32" width="12" height="12"/>
                    <rect x="68" y="32" width="12" height="12"/>
                    
                    <rect x="0" y="52" width="12" height="12"/>
                    <rect x="32" y="52" width="12" height="12"/>
                    <rect x="68" y="52" width="12" height="12"/>
                    
                    <rect x="0" y="68" width="12" height="12"/>
                    <rect x="16" y="68" width="12" height="12"/>
                    <rect x="32" y="68" width="12" height="12"/>
                    <rect x="52" y="68" width="12" height="12"/>
                    <rect x="68" y="68" width="12" height="12"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.55rem] sm:text-[0.6rem] md:text-[0.65rem] text-gray-200 leading-relaxed m-0">This card is for the use of the person named and should be carried at all times. If found, please return to the college.</p>
                </div>
              </div>
              <div className="bg-gray-200 flex justify-center mt-2 w-full max-w-[180px] sm:max-w-[200px] p-1.5 sm:p-2 rounded-lg mx-auto">
                <svg className="w-full h-auto" viewBox="0 0 200 60" fill="black">
                  <rect x="0" y="0" width="4" height="60"/>
                  <rect x="8" y="0" width="2" height="60"/>
                  <rect x="14" y="0" width="6" height="60"/>
                  <rect x="24" y="0" width="2" height="60"/>
                  <rect x="30" y="0" width="4" height="60"/>
                  <rect x="38" y="0" width="2" height="60"/>
                  <rect x="44" y="0" width="6" height="60"/>
                  <rect x="54" y="0" width="4" height="60"/>
                  <rect x="62" y="0" width="2" height="60"/>
                  <rect x="68" y="0" width="6" height="60"/>
                  <rect x="78" y="0" width="2" height="60"/>
                  <rect x="84" y="0" width="4" height="60"/>
                  <rect x="92" y="0" width="6" height="60"/>
                  <rect x="102" y="0" width="2" height="60"/>
                  <rect x="108" y="0" width="4" height="60"/>
                  <rect x="116" y="0" width="2" height="60"/>
                  <rect x="122" y="0" width="6" height="60"/>
                  <rect x="132" y="0" width="4" height="60"/>
                  <rect x="140" y="0" width="2" height="60"/>
                  <rect x="146" y="0" width="6" height="60"/>
                  <rect x="156" y="0" width="2" height="60"/>
                  <rect x="162" y="0" width="4" height="60"/>
                  <rect x="170" y="0" width="6" height="60"/>
                  <rect x="180" y="0" width="2" height="60"/>
                  <rect x="186" y="0" width="4" height="60"/>
                  <rect x="194" y="0" width="6" height="60"/>
                </svg>
              </div>
              <p className="text-center text-[0.6rem] sm:text-[0.7rem] text-gray-200 mt-1">Library & Service Barcode</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-black text-xs sm:text-sm mt-3 sm:mt-4 flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12L8 4M8 4L4 8M8 4L12 8" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Click card to flip
        </p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 w-full max-w-[400px] shadow-xl mb-4 sm:mb-6 mx-4 sm:mx-0">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 m-0 mb-3 sm:mb-4">Access Privileges</h3>
        <div className="flex flex-col gap-2 sm:gap-3">
          {privileges.map((privilege, index) => (
            <div key={index} className="flex items-center gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#E0E7FF"/>
                <path d="M6 10L9 13L14 7" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs sm:text-sm text-gray-600">{privilege.text}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="bg-transparent border-none text-red-500 text-xs sm:text-sm cursor-pointer flex items-center gap-2 p-2 hover:opacity-80 transition-opacity">
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="#EF4444" strokeWidth="1.5"/>
          <path d="M8 4V9M8 11V12" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Report Card Lost or Stolen
      </button>
    </div>
  );
};

export default Card;

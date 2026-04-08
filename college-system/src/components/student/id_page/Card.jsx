import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import { getDigitalIdFront, getDigitalIdBack } from '../../../services/idCard';
import './IDCard.css';

const Card = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontData, setFrontData] = useState(null);
  const [backData, setBackData] = useState(null);

  useEffect(() => {
    const fetchIdData = async () => {
      try {
        const [frontRes, backRes] = await Promise.all([
          getDigitalIdFront(),
          getDigitalIdBack()
        ]);
        setFrontData(frontRes);
        setBackData(backRes);
      } catch (error) {
        console.error('Error fetching digital ID data:', error);
      }
    };
    fetchIdData();
  }, []);

  const studentData = frontData ? {
    name: frontData.holder.full_name,
    id: frontData.holder.student_id,
    level: frontData.holder.level,
    department: frontData.holder.department,
    initials: (frontData.holder.full_name || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    issued: frontData.card_validity.issued_date,
    expiry: frontData.card_validity.expires_date,
    college: frontData.system_name,
    subtitle: frontData.identity_label
  } : {
    name: "Loading...",
    id: "Loading...",
    level: "Loading...",
    department: "Loading...",
    initials: "??",
    issued: "...",
    expiry: "...",
    college: "Loading...",
    subtitle: "..."
  };

  const getIcon = (text) => {
    if (text.includes("Library")) return "📚";
    if (text.includes("Lab")) return "🔬";
    if (text.includes("Gym") || text.includes("Sports")) return "💪";
    return "✔️";
  };
  const privileges = backData?.access_privileges?.map(text => ({ icon: getIcon(text), text })) || [];

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
                <div className="bg-white p-1.5 sm:p-2 rounded-lg w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] flex items-center justify-center flex-shrink-0">
                  {backData?.qr_code ? (
                    <QRCode
                      value={`Student ID: ${backData.qr_code.student_id}\nNational ID: ${backData.qr_code.national_id}`}
                      size={256}
                      style={{ height: "100%", width: "100%" }}
                      viewBox={`0 0 256 256`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.55rem] sm:text-[0.6rem] md:text-[0.65rem] text-gray-200 leading-relaxed m-0">This card is for the use of the person named and should be carried at all times. If found, please return to the college.</p>
                </div>
              </div>
              <div className="bg-white flex justify-center mt-2 w-full max-w-[220px] sm:max-w-[250px] p-2 rounded-lg mx-auto">
                {backData?.barcode ? (
                  <Barcode 
                    value={backData.barcode.access ? "ACCESS-GRANTED" : "ACCESS-DENIED"} 
                    height={40} 
                    displayValue={false} 
                    margin={0} 
                    background="transparent"
                  />
                ) : (
                   <div className="w-[180px] h-[40px] bg-gray-200"></div>
                )}
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
    </div>
  );
};

export default Card;

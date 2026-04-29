import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LoginCard from "../components/loginPage/LoginCard";
import loginImage from "../assets/images/fcds.webp";

const LoginPage = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Form Section */}
      <div 
        ref={containerRef}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center py-12 px-6 sm:px-12 relative z-10 bg-white"
      >
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </div>
      
      {/* Right Image/Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/20 to-transparent z-10"></div>
        <img
          ref={imageRef}
          src={loginImage}
          alt="College Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay Content */}
        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <div className="mb-8">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4 border border-white/30">
              Transforming Education
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Manage your academic <br/> journey in one place.
            </h2>
            <p className="text-lg text-indigo-100 max-w-lg leading-relaxed">
              Academia College brings students, professors, and administrators together in a seamless, modern digital environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

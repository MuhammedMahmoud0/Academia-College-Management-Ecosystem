import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu on link click
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div
      className={`header flex justify-between items-center px-4 md:px-6 py-4 fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-slate-900/90 backdrop-blur shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="logo flex items-center gap-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-10 md:h-10"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <div>
          <span className="text-xl md:text-2xl font-bold text-white">Academia</span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="navigation hidden lg:block">
        <nav>
          <ul className="flex gap-5 xl:gap-7 text-gray-400 text-sm xl:text-base">
            <li className="hover:text-white transition-colors duration-300">
              <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')}>About</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#admissions" onClick={(e) => handleSmoothScroll(e, '#admissions')}>Admissions</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#campus" onClick={(e) => handleSmoothScroll(e, '#campus')}>Campus</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#research" onClick={(e) => handleSmoothScroll(e, '#research')}>Research</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#careers" onClick={(e) => handleSmoothScroll(e, '#careers')}>Careers</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#news" onClick={(e) => handleSmoothScroll(e, '#news')}>News</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#doctors" onClick={(e) => handleSmoothScroll(e, '#doctors')}>Doctors</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#programs" onClick={(e) => handleSmoothScroll(e, '#programs')}>Programs</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#events" onClick={(e) => handleSmoothScroll(e, '#events')}>Events</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#faq" onClick={(e) => handleSmoothScroll(e, '#faq')}>FAQ</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Desktop Login Button */}
      <div className="login hidden lg:block">
        <Link to="/login">
          <button className="cursor-pointer px-4 py-2 bg-[#4f46e5] text-white hover:bg-[#4338ca]" style={{ borderRadius: "8px"}}>Login</button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden text-white p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed top-[72px] left-0 w-full bg-slate-900/95 backdrop-blur transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <nav className="px-4 py-6">
          <ul className="flex flex-col gap-4 text-gray-400">
            <li className="hover:text-white transition-colors duration-300">
              <a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="block py-2">About</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#admissions" onClick={(e) => handleSmoothScroll(e, '#admissions')} className="block py-2">Admissions</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#campus" onClick={(e) => handleSmoothScroll(e, '#campus')} className="block py-2">Campus</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#research" onClick={(e) => handleSmoothScroll(e, '#research')} className="block py-2">Research</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#careers" onClick={(e) => handleSmoothScroll(e, '#careers')} className="block py-2">Careers</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#news" onClick={(e) => handleSmoothScroll(e, '#news')} className="block py-2">News</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#doctors" onClick={(e) => handleSmoothScroll(e, '#doctors')} className="block py-2">Doctors</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#programs" onClick={(e) => handleSmoothScroll(e, '#programs')} className="block py-2">Programs</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#events" onClick={(e) => handleSmoothScroll(e, '#events')} className="block py-2">Events</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#faq" onClick={(e) => handleSmoothScroll(e, '#faq')} className="block py-2">FAQ</a>
            </li>
            <li className="hover:text-white transition-colors duration-300">
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, '#contact')} className="block py-2">Contact</a>
            </li>
            <li className="mt-4">
              <Link to="/login">
                <button className="w-full cursor-pointer px-4 py-2 bg-[#4f46e5] text-white hover:bg-[#4338ca]" style={{ borderRadius: "8px"}}>Login</button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

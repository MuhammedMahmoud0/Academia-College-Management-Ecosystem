import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`header flex justify-between items-center p-4 fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-slate-900/90 backdrop-blur shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="logo flex items-center gap-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <div>
          <span className="text-2xl font-bold text-white">Academia</span>
        </div>
      </div>
      <div className="navigation">
        <nav>
          <ul className="flex gap-7 text-gray-400 ">
            <li className="hover:text-white">
              <a href="#">About</a>
            </li>
            <li className="hover:text-white">
              <a href="#">Admissions</a>
            </li>
            <li className="hover:text-white">
              <a href="#">Campus Life</a>
            </li>
            <li className="hover:text-white">
              <a href="#">Research</a>
            </li>
            <li className="hover:text-white">
              <a href="#">Careers</a>
            </li>
            <li className="hover:text-white">
              <a href="#">Events</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="login">
        <button className="cursor-pointer px-4 py-2 bg-[#4f46e5] text-white hover:bg-[#4338ca]" style={{ borderRadius: "8px"}}>Login</button>
      </div>
    </div>
  );
}

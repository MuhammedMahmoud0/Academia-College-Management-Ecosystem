import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(".gsap-logo", 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.5 }
    )
    .fromTo(".gsap-title",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      "-=0.1"
    )
    .fromTo(".gsap-subtitle",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      "-=0.1"
    )
    .fromTo(".gsap-card",
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4 },
      "-=0.1"
    )
    .fromTo(".gsap-email",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      "-=0.2"
    )
    .fromTo(".gsap-password",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      "-=0.1"
    )
    .fromTo(".gsap-button",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
      "-=0.1"
    )
    .fromTo(".gsap-back",
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    );
  }, { scope: containerRef });

  const getHomeRoute = (role) => {
    const routes = {
      student:            '/dashboard/info',
      doctor:             '/dashboard/doctor',
      teaching_assistant: '/dashboard/doctor',
      admin:              '/dashboard/admin',
      super_admin:        '/dashboard/admin',
    };
    return routes[role] || '/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const data = await login(email, password);
      // fetchedUser is set by AuthContext.login() after calling /auth/me
      const role = data?.fetchedUser?.role;
      navigate(getHomeRoute(role));
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
      console.error("Login failed:", error);
      gsap.fromTo(".gsap-error", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto" ref={containerRef}>
      {/* Header - Outside Card */}
      <div className="text-center mb-8 px-4 sm:px-0">
        <div
          className="flex items-center justify-center gap-3 mb-4 gsap-logo"
        >
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Academia
          </h1>
        </div>
        <h2
          className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 gsap-title"
        >
          Welcome Back
        </h2>
        <p
          className="text-sm sm:text-base text-gray-500 gsap-subtitle font-medium"
        >
          Sign in to access your dashboard
        </p>
      </div>

      {/* Card Container */}
      <div
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100 p-8 sm:p-10 mx-4 sm:mx-0 gsap-card"
      >
        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2 gsap-error backdrop-blur-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="gsap-email">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="gsap-password">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98] mt-6 text-base disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 gsap-button flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : "Sign In"}
          </button>
        </form>
      </div>

      {/* Back to Home Link */}
      <div
        className="text-center mt-8 px-4 sm:px-0 gsap-back"
      >
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all text-sm group"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default LoginCard;

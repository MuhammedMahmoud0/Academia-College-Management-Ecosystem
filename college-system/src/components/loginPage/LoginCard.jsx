import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuth();

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
    
    try {
      const data = await login(email, password);
      // fetchedUser is set by AuthContext.login() after calling /auth/me
      const role = data?.fetchedUser?.role;
      navigate(getHomeRoute(role));
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header - Outside Card */}
      <div className="text-center mb-4 sm:mb-6 px-4 sm:px-0">
        <motion.div
          className="flex items-center justify-center gap-2 mb-2 sm:mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5B4EE5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:w-7 sm:h-7"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Academia College
          </h1>
        </motion.div>
        <motion.h2
          className="text-base sm:text-lg font-semibold text-gray-700 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome Back!
        </motion.h2>
        <motion.p
          className="text-xs sm:text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Sign in to continue to your account.
        </motion.p>
      </div>

      {/* Card Container */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mx-4 sm:mx-0"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              required
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-4 sm:mt-6 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.99 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
      </motion.div>

      {/* Back to Home Link */}
      <motion.div
        className="text-center mt-4 sm:mt-6 px-4 sm:px-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default LoginCard;

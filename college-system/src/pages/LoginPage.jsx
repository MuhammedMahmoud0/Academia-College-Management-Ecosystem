import { motion } from "motion/react";
import LoginCard from "../components/loginPage/LoginCard";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <LoginCard />
      </motion.div>
    </div>
  );
};

export default LoginPage;

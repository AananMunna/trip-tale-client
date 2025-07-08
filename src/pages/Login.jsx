import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../context/AuthProvider";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    login(email, password)
      .then(() => {
        Swal.fire("Welcome!", "You’re logged in.", "success");
        navigate("/assignments");
      })
      .catch((err) => {
        Swal.fire("Login failed", err.message, "error");
      });
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      Swal.fire("Google Login Success", "", "success");
      navigate("/assignments");
    } catch (error) {
      Swal.fire("Google login failed", error.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-300 to-gray-100 dark:from-[#0f0f0f] dark:via-[#1a1a1a] dark:to-[#0f0f0f] transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[90%] max-w-md rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-lg p-8 shadow-lg border border-white/20 dark:border-white/10"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white mb-6 tracking-tight">
          Sign in with your StudySync ID
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700 dark:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-black/80 dark:bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-black transition-colors dark:hover:bg-white/20"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 dark:border-gray-700 py-3 rounded-xl text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            Sign in with Google
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link to="/register" className="underline hover:text-blue-600">
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;

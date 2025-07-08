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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-cyan-500 dark:from-emerald-900 dark:to-cyan-900 transition-colors duration-700">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-[90%] max-w-md bg-white/10 dark:bg-gray-900/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-emerald-400/30 dark:border-cyan-400/40"
      >
        <h2 className="text-center text-3xl font-extrabold text-white mb-8 tracking-wide drop-shadow-md">
          🔐 TripTale Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="w-full px-5 py-3 rounded-xl bg-white/20 dark:bg-gray-800/30 placeholder-gray-200 dark:placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              className="w-full px-5 py-3 rounded-xl bg-white/20 dark:bg-gray-800/30 placeholder-gray-200 dark:placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-white opacity-75 hover:opacity-100 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-cyan-400 hover:to-emerald-400 rounded-xl text-gray-900 font-semibold shadow-lg shadow-cyan-500/40 transition"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-cyan-300 text-white rounded-xl hover:bg-cyan-600 transition"
          >
            Sign in with Google
          </button>

          <p className="text-center text-sm text-white/80 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="underline hover:text-cyan-200">
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;

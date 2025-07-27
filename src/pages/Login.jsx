import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { saveUserToDB } from "../utils/saveUserToDB";
import axios from "axios";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    login(email, password)
      .then((result) => {
        const user = result.user;

        saveUserToDB(user);

        axiosSecure
          .post("/jwt", { email: user.email, role: user.role })
          .then((res) => {
            localStorage.setItem("token", res.data.token);
            // redirect user to dashboard or wherever
          });

        Swal.fire("Welcome!", "You’re logged in.", "success");
        navigate("/all-trips");
      })
      .catch((err) => {
        Swal.fire("Login failed", err.message, "error");
      });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin(); // your firebase google login function
      const user = result.user;

      // Save or update user in MongoDB
      await saveUserToDB(user);

      axiosSecure.post("/jwt", { email: user.email, role: user.role }).then((res) => {
        localStorage.setItem("token", res.data.token);
        // redirect user to dashboard or wherever
      });

      Swal.fire("Google Login Success", "", "success");
      navigate("/all-trips");
    } catch (error) {
      Swal.fire("Google login failed", error.message, "error");
    }
  };

  return (
 <div className="min-h-screen py-28 flex items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-700">
      {/* Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-[90%] max-w-md bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-center text-3xl font-extrabold text-neutral-800 dark:text-white mb-8 tracking-wide">
          ✨ Welcome to <span className="text-cyan-600">TripTale</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            className="w-full px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-700 placeholder-gray-500 dark:placeholder-gray-400 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              className="w-full px-5 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-700 placeholder-gray-500 dark:placeholder-gray-400 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-600 dark:text-white opacity-75 hover:opacity-100 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            Continue
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-white rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
          >
            Sign in with Google
          </motion.button>

          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="underline hover:text-cyan-600 dark:hover:text-cyan-400">
              Register
            </Link>
          </p>
          <p className="text-sm mt-2 text-center">
  <Link to="/forgot-password" className="text-blue-500 hover:underline">
    Forgot your password?
  </Link>
</p>

        </form>
      </motion.div>
    </div>
  );
};

export default Login;

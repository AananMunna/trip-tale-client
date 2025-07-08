import { useContext, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

const Register = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, googleLogin } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const photoURL = form.photoURL.value.trim();
    const password = form.password.value;

    setError("");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, including 1 uppercase, 1 lowercase, and 1 special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await register(email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL || undefined,
      });

      Swal.fire({
        title: "Welcome aboard!",
        text: `Hello, ${name}! Your account was successfully created.`,
        icon: "success",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: 'rgba(20, 20, 20, 0.95)',
        color: 'white'
      });

      navigate("/assignments");
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error.message,
        background: 'rgba(20, 20, 20, 0.95)',
        color: 'white'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await googleLogin();
      Swal.fire({
        title: "Google login successful!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: 'rgba(20, 20, 20, 0.95)',
        color: 'white'
      });
      navigate("/assignments");
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Google login failed",
        text: error.message,
        background: 'rgba(20, 20, 20, 0.95)',
        color: 'white'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join StudySync to organize your learning journey</p>
        </div>

        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-lg dark:backdrop-blur-lg rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg dark:shadow-xl">
          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6" noValidate>
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm text-gray-600 dark:text-gray-400 block">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Appleseed"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800/70 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-gray-600 dark:text-gray-400 block">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800/70 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="photoURL" className="text-sm text-gray-600 dark:text-gray-400 block">
                Profile Photo URL <span className="text-gray-500 dark:text-gray-500">(optional)</span>
              </label>
              <input
                id="photoURL"
                name="photoURL"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800/70 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-400 block">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$"
                  title="At least 8 characters, including 1 uppercase, 1 lowercase, and 1 special character"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800/70 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9a8.96 8.96 0 011.1-4.475m3.9-2.4A9.96 9.96 0 0112 5c5 0 9 4 9 9a8.96 8.96 0 01-1.1 4.475m-3.9 2.4L3 3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Must contain 8+ chars with uppercase, lowercase, and special character
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium transition flex items-center justify-center ${isLoading ? 'opacity-80' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-800"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-800"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-800/50 transition flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.35 11.1H12v2.8h5.25a4.5 4.5 0 01-4.35 3 4.74 4.74 0 01-4.75-4.75 4.75 4.75 0 014.75-4.75c1.3 0 2.35.48 3.2 1.26l2.24-2.24a7.92 7.92 0 00-5.44-2.26A7.88 7.88 0 004 12a7.87 7.87 0 007.88 7.88 8.03 8.03 0 007.54-5.5z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
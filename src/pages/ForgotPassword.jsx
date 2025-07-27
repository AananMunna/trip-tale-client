// ForgotPassword.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from './../firebase.config';
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const location = useLocation();
  const prefillEmail = location.state?.email || "";
  const [email, setEmail] = useState(prefillEmail);

  useEffect(() => {
    if (prefillEmail) {
      toast("We've pre-filled your email", { icon: "📧" });
    }
  }, [prefillEmail]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent! Check your inbox ✉️");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef8f3] to-[#f3f7ff] dark:from-[#0f172a] dark:to-[#1e293b] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-xl border border-[#f0f0f0] dark:border-[#334155]">
        <h2 className="text-3xl font-extrabold text-[#1e293b] dark:text-white text-center mb-6">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          No worries — we’ll help you reset it and get back to your journey 🌍
        </p>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0f172a] text-black dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894] transition"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#00b894] hover:bg-[#019875] text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Send Reset Link
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Remembered your password?{" "}
            <a
              href="/login"
              className="text-[#00b894] font-medium hover:underline"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

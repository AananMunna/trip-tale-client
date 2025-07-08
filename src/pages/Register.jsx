import { useContext, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

const IMGBB_API_KEY = "42a5137615ebf1a1e99a7d7cf8447e7d"; // <-- Replace with your actual imgbb API key

const Register = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);

  console.log(uploadedImageURL);

  const navigate = useNavigate();
  const { register, googleLogin } = useContext(AuthContext);

  // Upload image to imgbb
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setUploadedImageURL(data.data.url);
        Swal.fire({
          icon: "success",
          title: "Image uploaded!",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
          background: "rgba(20, 20, 20, 0.95)",
          color: "white",
        });
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      setError("Failed to upload image. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    // Password regex: at least 8 chars, uppercase, lowercase, special char
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
        photoURL: uploadedImageURL || undefined,
      });

      Swal.fire({
        title: "Welcome aboard!",
        text: `Hello, ${name}! Your account was successfully created.`,
        icon: "success",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "rgba(20, 20, 20, 0.95)",
        color: "white",
      });

      navigate("/assignments");
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error.message,
        background: "rgba(20, 20, 20, 0.95)",
        color: "white",
      });
    } finally {
      setIsLoading(false);
    }

    console.log({name,email,password,uploadedImageURL});
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
        background: "rgba(20, 20, 20, 0.95)",
        color: "white",
      });
      navigate("/assignments");
    } catch (error) {
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Google login failed",
        text: error.message,
        background: "rgba(20, 20, 20, 0.95)",
        color: "white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-emerald-600 to-cyan-500 dark:from-emerald-900 dark:to-cyan-900 flex items-center justify-center p-4 transition-colors duration-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 dark:bg-gray-900/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-emerald-400/30 dark:border-cyan-400/40"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
            Create Account
          </h1>
          <p className="text-white/80">
            Join TripTale and start your travel adventure journey
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-600/40 rounded-lg text-red-100 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6" noValidate>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm text-white/80 block">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Appleseed"
              className="w-full px-4 py-3 bg-white/20 dark:bg-gray-800/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-white/80 block">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-white/20 dark:bg-gray-800/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="photo" className="text-sm text-white/80 block">
              Upload Profile Photo{" "}
              <span className="text-xs text-white/50">(optional)</span>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-white"
              disabled={uploading}
            />
            {uploading && (
              <p className="text-xs text-cyan-200 mt-1">Uploading image...</p>
            )}
            {uploadedImageURL && (
              <img
                src={uploadedImageURL}
                alt="Uploaded profile"
                className="mt-2 w-24 h-24 rounded-full object-cover mx-auto border-2 border-cyan-400 shadow-lg"
              />
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-white/80 block">
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
                className="w-full px-4 py-3 bg-white/20 dark:bg-gray-800/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-white opacity-70 hover:opacity-100 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9a8.96 8.96 0 011.1-4.475m3.9-2.4A9.96 9.96 0 0112 5c5 0 9 4 9 9a8.96 8.96 0 01-1.1 4.475m-3.9 2.4L3 3"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Must contain 8+ chars with uppercase, lowercase, and special character
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || uploading}
            className={`w-full py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-cyan-400 hover:to-emerald-400 text-gray-900 font-semibold shadow-lg shadow-cyan-500/40 transition flex items-center justify-center ${
              isLoading || uploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-white/30"></div>
          <span className="flex-shrink mx-4 text-white/80 text-sm">OR</span>
          <div className="flex-grow border-t border-white/30"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading || uploading}
          className="w-full py-3 rounded-lg border border-white/70 text-white font-semibold hover:bg-white/20 transition flex items-center justify-center"
        >
          <svg
            className="h-5 w-5 mr-2"
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21.35 11.1H12v2.8h5.25a4.5 4.5 0 01-4.35 3 4.74 4.74 0 01-4.75-4.75 4.75 4.75 0 014.75-4.75c1.3 0 2.35.48 3.2 1.26l2.24-2.24a7.92 7.92 0 00-5.44-2.26A7.88 7.88 0 004 12a7.87 7.87 0 007.88 7.88 8.03 8.03 0 007.54-5.5z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center text-white/80 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="underline hover:text-cyan-300 transition"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

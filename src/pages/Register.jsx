import { useContext, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";
import { saveUserToDB } from "../utils/saveUserToDB";
import axios from "axios";
import useAxiosSecure from "../hooks/useAxiosSecure";

const IMGBB_API_KEY = "42a5137615ebf1a1e99a7d7cf8447e7d"; // <-- Replace with your actual imgbb API key

const Register = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageURL, setUploadedImageURL] = useState(null);

  // console.log(uploadedImageURL);
    const axiosSecure = useAxiosSecure();


  const navigate = useNavigate();
  const { register, googleLogin } = useContext(AuthContext);

// Upload image to Cloudinary
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  setError("");

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      setUploadedImageURL(data.secure_url);
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
    console.error(err);
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
      const user = userCredential.user;

  console.log(user);

  await updateProfile(userCredential.user, {
    displayName: name,
    photoURL: uploadedImageURL || undefined,
  });

  // Save to MongoDB with role
  const newUser = {
    email,
    name,
    role: "user", // default role or based on user selection
    photoURL: uploadedImageURL,
  };

      // ✅ Save to MongoDB
    await saveUserToDB(user);
    console.log(user);

  // ✅ Now get JWT
  axiosSecure.post("/jwt", { email: newUser.email, role: newUser.role }).then((res) => {
    localStorage.setItem("token", res.data.token);
    // redirect
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

  navigate("/all-trips");
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

  console.log({ name, email, password, uploadedImageURL });
};


const handleGoogleLogin = async () => {
  setIsLoading(true);
  try {
    const result = await googleLogin();
    const user = result.user;

    // ✅ Save to MongoDB
    await saveUserToDB(user);
    console.log(user);

    axiosSecure.post("/jwt", { email: user.email, role: user.role }).then((res) => {
  localStorage.setItem("token", res.data.token);
  // redirect user to dashboard or wherever
});


    Swal.fire({
      title: "Google login successful!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
      background: "rgba(20, 20, 20, 0.95)",
      color: "white",
    });

    navigate("/all-trips");
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
<div className="min-h-screen bg-white dark:bg-neutral-900 py-20 flex items-center justify-center px-4 transition-colors duration-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl border border-neutral-200 dark:border-neutral-700"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-neutral-800 dark:text-white mb-2 tracking-wide">
            Create Account
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Join TripTale and start your journey
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-600/30 rounded-lg text-red-700 dark:text-red-100 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6" noValidate>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm text-neutral-700 dark:text-white/80 block">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Appleseed"
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-neutral-700 dark:text-white/80 block">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
          </div>

         <div className="space-y-1">
  <label
    htmlFor="photo"
    className="text-sm text-neutral-700 dark:text-white/80 block"
  >
    Profile Photo{" "}
    <span className="text-xs text-neutral-400 dark:text-white/50">(optional)</span>
  </label>

  <div className="relative w-full">
    <label
      htmlFor="photo"
      className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer 
        transition bg-neutral-50 dark:bg-neutral-800 hover:border-cyan-500
        ${uploadedImageURL ? "border-cyan-400" : "border-neutral-300 dark:border-neutral-600"}`}
    >
      {uploadedImageURL ? (
        <img
          src={uploadedImageURL}
          alt="Uploaded profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-cyan-400 shadow"
        />
      ) : (
        <>
          <svg
            className="w-10 h-10 text-neutral-400 dark:text-white/60 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m5 8v-4a4 4 0 00-4-4H5"
            />
          </svg>
          <p className="text-sm text-neutral-600 dark:text-white/70">Click to upload</p>
        </>
      )}
      <input
        id="photo"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={uploading}
      />
    </label>
  </div>

  {uploading && (
    <p className="text-xs text-cyan-600 dark:text-cyan-300 mt-1">Uploading image...</p>
  )}
</div>


          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-neutral-700 dark:text-white/80 block">
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
                className="w-full px-4 py-3 pr-10 bg-neutral-100 dark:bg-neutral-700 rounded-lg text-neutral-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-neutral-600 dark:text-white opacity-70 hover:opacity-100 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9a8.96 8.96 0 011.1-4.475m3.9-2.4A9.96 9.96 0 0112 5c5 0 9 4 
                      9 9a8.96 8.96 0 01-1.1 4.475m-3.9 2.4L3 3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 
                      8.268 2.943 9.542 7-1.274 4.057-5.065 
                      7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Must be 8+ chars, include uppercase, lowercase & special character
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || uploading}
            className={`w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md transition flex items-center justify-center ${
              isLoading || uploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-neutral-300 dark:border-neutral-600"></div>
          <span className="flex-shrink mx-4 text-sm text-neutral-600 dark:text-neutral-400">OR</span>
          <div className="flex-grow border-t border-neutral-300 dark:border-neutral-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading || uploading}
          className="w-full py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-white font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition flex items-center justify-center"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.35 11.1H12v2.8h5.25a4.5 4.5 0 01-4.35 3 4.74 4.74 0 01-4.75-4.75 
            4.75 4.75 0 014.75-4.75c1.3 0 2.35.48 3.2 1.26l2.24-2.24a7.92 7.92 
            0 00-5.44-2.26A7.88 7.88 0 004 12a7.87 7.87 0 007.88 7.88 
            8.03 8.03 0 007.54-5.5z" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <Link to="/login" className="underline hover:text-cyan-600 dark:hover:text-cyan-400">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

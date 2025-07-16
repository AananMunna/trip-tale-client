import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";
// import { AuthContext } from "./../../context/AuthProvider";

const AddStory = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewURLs(previews);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      Swal.fire("Oops!", "Please select at least one image.", "warning");
      return;
    }

    setUploading(true);

    try {
      const uploadedURLs = [];
      for (const img of images) {
        const url = await uploadToCloudinary(img);
        uploadedURLs.push(url);
      }

      const storyData = {
        title,
        text,
        images: uploadedURLs,
        userEmail: user?.email,
        userName: user?.displayName || "Anonymous Explorer"
,
        userPhoto: user?.photoURL || "https://img.daisyui.com/images/profile/demo/averagebulk@192.webp"
,
        createdAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/stories", storyData);

      if (res.data?.insertedId) {
        Swal.fire("Success!", "Your story has been added.", "success");
        navigate("/dashboard/manage-stories");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Something went wrong. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewURLs];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewURLs(newPreviews);
  };

  return (
<section className="max-w-4xl w-full mx-auto mt-12 px-4 sm:px-6 lg:px-10 py-10 backdrop-blur-lg bg-white/20 dark:bg-black/30 border border-white/10 shadow-2xl rounded-2xl">
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-teal-500 to-cyan-500">
    ✨ Share Your Epic Adventure ✨
  </h2>

  <form onSubmit={handleSubmit} className="space-y-8">
    {/* Title */}
    <div className="relative">
      <label className="absolute -top-3 left-4 px-1 text-sm font-semibold text-emerald-600 dark:text-teal-400 bg-white dark:bg-black">
        Title
      </label>
      <input
        type="text"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. A Journey Through the Hills of Bandarban"
        className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white/50 dark:bg-black/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>

    {/* Story */}
    <div className="relative">
      <label className="absolute -top-3 left-4 px-1 text-sm font-semibold text-emerald-600 dark:text-teal-400 bg-white dark:bg-black">
        Your Story
      </label>
      <textarea
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Write something magical..."
        className="w-full px-4 py-3 rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white/50 dark:bg-black/30 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>

    {/* File Upload */}
    <div className="relative">
      <label className="block text-sm font-semibold text-emerald-600 dark:text-yellow-400 mb-2">
        Upload Photos <span className="text-xs text-gray-400">(Max 5)</span>
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="w-full file:mr-4 file:px-4 file:py-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
      />
    </div>

    {/* Image Preview */}
    {previewURLs.length > 0 && (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {previewURLs.map((url, idx) => (
          <div
            key={idx}
            className="relative group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <img
              src={url}
              alt={`preview-${idx}`}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    )}

    {/* Submit Button */}
    <div>
      <button
        type="submit"
        disabled={uploading}
        className="w-full relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 disabled:opacity-60"
      >
        <span className="absolute w-full h-full bg-white opacity-10 animate-pulse"></span>
        {uploading ? "Uploading..." : "🚀 Publish Story"}
      </button>
    </div>
  </form>
</section>


  );
};

export default AddStory;

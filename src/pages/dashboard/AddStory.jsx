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
    <section className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 dark:text-yellow-400">
        Share Your Adventure
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Where did you go?"
            className="w-full px-4 py-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Story
          </label>
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Describe your experience..."
            className="w-full px-4 py-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Upload Photos (Max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-sm text-gray-700 dark:text-white"
          />
        </div>

        {previewURLs.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {previewURLs.map((url, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-28 h-28 object-cover rounded-lg border shadow-md"
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

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded transition duration-300"
        >
          {uploading ? "Uploading..." : "Publish Story"}
        </button>
      </form>
    </section>
  );
};

export default AddStory;

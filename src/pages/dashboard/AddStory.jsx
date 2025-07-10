import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from './../../context/AuthProvider';

const AddStory = () => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Cloudinary credentials from .env
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Preview & store selected images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewURLs(previews);
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return data.secure_url; // Cloudinary returns secure URL directly
  };

  // Handle form submit
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

  // Remove image from preview & array
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewURLs];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewURLs(newPreviews);
  };

  return (
    <section className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600 dark:text-emerald-400">
        Add Your Travel Story
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Story
          </label>
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Upload Images (Max: 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full text-gray-800 dark:text-white"
          />
        </div>

        {/* Image Preview */}
        {previewURLs.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {previewURLs.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="w-28 h-28 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
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
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Submit Story"}
        </button>
      </form>
    </section>
  );
};

export default AddStory;

// ManageStories.jsx
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider";

const ManageStories = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [stories, setStories] = useState([]);
  const [editStory, setEditStory] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    axiosSecure
      .get(`/story?email=${user?.email}`)
      .then((res) => setStories(res.data))
      .catch((err) => console.error(err));
  }, [user?.email, axiosSecure]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the story.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/stories/${id}`);
        if (res.data?.deletedCount > 0) {
          setStories(stories.filter((story) => story._id !== id));
          Swal.fire("Deleted!", "Your story has been deleted.", "success");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete story.", "error");
      }
    }
  };

  const handleEditClick = (story) => {
    setEditStory(story);
    setEditTitle(story.title);
    setEditText(story.text);
    setEditImages(story.images);
    setNewImages([]);
  };

  const handleImageRemove = (index) => {
    setEditImages(editImages.filter((_, i) => i !== index));
  };

  const handleNewImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

const uploadToCloudinary = async (img) => {
  const formData = new FormData();
  formData.append("file", img);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  return res.data.secure_url;
};


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const newImageURLs = [];
      for (const img of newImages) {
        const url = await uploadToCloudinary(img);
        newImageURLs.push(url);
      }

      const removedImages = editStory.images.filter(
        (img) => !editImages.includes(img)
      );

     const res = await axiosSecure.put(`/stories/${editStory._id}`, {
  title: editTitle,
  text: editText,
  removedImages,
  newImageURLs,
  userName: user?.displayName,
  userPhoto: user?.photoURL,
});


      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Your story has been updated.", "success");
        setStories((prev) =>
          prev.map((s) =>
            s._id === editStory._id
              ? { ...s, title: editTitle, text: editText, images: [...editImages, ...newImageURLs] }
              : s
          )
        );
        setEditStory(null);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to update story.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">
        Manage Your Stories
      </h2>
      {stories.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No stories found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div
              key={story._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {story.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {story.text.slice(0, 100)}...
              </p>
              <div className="flex gap-2 overflow-x-auto mb-3">
                {story.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt=""
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleEditClick(story)}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(story._id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit Story</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Text</label>
                <textarea
                  rows={4}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Existing Images</label>
                <div className="flex flex-wrap gap-2">
                  {editImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} className="w-20 h-20 object-cover rounded border" />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(idx)}
                        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 dark:text-gray-300">Add New Images</label>
                <input
                  type="file"
                  multiple
                  onChange={handleNewImageChange}
                  className="text-gray-800 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditStory(null)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                >
                  {uploading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageStories;

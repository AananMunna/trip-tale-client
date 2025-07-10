// ManageStories.jsx
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";

const ManageStories = () => {
  const axiosSecure = useAxiosSecure();
  const [stories, setStories] = useState([]);
  const { user } = useContext(AuthContext);


  useEffect(() => {
    axiosSecure
      .get(`/stories?email=${user?.email}`)
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
                <Link
                  to={`/dashboard/edit-story/${story._id}`}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </Link>
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
    </section>
  );
};

export default ManageStories;

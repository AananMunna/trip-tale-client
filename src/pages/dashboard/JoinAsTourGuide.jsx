import { useContext, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../context/AuthProvider";

const JoinAsTourGuide = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [cvLink, setCvLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const applicationData = {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
      title,
      reason,
      cvLink,
      role: "tourist", // default role
    };

    try {
      const res = await axiosSecure.post("/guide-applications", applicationData);
      if (res.data?.insertedId) {
        Swal.fire({
          title: "Application Submitted!",
          text: "Your tour guide application has been submitted successfully.",
          icon: "success",
          confirmButtonColor: "#10b981",
        });

        // reset form
        setTitle("");
        setReason("");
        setCvLink("");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Oops!", "Something went wrong. Try again.", "error");
    }
  };

  return (
    <section className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600 dark:text-emerald-400">
        Join As a Tour Guide
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Application Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Why do you want to be a tour guide?</label>
          <textarea
            rows={5}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="w-full p-3 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">CV Link (Google Drive or PDF URL)</label>
          <input
            type="url"
            value={cvLink}
            onChange={(e) => setCvLink(e.target.value)}
            required
            className="w-full p-3 rounded border dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded"
        >
          Submit Application
        </button>
      </form>
    </section>
  );
};

export default JoinAsTourGuide;

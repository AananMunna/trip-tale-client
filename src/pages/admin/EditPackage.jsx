// Enhanced EditPackage.jsx without react-hook-form
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion } from "framer-motion";

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tourType: "",
    duration: "",
    price: "",
    tourPlan: [""],
    images: []
  });
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  useEffect(() => {
    axiosSecure.get(`/packages/${id}`).then((res) => {
      setInitialData(res.data);
      setFormData({
        title: res.data.title || "",
        description: res.data.description || "",
        tourType: res.data.tourType || "",
        duration: res.data.duration || "",
        price: res.data.price || "",
        tourPlan: res.data.tourPlan || [""],
        images: []
      });
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTourPlanChange = (index, value) => {
    const updatedPlan = [...formData.tourPlan];
    updatedPlan[index] = value;
    setFormData({ ...formData, tourPlan: updatedPlan });
  };

  const addTourPlan = () => {
    setFormData({ ...formData, tourPlan: [...formData.tourPlan, ""] });
  };

  const removeTourPlan = (index) => {
    const updatedPlan = [...formData.tourPlan];
    updatedPlan.splice(index, 1);
    setFormData({ ...formData, tourPlan: updatedPlan });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    const response = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const uploadedImages = [];
      if (formData.images?.length > 0) {
        for (const file of formData.images) {
          const url = await uploadImage(file);
          uploadedImages.push(url);
        }
      }
      const payload = {
        ...formData,
        images: uploadedImages.length > 0 ? uploadedImages : initialData.images,
        price: Number(formData.price),
      };
      await axiosSecure.put(`/packages/${id}`, payload);
      Swal.fire("Success!", "Package updated successfully.", "success");
      navigate("/dashboard/all-packages");
    } catch (err) {
      Swal.fire("Error!", "Failed to update package.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the package.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/packages/${id}`);
        Swal.fire("Deleted!", "Package has been deleted.", "success");
        navigate("/dashboard/all-packages");
      } catch (err) {
        Swal.fire("Error", "Failed to delete package.", "error");
      }
    }
  };

  if (!initialData) return <div className="text-center py-20 text-lg">Loading Package Data...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 md:p-10 bg-white dark:bg-gray-900 rounded-xl shadow-md"
    >
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-emerald-400">✏️ Edit Package</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Package Title"
          className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          rows={4}
          className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
        />
        <input
          name="tourType"
          value={formData.tourType}
          onChange={handleInputChange}
          placeholder="Tour Type"
          className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
        />
        <input
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          placeholder="Duration"
          className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="w-full px-4 py-3 rounded-lg border dark:bg-gray-800 dark:text-white"
        />

        {initialData.images?.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {initialData.images.map((img, i) => (
              <img key={i} src={img} alt={`old-${i}`} className="w-24 h-24 object-cover rounded-md border" />
            ))}
          </div>
        )}

        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="file-input w-full" />

        <div>
          <label className="block font-semibold mb-2 dark:text-white">Tour Plan (Day-wise)</label>
          {formData.tourPlan.map((plan, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                value={plan}
                onChange={(e) => handleTourPlanChange(index, e.target.value)}
                placeholder={`Day ${index + 1}`}
                className="flex-grow px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
              />
              <button type="button" onClick={() => removeTourPlan(index)} className="text-red-600 text-xl">&times;</button>
            </div>
          ))}
          <button type="button" onClick={addTourPlan} className="text-emerald-600 mt-2 hover:underline">
            + Add Day
          </button>
        </div>

        <div className="flex justify-between pt-6">
          <button type="submit" disabled={uploading} className="px-6 py-3 rounded-md text-white font-semibold bg-emerald-600 hover:bg-emerald-700">
            {uploading ? "Updating..." : "Update Package"}
          </button>
          <button type="button" onClick={handleDelete} className="px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold">
            Delete Package
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditPackage;

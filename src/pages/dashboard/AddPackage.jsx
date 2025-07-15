import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";

const AddPackage = () => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      images: [{ file: null }],
      tourPlan: [{ detail: "" }],
    },
  });

  const axiosSecure = useAxiosSecure();
  const [uploading, setUploading] = useState(false);

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const { fields: tourPlanFields, append: appendPlan, remove: removePlan } = useFieldArray({
    control,
    name: "tourPlan",
  });

  const uploadImage = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Image upload failed");
    const data = await response.json();
    return data.secure_url;
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      // Upload images one by one
      const uploadedImages = [];
      for (const item of data.images) {
        if (item.file && item.file[0]) {
          const url = await uploadImage(item.file[0]);
          if (!url) throw new Error("Gallery image upload failed");
          uploadedImages.push(url);
        }
      }

      // Extract tourPlan strings
      const tourPlanDetails = data.tourPlan.map((plan) => plan.detail);

      const payload = {
        title: data.title,
        images: uploadedImages,
        description: data.description,
        tourType: data.tourType,
        duration: data.duration,
        price: Number(data.price),
        tourPlan: tourPlanDetails,
      };

      await axiosSecure.post("/packages", payload);
      Swal.fire("Success!", "Package added successfully.", "success");
      reset();
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", error.message || "Failed to add package.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
 <motion.div
      className="max-w-3xl w-full mx-auto p-6 md:p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-emerald-400">
        🗺️ Add New Tour Package
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10"
        encType="multipart/form-data"
      >
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Package Title"
            {...register("title", { required: "Title is required" })}
            className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <textarea
            rows={4}
            placeholder="Description"
            {...register("description", { required: "Description is required" })}
            className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* Tour Type */}
        <div>
          <input
            type="text"
            placeholder="Tour Type"
            {...register("tourType", { required: "Tour type is required" })}
            className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
          />
          {errors.tourType && <p className="text-red-500 text-sm mt-1">{errors.tourType.message}</p>}
        </div>

        {/* Duration */}
        <div>
          <input
            type="text"
            placeholder="3 Days 2 Nights"
            {...register("duration", { required: "Duration is required" })}
            className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
          />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
        </div>

        {/* Price */}
        <div>
          <input
            type="number"
            placeholder="Price in BDT"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 1, message: "Price must be greater than 0" },
            })}
            className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        {/* Images */}
        <div>
          <p className="text-sm text-gray-700 dark:text-white mb-2 font-medium">Upload Images</p>
          {imageFields.map((field, index) => (
            <div key={field.id} className="flex gap-3 mb-2 items-center">
              <input
                {...register(`images.${index}.file`)}
                type="file"
                accept="image/*"
                className="text-sm text-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="text-red-500 text-lg"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendImage({ file: null })}
            className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            + Add Image
          </button>
        </div>

        {/* Tour Plan */}
        <div>
          <p className="text-sm text-gray-700 dark:text-white mb-2 font-medium">Tour Plan (Day-wise)</p>
          {tourPlanFields.map((field, index) => (
            <div key={field.id} className="flex gap-3 mb-2 items-center">
              <input
                type="text"
                placeholder={`Day ${index + 1}: Description`}
                {...register(`tourPlan.${index}.detail`, {
                  required: "Tour plan detail is required",
                })}
                className="flex-grow border-b bg-transparent py-2 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removePlan(index)}
                className="text-red-500 text-lg"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendPlan({ detail: "" })}
            className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            + Add Day
          </button>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300
              ${isSubmitting || uploading
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            {uploading ? "Uploading..." : isSubmitting ? "Submitting..." : "✅ Add Package"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Floating label input component
const FloatingInput = ({ label, register, error, placeholder, required, type = "text" }) => (
  <div className="relative z-0 w-full group">
    <input
      type={type}
      placeholder=" "
      {...register}
      required={required}
      className={`block py-3 px-4 w-full text-gray-900 bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-lg appearance-none focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:border-emerald-400 dark:text-gray-100
        ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
      `}
      autoComplete="off"
    />
    <label
      className={`absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-md duration-300 transform -translate-y-3 scale-90 origin-[0] bg-white dark:bg-gray-900 px-1 pointer-events-none
        group-focus-within:-translate-y-3 group-focus-within:scale-90 group-focus-within:text-emerald-500
        ${error ? "text-red-500" : ""}
      `}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

// Floating label textarea component
const FloatingTextarea = ({ label, register, error, placeholder, rows = 4, required }) => (
  <div className="relative z-0 w-full group">
    <textarea
      placeholder=" "
      rows={rows}
      {...register}
      required={required}
      className={`block py-3 px-4 w-full text-gray-900 bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-lg resize-none appearance-none focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:border-emerald-400 dark:text-gray-100
        ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
      `}
      autoComplete="off"
    />
    <label
      className={`absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-md duration-300 transform -translate-y-3 scale-90 origin-[0] bg-white dark:bg-gray-900 px-1 pointer-events-none
        group-focus-within:-translate-y-3 group-focus-within:scale-90 group-focus-within:text-emerald-500
        ${error ? "text-red-500" : ""}
      `}
    >
      {label} <span className="text-red-500">*</span>
    </label>
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

// Section wrapper with title & padding
const SectionCard = ({ title, children }) => (
  <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700">
    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-emerald-400">{title}</h3>
    {children}
  </div>
);

export default AddPackage;

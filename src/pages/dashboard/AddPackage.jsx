import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";

const AddPackage = () => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
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

      // Upload all images
      const uploadedImages = [];
      for (const item of data.images) {
        if (item.file && item.file[0]) {
          const url = await uploadImage(item.file[0]);
          if (!url) throw new Error("Gallery image upload failed");
          uploadedImages.push(url);
        }
      }

      // Extract tourPlan details array (string array)
      const tourPlanDetails = data.tourPlan.map(plan => plan.detail);

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
      className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 dark:text-yellow-400">
        🗺️ Add New Tour Package
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" encType="multipart/form-data">

        {/* Title */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Package Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Tea Garden Tour in Sylhet"
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
          />
          {errors.title && <p className="text-red-500 mt-1 text-sm">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Escape into the emerald green hills..."
            rows={4}
            className="w-full rounded-md border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
          />
          {errors.description && <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>}
        </div>

        {/* Tour Type */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Tour Type <span className="text-red-500">*</span>
          </label>
          <input
            {...register("tourType", { required: "Tour type is required" })}
            placeholder="Nature"
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
          />
          {errors.tourType && <p className="text-red-500 mt-1 text-sm">{errors.tourType.message}</p>}
        </div>

        {/* Duration */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Duration <span className="text-red-500">*</span>
          </label>
          <input
            {...register("duration", { required: "Duration is required" })}
            placeholder="3 Days 2 Nights"
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
          />
          {errors.duration && <p className="text-red-500 mt-1 text-sm">{errors.duration.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
            Price (in BDT) <span className="text-red-500">*</span>
          </label>
          <input
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 1, message: "Price must be greater than 0" },
            })}
            type="number"
            placeholder="7200"
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
          />
          {errors.price && <p className="text-red-500 mt-1 text-sm">{errors.price.message}</p>}
        </div>

        {/* Images Upload */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 dark:text-gray-200">
            Images (Upload multiple)
          </label>
          {imageFields.map((field, index) => (
            <div key={field.id} className="flex gap-3 mb-3 items-center">
              <input
                {...register(`images.${index}.file`)}
                type="file"
                accept="image/*"
                className="flex-grow text-gray-700 dark:text-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="btn-error rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
                aria-label="Remove image"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendImage({ file: null })}
            className="btn-outline rounded-md px-5 py-2 border border-yellow-400 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition"
          >
            + Add Image
          </button>
        </div>

        {/* Tour Plan (just details strings) */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 dark:text-gray-200">
            Tour Plan (Day-wise details)
          </label>
          {tourPlanFields.map((field, index) => (
            <div key={field.id} className="flex gap-3 mb-3 items-center">
              <input
                {...register(`tourPlan.${index}.detail`, { required: "Tour plan detail is required" })}
                placeholder={`Day ${index + 1}: Description`}
                className="flex-grow rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 transition"
              />
              <button
                type="button"
                onClick={() => removePlan(index)}
                className="btn-error rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition"
                aria-label="Remove tour plan day"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendPlan({ detail: "" })}
            className="btn-outline rounded-md px-5 py-2 border border-yellow-400 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition"
          >
            + Add Day
          </button>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className={`btn-primary rounded-md px-10 py-3 font-semibold text-lg transition
              ${isSubmitting || uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"}`}
          >
            {uploading ? "Uploading..." : isSubmitting ? "Submitting..." : "✅ Add Package"}
          </button>
        </div>

      </form>
    </motion.div>
  );
};

export default AddPackage;

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
      images: null,
      tourPlan: [{ detail: "" }],
    },
  });

  const axiosSecure = useAxiosSecure();
  const [uploading, setUploading] = useState(false);

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
      const files = data.images;
      const uploadedImages = [];

      for (const file of files) {
        const url = await uploadImage(file);
        if (!url) throw new Error("Gallery image upload failed");
        uploadedImages.push(url);
      }

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
        📺 Add New Tour Package
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Title */}
        <input
          type="text"
          placeholder="Package Title"
          {...register("title", { required: "Title is required" })}
          className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}

        {/* Description */}
        <textarea
          rows={4}
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
          className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}

        {/* Tour Type */}
        <input
          type="text"
          placeholder="Tour Type"
          {...register("tourType", { required: "Tour type is required" })}
          className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
        />
        {errors.tourType && <p className="text-red-500 text-sm mt-1">{errors.tourType.message}</p>}

        {/* Duration */}
        <input
          type="text"
          placeholder="3 Days 2 Nights"
          {...register("duration", { required: "Duration is required" })}
          className="w-full border-b bg-transparent py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
        />
        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}

        {/* Price */}
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

        {/* Images */}
        <div>
          <p className="text-sm text-gray-700 dark:text-white mb-2 font-medium">Upload Images</p>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register("images", { required: "Please upload at least one image" })}
            className="text-sm text-gray-600 dark:text-white"
          />
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            Hold <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd> on Mac) to select multiple.
          </p>
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
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

export default AddPackage;

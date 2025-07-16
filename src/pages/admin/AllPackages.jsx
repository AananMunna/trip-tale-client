import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router";
import { Trash2, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllPackages = () => {
  const axiosSecure = useAxiosSecure();

  const { data: packages = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/packages/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted!", "The package has been deleted.", "success");
      refetch();
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete package.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-emerald-600 text-center sm:text-left">
    All Packages
  </h2>

  {isLoading ? (
    <p className="text-center text-gray-500 dark:text-gray-300">Loading packages...</p>
  ) : packages.length === 0 ? (
    <p className="text-center text-gray-500 dark:text-gray-300">No packages found.</p>
  ) : (
    <>
      {/* Mobile View Cards */}
      <div className="grid gap-6 sm:hidden">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              {pkg.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Price:</span> ৳{pkg.price}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Type:</span> {pkg.tourType}
            </p>
            <div className="flex gap-4 mt-4">
              <Link
                to={`/dashboard/edit-package/${pkg._id}`}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Edit"
              >
                <Pencil className="w-5 h-5" />
              </Link>
              <button
                onClick={() => handleDelete(pkg._id)}
                className="text-red-600 hover:text-red-800 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View Table */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {packages.map((pkg) => (
              <tr
                key={pkg._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{pkg.title}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">৳{pkg.price}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{pkg.tourType}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-4">
                    <Link
                      to={`/dashboard/edit-package/${pkg._id}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}
</div>


  );
};

export default AllPackages;

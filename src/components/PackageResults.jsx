import { Link } from "react-router";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const PackageResults = ({ packagesData, filters, handlePageChange, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <span className="loading loading-bars loading-lg text-emerald-500" />
          <p className="text-gray-500 mt-2">Loading trips...</p>
        </div>
      </div>
    );
  }

  if (packagesData.packages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-gray-500">
        <p>No trips match your filters.</p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packagesData.packages.map((pkg) => (
          <Link
            key={pkg._id}
            to={`/packages/${pkg._id}`}
            className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
          >
            <img
              src={
                pkg.images?.[0] ||
                "https://source.unsplash.com/800x600/?travel"
              }
              alt={pkg.title}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition duration-500 flex flex-col justify-end p-6">
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                {pkg.title}
              </h2>
              <p className="text-sm text-gray-200 flex items-center gap-1">
                <Compass className="w-4 h-4" />{" "}
                {pkg.tourType || "Adventure"}
              </p>
              <p className="text-lg font-semibold text-white mt-2">
                ৳{pkg.price}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {packagesData.total > filters.limit && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => handlePageChange(filters.page - 1)}
          >
            Previous
          </Button>
          {Array.from(
            { length: Math.ceil(packagesData.total / filters.limit) },
            (_, i) => i + 1
          )
            .slice(
              Math.max(0, filters.page - 3),
              Math.min(
                Math.ceil(packagesData.total / filters.limit),
                filters.page + 2
              )
            )
            .map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === filters.page ? "default" : "outline"}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
          <Button
            variant="outline"
            disabled={
              filters.page >= Math.ceil(packagesData.total / filters.limit)
            }
            onClick={() => handlePageChange(filters.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PackageResults;
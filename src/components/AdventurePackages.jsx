import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useState } from "react";
import { Link } from "react-router";

// Fetch packages
const fetchPackages = async () => {
  const axiosSecure = useAxiosSecure();
  const { data } = await axiosSecure.get("/packages");
  return data;
};

export default function AdventurePackages() {
  const { data: packages = [], isLoading, isError } = useQuery({
    queryKey: ["packages"],
    queryFn: fetchPackages,
  });

  const [activeImage, setActiveImage] = useState(
    packages[0]?.images[0] || "https://via.placeholder.com/800"
  );

  if (isLoading) return <p className="text-center py-10">Loading Packages...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Failed to load packages.</p>;

  return (
    <section className="py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-zinc-900 dark:to-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 space-y-8">

        {/* Featured Image */}
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
          <img
            src={activeImage}
            alt="Featured Package"
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-semibold drop-shadow-md">Selected Destination</h3>
            <p className="opacity-80">Hover or click a package below 🌍</p>
          </div>
        </div>

        {/* Packages List Slider */}
        <div className="overflow-x-auto">
          <div className="flex gap-4">
            {packages.map((pkg) => (
              <Link key={pkg._id} to={`/packages/${pkg._id}`}>
                <Card
                  className="flex-none w-24 h-24 cursor-pointer rounded-lg overflow-hidden shadow hover:scale-105 transition-transform duration-300"
                  onMouseEnter={() => setActiveImage(pkg.images[0])}
                >
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </Card>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

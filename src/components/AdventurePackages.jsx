import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
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
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        
        {/* Featured Image (Top always) */}
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
          <img
            src={activeImage}
            alt="Featured Package"
            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-semibold drop-shadow-md">Selected Destination</h3>
            <p className="opacity-80">Hover a package to preview 🌍</p>
          </div>
        </div>

        {/* Packages List (Bottom on mobile, side-by-side on larger screens) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <HoverCard key={pkg._id} openDelay={150} closeDelay={150}>
              <HoverCardTrigger asChild>
                <Card
                  className="cursor-pointer hover:shadow-lg hover:border-emerald-400 transition-all duration-300"
                  onMouseEnter={() => setActiveImage(pkg.images[0])}
                >
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <CardContent className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {pkg.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        ৳{pkg.price}
                      </span>
                      <Link to={`/packages/${pkg._id}`}>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                          View Plan
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </HoverCardTrigger>

              {/* Hover Content (Extra Info) */}
              <HoverCardContent className="w-64 p-4 space-y-2">
                <img
                  src={pkg.images[1] || pkg.images[0]}
                  alt="Preview"
                  className="w-full h-28 object-cover rounded-md"
                />
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
                  {pkg.tourPlan?.[0]}
                </p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}

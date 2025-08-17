import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router";

export default function TourismAndGuideTabs() {
  const axiosSecure = useAxiosSecure();

  // Fetch random packages
  const { data: packages = [], isLoading: packagesLoading } = useQuery({
    queryKey: ["randomPackages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages/random");
      return res.data;
    },
  });

  // Fetch random guides
  const { data: guides = [], isLoading: guidesLoading, isError: guidesError } = useQuery({
    queryKey: ["randomGuides"],
    queryFn: async () => {
      const res = await axiosSecure.get("/guides/random?limit=6");
      return res.data;
    },
  });

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto text-gray-800 dark:text-white transition-colors duration-300 rounded-xl space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          🌍 Tourism & Travel Guide
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          From adventure-packed getaways to expert local guidance — explore curated travel packages and connect with experienced guides.
        </p>
      </div>

      <Tabs defaultValue="packages" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-2 w-fit mx-auto bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
          <TabsTrigger value="packages" className="rounded-lg px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900">
            Our Packages
          </TabsTrigger>
          <TabsTrigger value="guides" className="rounded-lg px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900">
            Meet Our Tour Guides
          </TabsTrigger>
        </TabsList>

        {/* 📦 Package Panel */}
        <TabsContent value="packages">
          {packagesLoading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading packages...</p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <Card
                  key={pkg._id}
                  className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 cursor-pointer"
                >
                  <Link to={`/packages/${pkg._id}`}>
                    <img
                      src={pkg.images?.[0] || "https://via.placeholder.com/400x250"}
                      alt={pkg.title}
                      className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{pkg.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{pkg.tourType || "Adventure"}</Badge>
                      <Badge variant="secondary">{pkg.duration || "3 Days"}</Badge>
                    </div>
                    <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
                      ৳{pkg.price || "N/A"}
                    </p>
                    <Link to={`/packages/${pkg._id}`}>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white mt-2 w-full">
                        View Package
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 🧭 Guide Panel */}
        <TabsContent value="guides">
          {guidesLoading ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading guides...</p>
          ) : guidesError ? (
            <p className="text-center py-10 text-red-500">Failed to load guides.</p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <Card
                  key={guide._id}
                  className="rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                >
                  <Avatar src={guide.photo} alt={guide.name} className="w-24 h-24 mx-auto mb-4 border-4 border-emerald-300 dark:border-emerald-500" />
                  <h3 className="text-lg font-bold">{guide.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{guide.expertise || "Tour Expert"}</p>
                  <Link to={`/guide/${guide._id}`}>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white mt-2 w-full">
                      View Profile
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

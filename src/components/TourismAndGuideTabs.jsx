import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { motion } from "framer-motion";

export default function TourismAndGuideTabs() {
  const axiosSecure = useAxiosSecure();

  const { data: packages = [] } = useQuery({
    queryKey: ["randomPackages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages/random");
      return res.data;
    },
  });

  const { data: guides = [], isPending, isError } = useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users?role=guide");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto text-gray-800 dark:text-white transition-colors duration-300 rounded-xl">
      <h2 className="text-4xl font-extrabold text-center mb-2 tracking-tight">
        🌍 Tourism & Travel Guide
      </h2>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-10">
        From adventure-packed getaways to expert local guidance — explore curated travel packages and connect with experienced guides.
      </p>

      <Tabs selectedTabClassName="text-blue-600 font-semibold border-b-2 border-blue-500">
        <TabList className="flex justify-center gap-10 mb-10 text-lg">
          <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-300">
            Our Packages
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-300">
            Meet Our Tour Guides
          </Tab>
        </TabList>

        {/* 📦 Package Panel */}
        <TabPanel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition duration-300"
              >
                <img
                  src={pkg.images}
                  alt={pkg.title}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {pkg.tourType}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    ${pkg.price}
                  </p>
                  <Link
                    to={`/packages/${pkg._id}`}
                    className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200"
                  >
                    View Package
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </TabPanel>

        {/* 🧭 Guide Panel */}
        <TabPanel>
          {isPending ? (
            <div className="text-center py-10 text-lg font-medium text-gray-400 dark:text-gray-500">
              Loading guides...
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-red-500">Failed to load guides.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <motion.div
                  key={guide._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={guide.photo}
                    alt={guide.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-4 border-blue-300 dark:border-blue-500"
                  />
                  <h3 className="text-lg font-bold mb-2">{guide.name}</h3>
                  <Link
                    to={`/guide/${guide._id}`}
                    className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
                  >
                    View Profile
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </TabPanel>
      </Tabs>
    </section>
  );
}

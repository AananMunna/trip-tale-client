// TourismAndGuideTabs.jsx
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const TourismAndGuideTabs = () => {
    const axiosSecure = useAxiosSecure();
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["randomPackages"],
    queryFn: async () => {
      const res = await axiosSecure.get("/packages/random");
      return res.data;
    },
  });

// console.log(packages);
//   const [packages] = useState([
//     {
//       _id: "pkg1",
//       image:
//         "https://passport-cdn.kiwicollection.com/blog/drive/uploads/2019/08/002478-15-beach-dining-Carlisle-Bay-693x390.jpg",
//       title: "Sunny Beach Escape",
//       tourType: "Leisure",
//       price: 899,
//     },
//     {
//       _id: "pkg2",
//       image:
//         "https://www.travelmate.com.bd/wp-content/uploads/2019/08/Jogi-Haphong.jpg.webp",
//       title: "Mountain Adventure",
//       tourType: "Adventure",
//       price: 1299,
//     },
//     {
//       _id: "pkg3",
//       image:
//         "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2.%E0%A6%B6%E0%A6%BE%E0%A6%AA%E0%A6%B2%E0%A6%BE_%E0%A6%9A%E0%A6%A4%E0%A7%8D%E0%A6%AC%E0%A6%B0.jpg/960px-2.%E0%A6%B6%E0%A6%BE%E0%A6%AA%E0%A6%B2%E0%A6%BE_%E0%A6%9A%E0%A6%A4%E0%A7%8D%E0%A6%AC%E0%A6%B0.jpg",
//       title: "City Explorer",
//       tourType: "Urban",
//       price: 599,
//     },
//   ]);

  const [guides] = useState([
    {
      _id: "guide1",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "John Doe",
      experience: 8,
      location: "Paris, France",
    },
    {
      _id: "guide2",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Jane Smith",
      experience: 5,
      location: "Kyoto, Japan",
    },
    {
      _id: "guide3",
      photo: "https://randomuser.me/api/portraits/men/76.jpg",
      name: "Carlos Ruiz",
      experience: 10,
      location: "Lima, Peru",
    },
    {
      _id: "guide4",
      photo: "https://randomuser.me/api/portraits/women/55.jpg",
      name: "Lina Zhang",
      experience: 6,
      location: "Beijing, China",
    },
    {
      _id: "guide5",
      photo: "https://randomuser.me/api/portraits/men/88.jpg",
      name: "Ahmed Khan",
      experience: 7,
      location: "Cairo, Egypt",
    },
    {
      _id: "guide6",
      photo: "https://randomuser.me/api/portraits/women/20.jpg",
      name: "Emily Carter",
      experience: 4,
      location: "Sydney, Australia",
    },
  ]);

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300 rounded-xl shadow-md">
      <h2 className="text-4xl font-extrabold text-center mb-12 tracking-tight">
        🌍 Tourism & Travel Guide
      </h2>

      <Tabs selectedTabClassName="text-blue-600 font-semibold border-b-2 border-blue-500">
        <TabList className="flex justify-center gap-10 mb-10 text-lg">
          <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-300">
            Our Packages
          </Tab>
          <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:border-blue-400 focus:outline-none focus:border-blue-600 transition-colors duration-300">
            Meet Our Tour Guides
          </Tab>
        </TabList>

        <TabPanel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              
              <div
                key={pkg._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={pkg.images}
                  alt={pkg.title}
                  className="h-48 w-full object-cover"
                />
                {console.log(pkg.images)}
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-1">{pkg.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {pkg.tourType}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-bold mb-4">
                    ${pkg.price}
                  </p>
                  <Link
                    to={`/packages/${pkg._id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Package
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>

        <TabPanel>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div
                key={guide._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-28 h-28 rounded-full mx-auto object-cover mb-4 border-4 border-blue-200 dark:border-blue-500"
                />
                <h3 className="text-lg font-bold mb-1">{guide.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {guide.experience} years experience
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {guide.location}
                </p>
                <Link
                  to={`/guide/${guide._id}`}
                  className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </section>
  );
};

export default TourismAndGuideTabs;

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

// Features
const features = [
  {
    icon: "🌄",
    title: "Hidden Scenic Spots",
    description:
      "Discover breathtaking places off the beaten path—carefully curated for peace-seekers and wanderers alike.",
    ribbon: "Most Loved",
  },
  {
    icon: "🧭",
    title: "Local Travel Experts",
    description:
      "Get guided by locals who know every tea trail, village, and secret sunset point in Sylhet.",
    ribbon: "Expert Pick",
  },
  {
    icon: "📜",
    title: "Personalized Itineraries",
    description:
      "Craft your own adventure. Whether solo or squad, we tailor your journey to your vibe and interests.",
    ribbon: "New",
  },
];

// Static Stats
const stats = [
  { label: "Hidden Spots", value: "50+" },
  { label: "Travel Experts", value: "30+" },
  { label: "Journeys Planned", value: "1000+" },
];

// Mini Gallery - Free & Directly Accessible
const galleryImages = [
  "https://i.ibb.co/JFc7ZFyV/md-akil-khan-q-o-Od-JIe-WY-unsplash-min.jpg", // Sylhet Tea Gardens
  "https://i.ibb.co/YFSWW5Cy/salman-khalid-R2-RNxkbinrg-unsplash-min.jpg", // Cox's Bazar Beach
  "https://i.ibb.co/dJrtKtZc/naoki-suzuki-e9-R-n-T52dw-M-unsplash-min.jpg", // Sundarbans Mangrove
];


export default function OverviewSection() {
  return (
    <section className="relative overflow-hidden py-24 px-6 sm:px-10 md:px-20 bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Glow Effects */}
      <div className="absolute top-[-80px] left-[-60px] w-[400px] h-[400px] rounded-full bg-blue-400 dark:bg-blue-600 opacity-10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[300px] h-[300px] rounded-full bg-purple-400 dark:bg-purple-600 opacity-10 blur-[120px] pointer-events-none z-0" />

      {/* Heading */}
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-10">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Explore Sylhet & More with TripTale 🌍
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Dive into Bangladesh’s natural beauty—from tea terraces to serene hills.
          Let TripTale guide your journey, one story at a time.
        </p>

        {/* Stats */}
        <div className="mt-10 flex justify-center gap-10 flex-wrap">
          {stats.map((stat, i) => (
            <Card key={i} className="p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-md">
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="relative p-6 shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Ribbon */}
              <Badge className="absolute top-4 right-4">{feature.ribbon}</Badge>

              <CardContent className="space-y-4">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mini Gallery */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-xl shadow-lg">
              <img
                src={img}
                alt={`Gallery ${i}`}
                className="w-full h-40 object-cover transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

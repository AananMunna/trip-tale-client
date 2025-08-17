import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { 
  FaUserTie, 
  FaEnvelope, 
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaGlobe,
  FaLanguage,
  FaCertificate
} from "react-icons/fa";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GuideProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: guide, isPending, error } = useQuery({
    queryKey: ["guide", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?role=guide`);
      return res.data.find((g) => g._id === id);
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mock data for demonstration
  const stats = {
    rating: 4.7,
    toursCompleted: 124,
    yearsExperience: 5,
    responseRate: 92,
    responseTime: "1 hour",
    languages: ["English", "Spanish", "Bengali"],
    certifications: ["Wilderness First Aid", "Tour Guide License", "CPR Certified"],
    specialties: ["Hiking", "Cultural Tours", "Food Tours", "Adventure"],
    upcomingTours: [
      { id: 1, name: "Sundarban Adventure", date: "2023-11-15" },
      { id: 2, name: "Historic Dhaka Walk", date: "2023-11-20" }
    ]
  };

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const timeAgo = (isoDate) => {
    const seconds = Math.floor((Date.now() - new Date(isoDate)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-3">
        <span className="loading loading-bars loading-lg text-emerald-500" />
        <p className="text-gray-500">Fetching guide profile...</p>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 dark:text-red-400 text-xl">
        Something went wrong or guide not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to results
        </Button>

        {/* Main Profile Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800">
                    <AvatarImage src={guide.photo} alt={guide.name} />
                    <AvatarFallback>{guide.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <CardHeader className="pt-20">
                <CardTitle className="text-center text-2xl font-bold">
                  {guide.name}
                </CardTitle>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Professional Tour Guide
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaStar className="text-yellow-500" />
                  <div>
                    <p className="font-medium">{stats.rating} Rating</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stats.toursCompleted} tours completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-500" />
                  <p>Dhaka, Bangladesh</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-blue-500" />
                  <p>{guide.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-green-500" />
                  <p>+880 1XXX-XXXXXX</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-purple-500" />
                  <p>Joined {formatDate(guide.createdAt)}</p>
                </div>
              </CardContent>
              {/* <CardFooter className="flex justify-center">
                <Button className="w-full">Contact Guide</Button>
              </CardFooter> */}
            </Card>

            {/* Languages Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaLanguage className="text-blue-500" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.languages.map((lang) => (
                    <div key={lang} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <h3 className="text-3xl font-bold">{stats.yearsExperience}+</h3>
                <p className="text-gray-500">Years Experience</p>
              </Card>
              <Card className="text-center p-4">
                <h3 className="text-3xl font-bold">{stats.toursCompleted}</h3>
                <p className="text-gray-500">Tours Completed</p>
              </Card>
              <Card className="text-center p-4">
                <h3 className="text-3xl font-bold">{stats.responseRate}%</h3>
                <p className="text-gray-500">Response Rate</p>
              </Card>
              <Card className="text-center p-4">
                <h3 className="text-3xl font-bold">{stats.responseTime}</h3>
                <p className="text-gray-500">Avg. Response Time</p>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="specialties">Specialties</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Hello! I'm {guide.name}, a professional tour guide with {stats.yearsExperience} years of experience 
                      showing visitors the best of Bangladesh. My passion is sharing the rich culture, history, 
                      and natural beauty of our country with travelers from around the world.
                    </p>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FaCertificate className="text-blue-500" />
                        Certifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {stats.certifications.map((cert) => (
                          <Badge key={cert} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specialties">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stats.specialties.map((specialty) => (
                        <div key={specialty} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                            <FaGlobe className="text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium">{specialty}</h4>
                            <p className="text-sm text-gray-500">
                              {Math.floor(Math.random() * 50) + 20} tours conducted
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">Upcoming Available Tours</h4>
                    <div className="space-y-4">
                      {stats.upcomingTours.map((tour) => (
                        <div key={tour.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h5 className="font-medium">{tour.name}</h5>
                            <p className="text-sm text-gray-500">
                              {formatDate(tour.date)}
                            </p>
                          </div>
                          {/* <Button variant="outline">Book Now</Button> */}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <h3 className="text-5xl font-bold">{stats.rating}</h3>
                    <div className="flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`${i < Math.floor(stats.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-500">{stats.toursCompleted} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="w-8 text-right">{stars}</span>
                        <FaStar className="text-yellow-500" />
                        <Progress 
                          value={(stars / 5) * 100} 
                          className="h-2 flex-1" 
                        />
                        <span className="w-8 text-left text-gray-500">
                          {Math.floor(Math.random() * 30) + 10}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Review */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Sarah Johnson</h4>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < 5 ? 'text-yellow-500' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {guide.name} was an amazing guide! His knowledge of the local history and culture 
                    made our tour of Old Dhaka truly special. He went above and beyond to make sure 
                    we had a great experience.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">2 weeks ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Compass, MapPin, CalendarDays, Star } from "lucide-react";

const SimilarTrips = ({ currentTripId, tourType }) => {
  const axiosSecure = useAxiosSecure();

  const { data: similarTrips, isLoading, isError } = useQuery({
    queryKey: ["similar-trips", tourType],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/packages");
      return data?.filter(
        (trip) => trip?._id !== currentTripId && trip?.tourType?.includes(tourType)
      )?.slice(0, 6) || []; // Limit to 6 similar trips
    },
  });

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load similar trips
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-2">
          <Compass className="text-emerald-600" />
          {tourType ? `Similar ${tourType} Trips` : 'Similar Trips'} You Might Like
        </h2>

        {/* Desktop Grid (hidden on mobile) */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-24" />
                    </CardFooter>
                  </Card>
                ))
            : similarTrips?.map((trip) => (
                <Card key={trip?._id} className="hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={trip?.images?.[0]}
                      alt={trip?.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Trip+Image';
                      }}
                    />
                    {trip?.tourType && (
                      <Badge className="absolute top-3 left-3 bg-emerald-600 hover:bg-emerald-700">
                        {trip.tourType}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span className="text-lg">{trip?.title}</span>
                      {trip?.price && (
                        <span className="text-emerald-600 font-bold">
                          ৳{trip.price}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>Sylhet Division</span>
                    </div>
                    {trip?.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CalendarDays className="w-4 h-4" />
                        <span>{trip.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>4.8 (24 reviews)</span>
                    </div>
                    {trip?.description && (
                      <p className="text-sm line-clamp-2 text-gray-700 dark:text-gray-300">
                        {trip.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/packages/${trip?._id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>

        {/* Mobile Carousel (hidden on desktop) */}
        <div className="md:hidden px-2">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <CarouselItem key={i} className="basis-10/12 sm:basis-1/2">
                        <Card>
                          <Skeleton className="h-48 w-full rounded-t-lg" />
                          <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6" />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))
                : similarTrips?.map((trip) => (
                    <CarouselItem key={trip?._id} className="basis-10/12 sm:basis-1/2">
                      <Card className="h-full">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={trip?.images?.[0]}
                            alt={trip?.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Trip+Image';
                            }}
                          />
                          {trip?.tourType && (
                            <Badge className="absolute top-3 left-3 bg-emerald-600 hover:bg-emerald-700">
                              {trip.tourType}
                            </Badge>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {trip?.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between items-center">
                            {trip?.price && (
                              <span className="text-emerald-600 font-bold">
                                ৳{trip.price}
                              </span>
                            )}
                            {trip?.duration && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {trip.duration}
                              </span>
                            )}
                          </div>
                          {trip?.description && (
                            <p className="text-sm line-clamp-2 text-gray-700 dark:text-gray-300">
                              {trip.description}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full" size="sm">
                            <Link to={`/packages/${trip?._id}`}>Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>

        {!isLoading && similarTrips?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No similar trips found
          </div>
        )}
      </div>
    </section>
  );
};

export default SimilarTrips;
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    userName: "Rahim Ahmed",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    tripDestination: "Sylhet Tea Garden",
    rating: 5,
    comment:
      "Absolutely loved the serene greenery! The local guides made our trip unforgettable. Highly recommend Sylhet for nature lovers.",
  },
  {
    id: 2,
    userName: "Fatima Noor",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    tripDestination: "Cox's Bazar Beach",
    rating: 4,
    comment:
      "The sunrise at Cox's Bazar was breathtaking! Beautiful beaches and friendly locals. Perfect family trip.",
  },
  {
    id: 3,
    userName: "Arif Hossain",
    userAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
    tripDestination: "Sundarbans Safari",
    rating: 5,
    comment:
      "Thrilling adventure in the Sundarbans! Got to see wildlife up close. Guides were very knowledgeable.",
  },
  {
    id: 4,
    userName: "Rina Akter",
    userAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    tripDestination: "Srimangal Tea Hills",
    rating: 4,
    comment:
      "Tea plantations are mesmerizing! Loved the peaceful walks and authentic local food. Perfect for a short getaway.",
  },
  {
    id: 5,
    userName: "Tariq Islam",
    userAvatar: "https://randomuser.me/api/portraits/men/65.jpg",
    tripDestination: "Jaflong & Lalakhal",
    rating: 5,
    comment:
      "Beautiful rivers and landscapes! A photographer's paradise. Truly a must-visit in Bangladesh.",
  },
  {
    id: 6,
    userName: "Mousumi Sultana",
    userAvatar: "https://randomuser.me/api/portraits/women/30.jpg",
    tripDestination: "Rangamati Hills",
    rating: 4,
    comment:
      "Stunning hills and lake views. The cultural experiences with local tribes were eye-opening and enriching.",
  },
];

export default function TravelerReviews() {
  return (
    <section className="py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
          Traveler Reviews & Highlights ✨
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6 shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={review.userAvatar} alt={review.userName} />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {review.userName}
                      </h4>
                      <Badge className="mt-1">{review.tripDestination}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-4">{review.comment}</p>
                {/* <div className="text-right">
                  <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Read More
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

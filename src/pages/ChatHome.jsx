import { useContext, useState } from "react";
import ChatBox from "../components/ChatBox";
import { AuthContext } from "../context/AuthProvider";
import { getRoomId } from "../utils/getRoomId";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const ChatHome = () => {
  const { user } = useContext(AuthContext);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const axiosSecure = useAxiosSecure();

  const {
    data: guides = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?role=guide`);
      return res.data;
    },
  });

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 md:px-8 py-10 bg-gradient-to-br from-[#f8f9fa] via-white to-[#e9ecef] dark:from-gray-900 dark:to-gray-800 transition-all duration-300 pt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Chat UI */}
        <div className="col-span-2  p-6 min-h-[60vh] flex items-center justify-center relative transition-all">
          {selectedGuide ? (
            <ChatBox
              roomId={getRoomId(user?.email, selectedGuide.email)}
              receiver={selectedGuide.email}
            />
          ) : (
            <div className="text-center">
              <h3 className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Select a guide from the right to start chatting 💬
              </h3>
            </div>
          )}
        </div>

        {/* Guide Sidebar */}
        <div className="col-span-1 bg-white/70 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-5 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            👨‍✈️ Available Guides
          </h2>

          {isLoading && (
            <p className="text-gray-500 dark:text-gray-400">Loading guides...</p>
          )}

          {isError && (
            <p className="text-red-500 dark:text-red-400">Error: {error.message}</p>
          )}

          {!isLoading && guides.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">No guides found.</p>
          )}

          <div className="space-y-3">
            {guides.map((guide) => (
              <div
                key={guide.email}
                onClick={() => setSelectedGuide(guide)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:bg-blue-100 dark:hover:bg-blue-900 ${
                  selectedGuide?.email === guide.email
                    ? "bg-blue-50 dark:bg-blue-800 border border-blue-400 shadow-md"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <img
                  src={`https://i.pravatar.cc/150?u=${guide.email}`}
                  alt={guide.name}
                  className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{guide.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{guide.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;

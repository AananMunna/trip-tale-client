import { useContext, useState } from "react";
import ChatBox from "../components/ChatBox";
import { AuthContext } from "../context/AuthProvider";
import { getRoomId } from "../utils/getRoomId";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const GuideInbox = () => {
  const { user } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const axiosSecure = useAxiosSecure();

  const {
    data: conversations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["guideInbox", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/messages/inbox/${user.email}`);
      return res.data;
    },
  });

  // console.log(conversations);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#f8f9fa] via-white to-[#e9ecef] dark:from-gray-900 dark:to-gray-800 text-black dark:text-white p-6 md:flex md:space-x-6">
      
      {/* Chat Window */}
      <div className="w-full md:w-2/3 mt-6 md:mt-0">
        {selectedUser ? (
          <ChatBox
            roomId={getRoomId(user?.email, selectedUser.email)}
            receiver={selectedUser.email}
          />
        ) : (
          <div className="h-[80vh] flex items-center justify-center bg-white/70 dark:bg-gray-800/50 rounded-2xl shadow-xl backdrop-blur-sm">
            <p className="text-gray-500 text-lg font-medium">
              Select a user to start the conversation 💬
            </p>
          </div>
        )}
      </div>

      {/* Inbox Sidebar */}
      <div className="w-full md:w-1/3 bg-white/80 dark:bg-white/10 border dark:border-gray-700 backdrop-blur-md shadow-xl rounded-2xl p-5 h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">📥 Guide Inbox</h2>

        {isLoading && <p className="text-gray-500">Loading conversations...</p>}
        {isError && <p className="text-red-500">Error: {error.message}</p>}
        {!isLoading && conversations.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}

        <div className="space-y-3">
          {conversations.map((convo) => (
            <div
              key={convo.email}
              onClick={() => setSelectedUser(convo)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                selectedUser?.email === convo.email
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600"
              }`}
            >
              <div>
                {/* <img src={convo.photo} alt="" /> */}
                <p className="font-semibold">{convo.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{convo.email}</p>
              </div>
              <span className="text-xl">💬</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideInbox;

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import { AuthContext } from "../context/AuthProvider";
import { getRoomId } from "../utils/getRoomId";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ChatHome = () => {
  const { user } = useContext(AuthContext);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
    const axiosSecure = useAxiosSecure();


  useEffect(() => {
    axiosSecure.get(`/users?role=guide`).then((res) => {
      setGuides(res.data);
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-8 bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="max-w-6xl mt-10 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
       

        {/* ChatBox UI */}
        <div className="col-span-2 bg-white/90 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-5 min-h-[60vh] flex items-center justify-center relative">
          {selectedGuide ? (
            <ChatBox
              roomId={getRoomId(user?.email, selectedGuide.email)}
              receiver={selectedGuide.email}
            />
          ) : (
            <div className="text-center">
              <h3 className="text-lg text-gray-600 dark:text-gray-400">
                Select a guide from the right to start chatting 💬
              </h3>
            </div>
          )}
        </div>
         {/* Sidebar with Guide List */}
        <div className="col-span-1 bg-white/80 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-5 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            👨‍✈️ Available Guides
          </h2>

          {guides.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No guides found.</p>
          ) : (
            guides.map((guide) => (
              <div
                key={guide.email}
                onClick={() => setSelectedGuide(guide)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900 ${
                  selectedGuide?.email === guide.email
                    ? "bg-blue-50 dark:bg-blue-800 border border-blue-400"
                    : ""
                }`}
              >
                <img
                  src={`https://i.pravatar.cc/150?u=${guide.email}`}
                  alt={guide.name}
                  className="w-12 h-12 rounded-full shadow-md border border-gray-300 dark:border-gray-600"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{guide.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{guide.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
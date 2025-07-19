import { useContext, useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import { AuthContext } from "../context/AuthProvider";
import { getRoomId } from "../utils/getRoomId";

const GuideInbox = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/messages/inbox/${user?.email}`)
      .then((res) => {
        setConversations(res.data);
      });
  }, [user?.email]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white p-6 md:flex md:space-x-6">
      {/* Left Sidebar */}
      <div className="w-full  md:w-1/3 bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-xl rounded-2xl p-4 h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">📥 Guide Inbox</h2>
        {conversations.length === 0 && (
          <p className="text-gray-500">No messages yet</p>
        )}
        <div className="space-y-3">
          {conversations.map((convo) => (
            <div
              key={convo.email}
              onClick={() => setSelectedUser(convo)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedUser?.email === convo.email
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600"
              }`}
            >
              <div>
                <p className="font-medium">{convo.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {convo.email}
                </p>
              </div>
              <span className="text-xl">💬</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-full md:w-2/3 mt-6 md:mt-0">
        {selectedUser ? (
          <ChatBox
            roomId={getRoomId(user?.email, selectedUser.email)}
            receiver={selectedUser.email}
          />
        ) : (
          <div className="h-[80vh] flex items-center justify-center bg-white/70 dark:bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur">
            <p className="text-gray-500 text-lg">Select a user to chat with 💬</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideInbox;

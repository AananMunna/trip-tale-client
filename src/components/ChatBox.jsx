import { useContext, useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import { AuthContext } from "../context/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ChatBox = ({ roomId, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ Join room and load chat history
  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId);

    const fetchHistory = async () => {
      try {
        const res = await axiosSecure.get(`/messages/${roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Failed to load messages:", err);
      }
    };

    fetchHistory();

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [roomId]);

  // ✅ Smooth scroll to bottom ONLY within chat box
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const message = {
      roomId,
      text: newMsg,
      sender: user?.email,
      receiver,
      timestamp: new Date(),
    };

    socket.emit("send-message", message);
    setNewMsg("");

    try {
      await axiosSecure.post(`/messages`, message);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  console.log(receiver);

  return (
    <div className="w-full h-[80vh] md:h-[70vh] flex flex-col bg-white dark:bg-gray-900 shadow-2xl rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden">
      
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-lg truncate">
          💬 Chat with {receiver}
        </h3>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4 bg-gray-50 dark:bg-gray-800 space-y-3 scroll-smooth"
      >
        {messages.map((msg, idx) => {
          const isMe = msg.sender === user?.email;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] md:max-w-xs p-3 rounded-2xl text-sm break-words ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] text-right mt-1 opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 p-2 px-4 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-black dark:text-white focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

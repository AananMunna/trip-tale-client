import { useContext, useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import axios from "axios";
import { AuthContext } from "./../context/AuthProvider";

const ChatBox = ({ roomId, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId);

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/messages/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        });
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    await axios.post(`http://localhost:3000/messages`, message, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
    });
  };

  return (
    <div className="fixed z-50 bottom-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl rounded-xl border border-gray-300 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
        <h3 className="font-semibold text-lg">💬 Chat with {receiver}</h3>
        {/* You can add a close (X) button here later */}
      </div>

      {/* Chat Messages */}
      <div className="p-3 h-80 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-800">
        {messages.map((msg, idx) => {
          const isMe = msg.sender === user?.email;
          return (
            <div
              key={idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-2xl text-sm ${
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

      {/* Input Field */}
      <div className="flex items-center border-t border-gray-200 dark:border-gray-700 px-3 py-2">
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
          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

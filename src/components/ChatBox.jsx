import { useContext, useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import { AuthContext } from "../context/AuthProvider";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const ChatBox = ({ roomId, receiver }) => {
  const [newMsg, setNewMsg] = useState("");
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const queryClient = useQueryClient();
  const messagesContainerRef = useRef(null);

  // ✅ Query: Fetch message history
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/messages/${roomId}`);
      return res.data;
    },
    enabled: !!roomId,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    refetchInterval: 1000,
  });

  // ✅ Setup socket
  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", roomId);

    const handleIncoming = (msg) => {
      queryClient.setQueryData(["messages", roomId], (old = []) => [...old, msg]);
    };

    socket.on("receive-message", handleIncoming);

    return () => {
      socket.off("receive-message", handleIncoming);
    };
  }, [roomId, queryClient]);

  // ✅ Smooth scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // ✅ Send message
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

    // Optimistic update
    queryClient.setQueryData(["messages", roomId], (old = []) => [...old, message]);

    try {
      await axiosSecure.post(`/messages`, message);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return (
    <div className="w-full h-[80vh] md:h-[70vh] flex flex-col bg-white dark:bg-gray-900 shadow-2xl rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden">

      {/* Header */}
      <div
  className="text-white px-4 py-3 flex justify-between items-center"
  style={{ backgroundColor: "#009966" }}
>
  <h3 className="font-semibold text-lg truncate">💬 Chat with {receiver}</h3>
</div>


      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 py-4 bg-gray-50 dark:bg-gray-800 space-y-3 scroll-smooth"
      >
        {isLoading && <p className="text-center text-sm text-gray-500">Loading chat...</p>}
        {isError && <p className="text-center text-sm text-red-500">Error loading chat</p>}

        {messages.map((msg, idx) => {
          const isMe = msg.sender === user?.email;
          return (
            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
               className={`max-w-[80%] md:max-w-xs p-3 rounded-2xl text-sm break-words ${
  isMe
    ? "text-white rounded-br-none"
    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
}`}
style={isMe ? { backgroundColor: "#009966" } : {}}

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
  className="text-white px-4 py-2 rounded-full text-sm"
  style={{
    backgroundColor: "#009966",
    transition: "background-color 0.3s ease",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#007f55")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#009966")}
>
  Send
</button>

      </div>
    </div>
  );
};

export default ChatBox;

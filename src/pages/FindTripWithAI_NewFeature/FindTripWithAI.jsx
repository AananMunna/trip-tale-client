import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaUserAstronaut } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im"; // spinner

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173";

const FindTripWithAI = () => {
  const axiosSecure = useAxiosSecure();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are a travel assistant. Suggest trips from user's query.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const tripsRes = await axiosSecure.get("/packages");
      const trips = tripsRes.data;

      const prompt = `
You're a friendly travel guide helping tourists find the perfect trip from a list of available packages.

Here are the available trips with all the details:

${trips
  .map(
    (trip) =>
      `🏞️ Title: ${trip.title}
📝 Description: ${trip.description}
🎯 Type: ${trip.tourType}
⏳ Duration: ${trip.duration}
💸 Price: ${trip.price} BDT
🔗 Link: ${BASE_URL}/packages/${trip._id}

`
  )
  .join("\n")}

Now, the user said: "${input}"

Please suggest only the trips that match what they’re looking for based on price, tour type, or duration.

For each trip you suggest, include:
- 🏷️ Title
- ✨ One-line summary
- 💰 Price
- 🔎 A link labeled as **"View Trip Details"**

Keep your tone super friendly, helpful, and human—like a real tour guide would speak. Make the response short and easy to scan. If nothing matches, politely suggest they try different keywords.

Ready? Go! ✈️
`;

      const geminiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GEMINI_API_KEY,
          },
        }
      );

      const aiReply =
        geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't find a match.";

      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
      setInput("");
    } catch (error) {
      console.error("Gemini Error:", error.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops, something went wrong with Gemini.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const parseMessageWithLinks = (text) => {
    const urlRegex = new RegExp(`(${BASE_URL}/packages/[a-z0-9]+)`, "g");
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        const path = part.replace(BASE_URL, "");
        return (
          <Link
            key={index}
            to={path}
            className="inline-block mt-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 rounded-md hover:scale-105 transition"
          >
            View Trip Details
          </Link>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 p-4 bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-rose-500 
             hover:from-purple-600 hover:via-fuchsia-600 hover:to-rose-600 text-white 
             rounded-full shadow-2xl transition-all duration-300 ease-in-out 
             hover:scale-110 hover:shadow-fuchsia-500/60 animate-bounce"
      >
        {isOpen ? (
          <FaTimes className="text-2xl" />
        ) : (
          <FaUserAstronaut className="text-2xl" />
        )}
      </button>

      {/* Chat UI */}
      <div
        className={`fixed top-16 lg:top-0 right-3 z-[100] w-96 max-w-full h-[80vh] lg:h-[100vh] backdrop-blur-md bg-white/90 dark:bg-gray-900/90 shadow-2xl rounded-xl flex flex-col transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        {/* Header */}
        <div className="p-5 flex justify-between items-center bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 rounded-t-xl shadow-lg border-b border-emerald-800">
          <h2 className="text-xl font-extrabold tracking-wide drop-shadow-md select-none flex items-center gap-2">
            <span className="text-yellow-300 text-2xl">🌴</span>
            Trip AI Assistant
          </h2>

          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-emerald-100 hover:text-emerald-700 hover:bg-white transition-colors duration-300 rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
            aria-label="Close AI Chat"
          >
            <span className="text-2xl font-bold leading-none select-none">
              &times;
            </span>
          </button>
        </div>

        {/* Messages */}
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          <AnimatePresence>
            {messages.filter((msg) => msg.role !== "system").length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-emerald-100 dark:bg-emerald-800 text-gray-800 dark:text-white p-4 rounded-xl text-center font-medium shadow-md"
              >
                👋 Find your dream trip with AI! Just tell me what you're
                looking for 🌴
              </motion.div>
            ) : (
              messages
                .filter((msg) => msg.role !== "system")
                .map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={`p-3 text-sm md:text-base rounded-2xl max-w-[90%] whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-100 dark:bg-emerald-500 text-right self-end ml-auto text-gray-900 dark:text-white"
                        : "bg-green-100 dark:bg-green-700 text-left self-start mr-auto text-gray-900 dark:text-white"
                    }`}
                  >
                    {parseMessageWithLinks(msg.content)}
                  </motion.div>
                ))
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            placeholder="e.g. Cox’s Bazar trip under 3K"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`px-4 py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
              loading
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            } hover:scale-105 active:scale-95`}
            aria-label={loading ? "Thinking..." : "Send message"}
          >
            {loading ? (
              <>
                <span>Thinking... </span>
                {/* <ImSpinner2 className="animate-spin text-xl" /> */}
              </>
            ) : (
              <>
                <span>Send</span> <FaPaperPlane className="text-xl" />
              </>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-2">
          Powered by Gemini ✨
        </p>
      </div>
    </>
  );
};

export default FindTripWithAI;

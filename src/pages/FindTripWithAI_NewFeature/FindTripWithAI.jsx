import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router"; // fixed import
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

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
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
Here are the available trips with details:

${trips
  .map(
    (trip) =>
`Title: ${trip.title}
Description: ${trip.description}
Type: ${trip.tourType}
Duration: ${trip.duration}
Price: ${trip.price} BDT
Link: ${BASE_URL}/packages/${trip._id}

`
  )
  .join("\n")}

User query: ${input}

Based on the above trips, suggest only the matching trips (by price, tour type, duration). For each:
- Title
- Short Description
- Price
- Link (label as "View Trip Details")

Reply in a friendly, helpful tone.
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
      console.error("❌ Gemini error:", error.response?.data || error.message);
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
            className="inline-block text-sm font-medium text-white bg-emerald-500 px-3 py-1 rounded-md hover:scale-105 transition hover:underline"
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
        className="fixed right-4 top-1/3 z-40 px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded-l-lg shadow-lg transition"
        aria-label={isOpen ? "Close AI trip assistant" : "Open AI trip assistant"}
      >
        {isOpen ? "Close Trip AI" : "Open Trip AI"}
      </button>

      {/* Sticky Chat Box */}
      <div
        className={`fixed top-16 right-4 z-50 w-96 max-w-full h-[80vh] bg-white dark:bg-gray-800 shadow-2xl rounded-xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-emerald-500 text-white rounded-t-xl">
          <h2 className="text-lg font-bold">✈️ Trip AI Assistant</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white font-bold text-xl leading-none"
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
          {messages
            .filter((msg) => msg.role !== "system")
            .map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 text-sm md:text-base rounded-xl max-w-[90%] whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-100 dark:bg-emerald-500 text-right self-end ml-auto text-gray-900 dark:text-white"
                    : "bg-green-100 dark:bg-green-600 text-left self-start mr-auto text-gray-900 dark:text-white"
                }`}
              >
                {parseMessageWithLinks(msg.content)}
              </div>
            ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            placeholder="e.g. Cox’s Bazar trip under 3K"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`px-4 py-2 font-semibold rounded-lg text-white transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          Powered by Gemini ✨
        </p>
      </div>
    </>
  );
};

export default FindTripWithAI;

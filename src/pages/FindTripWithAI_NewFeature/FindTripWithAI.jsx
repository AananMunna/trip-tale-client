import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
  const [isOpen, setIsOpen] = useState(false); // popup open/close
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
Link: http://localhost:5173/packages/${trip._id}

`
  )
  .join("\n")}

User query: ${input}

Based on the above trips, please suggest only the trips matching the user query (like by price, tour type, or duration). For each suggested trip, reply with:
- Title
- Short Description
- Price
- Link (use the link provided)

Reply in a friendly, helpful tone.
`;


      const geminiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
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
        { role: "assistant", content: "Oops, something went wrong with Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-1/3 z-40 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-l-lg shadow-lg transition"
        aria-label={isOpen ? "Close AI trip assistant" : "Open AI trip assistant"}
      >
        {isOpen ? "Close Trip AI" : "Open Trip AI"}
      </button>

      {/* Sticky AI Chat Box */}
      <div
        className={`fixed top-16 right-4 z-50 w-96 max-w-full h-[80vh] bg-white dark:bg-gray-800 shadow-2xl rounded-xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            ✈️ Find Your Trip with AI
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-bold text-2xl leading-none"
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-700">
          {messages
            .filter((msg) => msg.role !== "system")
            .map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 text-sm md:text-base rounded-xl max-w-[85%] whitespace-pre-wrap transition-all ${
                  msg.role === "user"
                    ? "bg-blue-100 dark:bg-blue-600 text-right self-end ml-auto text-gray-900 dark:text-white"
                    : "bg-green-100 dark:bg-green-600 text-left self-start mr-auto text-gray-900 dark:text-white"
                }`}
              >
                {msg.content}
              </div>
            ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            placeholder="e.g. Cox’s Bazar trip under 3K"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                : "bg-blue-600 hover:bg-blue-700"
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

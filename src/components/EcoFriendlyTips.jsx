import React from "react";

const EcoFriendlyTips = () => {
  const tips = [
    "Use refillable water bottles instead of plastic.",
    "Respect wildlife and never feed or disturb them.",
    "Stay in eco-certified accommodations.",
    "Support local businesses and artisans.",
    "Minimize waste, recycle where possible.",
    "Walk or cycle to explore nearby places.",
  ];

  return (
    <section className="px-6 py-20 max-w-7xl mx-auto bg-green-50 dark:bg-green-950 text-gray-900 dark:text-green-200 transition-colors duration-500 rounded-3xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-center mb-14 tracking-tight text-green-800 dark:text-green-300">
        🌱 Eco-Friendly Travel Tips
      </h2>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip, idx) => (
          <li
            key={idx}
            className="flex items-start gap-4 bg-white dark:bg-green-900 border border-green-200 dark:border-green-700 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <span className="inline-block text-3xl leading-none select-none text-green-600 dark:text-green-400">
              ✅
            </span>
            <p className="text-base leading-relaxed font-medium">{tip}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EcoFriendlyTips;

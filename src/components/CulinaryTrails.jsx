import React from "react";

const CulinaryTrails = () => {
  const foods = [
    {
      name: "Hilsa Curry",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/2/20/Ilish_Macher_Curry_%28Bengali_style_Hilsa_Curry%29.jpg",
      region: "Padma River Region",
      description: "A rich and spicy dish made with the national fish of Bangladesh.",
    },
    {
      name: "Panta Ilish",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/7e/Panta_&_Ilish_%28Bangladeshi_traditional_dish%29.jpg",
      region: "Rural Bengal",
      description:
        "A traditional Bengali New Year dish with soaked rice and fried hilsa.",
    },
    {
      name: "Shatkora Beef",
      image:
        "https://i.pinimg.com/originals/9c/cd/5b/9ccd5b2c9f03f0037a0d2a5f7e6c98a7.jpg",
      region: "Sylhet",
      description:
        "Zesty beef curry infused with the unique flavor of shatkora lime.",
    },
  ];

  return (
    <section className="px-6 py-20 max-w-7xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500 rounded-xl shadow-md">
      <h2 className="text-4xl font-extrabold text-center mb-14 tracking-tight text-gray-900 dark:text-gray-100">
        🍛 Culinary Trails of Bangladesh
      </h2>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food, idx) => (
          <div
            key={idx}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <img
              src={food.image}
              alt={food.name}
              className="h-56 w-full object-cover rounded-t-xl"
              loading="lazy"
            />
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {food.name}
              </h3>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                Region: {food.region}
              </p>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {food.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CulinaryTrails;

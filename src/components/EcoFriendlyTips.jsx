import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ecoTips = [
  { icon: "💧", title: "Refillable Water", desc: "Use refillable water bottles instead of plastic." },
  { icon: "🌿", title: "Respect Wildlife", desc: "Never feed or disturb animals." },
  { icon: "🏨", title: "Eco Accommodations", desc: "Stay in eco-certified hotels or homestays." },
  { icon: "🛍️", title: "Support Locals", desc: "Buy from local artisans and businesses." },
  { icon: "♻️", title: "Reduce Waste", desc: "Recycle and minimize disposable items." },
  { icon: "🚶‍♂️", title: "Walk or Cycle", desc: "Explore nearby places on foot or by bike." },
];

export default function EcoFriendlyTipsSection() {
  const [checkedTips, setCheckedTips] = useState([]);

  const toggleCheck = (index) => {
    setCheckedTips((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="max-w-7xl mx-auto mt-20 px-6 py-20 mb-20 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-500">
      <h2 className="text-4xl font-extrabold text-center mb-12 tracking-tight text-gray-900 dark:text-white">
        🌱 Eco-Friendly Travel Tips
      </h2>

      <Tabs defaultValue="timeline" className="space-y-6 ">
        <TabsList className="grid w-full grid-cols-3 dark:bg-gray-900/70">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="slider">Slider</TabsTrigger>
          <TabsTrigger value="accordion">Checklist</TabsTrigger>
        </TabsList>

        {/* Timeline Layout */}
        <TabsContent value="timeline">
          <div className="relative border-l-2 border-emerald-400 dark:border-emerald-600 ml-4 mt-6">
            {ecoTips.map((tip, i) => (
              <div key={i} className="mb-10 ml-6 relative">
                <span className="absolute ml-1 -left-6 top-0 w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xl shadow-lg">
                  {tip.icon}
                </span>
                <h3 className="text-lg font-semibold ml-10">{tip.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 ml-10">{tip.desc}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Slider Layout */}
        <TabsContent value="slider">
          <div className="flex overflow-x-auto gap-6 mt-6 pb-4">
            {ecoTips.map((tip, i) => (
              <Card key={i} className="min-w-[250px] dark:bg-gray-900/70 flex-shrink-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center ">
                  <div className="text-4xl mb-4">{tip.icon}</div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{tip.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Accordion Layout */}
        <TabsContent value="accordion">
          <Accordion type="multiple" className="space-y-4 mt-6">
            {ecoTips.map((tip, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-xl">
                <AccordionTrigger className="flex justify-between items-center p-4 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <span>{tip.title}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={checkedTips.includes(i)}
                    onChange={() => toggleCheck(i)}
                    className="w-5 h-5 text-emerald-500"
                  />
                </AccordionTrigger>
                <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">{tip.desc}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </section>
  );
}

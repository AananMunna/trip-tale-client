import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the best season to visit Sylhet?",
    answer: "The best time to visit Sylhet is from October to March when the weather is cool and the tea gardens are lush and green.",
  },
  {
    question: "Do I need a guide for eco-tourism trips?",
    answer: "Hiring a local guide is highly recommended. They can help you discover hidden spots safely and provide cultural insights.",
  },
  {
    question: "Are the packages family-friendly?",
    answer: "Yes, all our packages are designed to accommodate families with children, including activities suitable for all ages.",
  },
  {
    question: "Can I customize my itinerary?",
    answer: "Absolutely! Our team works with you to tailor the travel plan according to your preferences, interests, and time.",
  },
  {
    question: "How can I book a package?",
    answer: "You can book directly through our website by selecting a package and clicking 'View Package', then follow the secure booking process.",
  },
  {
    question: "Do you provide accommodation?",
    answer: "Yes, most packages include eco-certified accommodations. You will get detailed info in the package description.",
  },
];

export default function FAQSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 my-20 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-500">
      <h2 className="text-4xl font-extrabold text-center mb-12 tracking-tight text-gray-900 dark:text-white">
        ❓ Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`} className="border rounded-xl">
            <AccordionTrigger className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="p-4 text-gray-700 dark:text-gray-300">{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

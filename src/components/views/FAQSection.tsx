"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MinusCircle, ArrowRight, PlusCircle } from "lucide-react";
import type { FAQItem } from "@/types/misc";

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: "What is Afrivendor?",
    answer:
      "Afrivendor is a comprehensive platform that connects African vendors and businesses with customers worldwide, providing tools to manage inventory, payments, and customer relationships seamlessly.",
  },
  {
    id: "2",
    question: "How does Afrivendor work?",
    answer:
      "Afrivendor works by allowing vendors to set up their digital storefront, list products, manage orders, and handle payments all in one place. Customers can browse, purchase, and track orders easily.",
  },
  {
    id: "3",
    question: "Is Afrivendor an e-commerce store?",
    answer:
      "Yes, Afrivendor is a full-featured e-commerce platform designed specifically for African vendors and businesses to sell their products and services online.",
  },
  {
    id: "4",
    question: "How do I become a vendor?",
    answer:
      "To become a vendor, simply sign up on our platform, complete your business profile, verify your identity, and start listing your products. Our team will guide you through each step.",
  },
  {
    id: "5",
    question: "How are payments handled?",
    answer:
      "Payments are processed securely through multiple payment methods including card payments, mobile money, and bank transfers. You receive payouts to your account after each transaction minus our service fee.",
  },
  {
    id: "6",
    question: "Are vendors verified?",
    answer:
      "Yes, all vendors go through a verification process to ensure authenticity and build trust with customers. We verify business information and seller credentials.",
  },
];

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-6 sm:px-8 lg:px-24 bg-[#F7F4F2]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="flex flex-col justify-between ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold font-unbounded text-secondary-000 leading-[125%] mb-8">
                Frequently Asked <br /> Questions?
              </h2>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#FFFCFB] flex flex-col items-start gap-5 rounded-2xl p-6 lg:max-w-[600px] "
            >
              <h3 className="text-xl font-semibold text-secondary-000 leading-[160%] tracking-[-0.2px]">Still Have Questions?</h3>
              <p className="text-accent-80 text-base font-normal leading-[150%] tracking-[-0.16px]">
                Didn't find the answer you were looking for? Our team is always here to help. Whether you're a vendor trying to grow your
                business or a customer looking for the right service, we'll make sure you get the support you need.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2.5 bg-primary-100 text-secondary-800 px-6 py-2.5 rounded-full font-bold text-lg tracking-[-0.2px] transition-colors cursor-pointer"
              >
                Send a mail
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Section - FAQ Items */}
          <div className="space-y-2 md:space-y-4">
            <AnimatePresence>
              {faqItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border border-gray-200 bg-[#FFFCFB] rounded-2xl  overflow-hidden"
                >
                  <motion.button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F7F4F2] transition-colors cursor-pointer"
                    whileHover={{ backgroundColor: "#F7F4F2" }}
                  >
                    <span className="font-semibold text-lg text-secondary-000 tracking-[-0.18px] flex-1">{item.question}</span>
                    <motion.div
                      animate={{
                        rotate: expandedId === item.id ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="shrink-0 ml-4 text-secondary-000"
                    >
                      {expandedId === item.id ? <MinusCircle size={20} /> : <PlusCircle size={20} />}
                    </motion.div>
                  </motion.button>

                  {/* Expandable Answer */}
                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-gray-200 text-accent-80 text-base leading-normal tracking-[-1%]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

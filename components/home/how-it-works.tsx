"use client";

import { Upload, Sparkles, FileText, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants, easeOut } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: easeOut,
    },
  }),
};

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Upload Your PDF",
      description:
        "Drag and drop your academic papers, reports, or articles. We support large file sizes and all standard formats.",
    },
    {
      icon: (
        <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      ),
      title: "AI Analyzes Content",
      description:
        "Our AI engine uses NLP and semantic understanding to extract key points and meaningful structure.",
    },
    {
      icon: (
        <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      ),
      title: "Summary Generated",
      description:
        "Receive a clean, digestible summary in seconds — great for quick review or deeper insights.",
    },
    {
      icon: (
        <Download className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
      ),
      title: "Read or Download",
      description:
        "Access your summary in the dashboard or download it in one click for future use.",
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-gray-950 py-20 lg:py-28 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
            How It{" "}
            <span className="text-indigo-600 dark:text-indigo-400">Works</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed">
            From upload to summary in seconds — explore our intelligent 4-step
            process.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={idx}
              className="
                flex flex-col items-center text-center px-6 py-8
                bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md
                border border-gray-200 dark:border-gray-800
                transition-all duration-300 ease-out
                cursor-pointer
                md:hover:scale-[1.05] md:hover:z-10
                md:hover:border-indigo-400 dark:md:hover:border-indigo-500
                md:hover:shadow-xl
                md:hover:ring-2 md:hover:ring-indigo-300 dark:md:hover:ring-indigo-700
              "
            >
              <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

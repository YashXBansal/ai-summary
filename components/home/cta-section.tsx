"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="w-full bg-white dark:bg-gray-950 py-16 sm:py-20 px-4 sm:px-8 border-t border-gray-200 dark:border-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center font-sans"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-snug sm:leading-tight mb-4">
          Start Summarizing in Seconds
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-relaxed font-medium mb-8">
          Upload your PDF and get a crisp, AI-generated summary — fast,
          accurate, and effortless.
        </p>

        <div className="flex justify-center mt-4 sm:mt-6">
          <Button
            asChild
            size="lg"
            className="px-8 sm:px-10 py-4 sm:py-5 text-sm sm:text-base font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            <Link href="/upload">Get Started Free</Link>
          </Button>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">
          No signup required. Upgrade only when you're ready.
        </p>
      </motion.div>
    </section>
  );
}

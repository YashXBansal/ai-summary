"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "I had a 200-page research paper to review for a project meeting. This tool summarized it in minutes. Absolute game-changer!",
    name: "Dr. Andrew Joy",
    designation: "Research Scientist at BioGenix",
    src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=3600&auto=format&fit=crop",
  },
  {
    quote:
      "As a law student, I’m constantly flooded with case files. This app helps me extract key points quickly, saving hours each week.",
    name: "Rohan Kapoor",
    designation: "LLB Student at Delhi University",
    src: "https://images.unsplash.com/photo-1669791332100-f06dee9d1bb1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Summarizing technical whitepapers used to take me all night. Now it’s done in seconds. The summaries are surprisingly accurate.",
    name: "Aarti Singh",
    designation: "Machine Learning Engineer at Zentech",
    src: "https://images.unsplash.com/photo-1581092582520-3da64a3c0d4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const AnimatedTestimonials = dynamic(
  () =>
    import("@/components/ui/animated-testimonials").then(
      (mod) => mod.AnimatedTestimonials
    ),
  {
    ssr: false,
    loading: () => <p className="text-center">Loading testimonials...</p>,
  }
);

export default function AboutPage() {
  return (
    <main className="bg-gradient-to-br from-white via-slate-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 antialiased">
      {/* Hero */}
      <section className="py-24 px-6 sm:px-12 lg:px-32 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Empowering Minds, <span className="text-indigo-600">One Summary</span> at a Time
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-10">
          Helping professionals, students, and researchers summarize lengthy PDFs instantly using AI.
        </p>
        <Link
          href="/upload"
          className="inline-block bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition"
        >
          Get Started
        </Link>
      </section>

      <section className="relative py-20 px-6 sm:px-12 lg:px-32 bg-gradient-to-br from-indigo-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100/20 via-indigo-100/30 to-transparent dark:from-pink-900/10 dark:via-indigo-900/10 pointer-events-none blur-3xl" />

  <h2 className="text-4xl font-extrabold text-center mb-16 z-10 relative">
    Our Principles
  </h2>

  <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 relative z-10">
    {[
      {
        title: "AI for Good",
        text: "Built with the intention to save time and fuel productivity.",
        badge: "Ethical AI",
      },
      {
        title: "Privacy-First",
        text: "All documents are processed securely with zero tracking.",
        badge: "Data Safe",
      },
      {
        title: "Crafted with Care",
        text: "Solo-developed with love, passion, and user empathy.",
        badge: "Personal Touch",
      },
    ].map((item) => (
      <div
        key={item.title}
        className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center shadow-lg transform transition duration-300 hover:scale-[1.05] hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80"
      >
        <Badge className="mb-3 bg-indigo-100 dark:bg-indigo-600 text-indigo-700 dark:text-white px-3 py-1 rounded-full text-sm group-hover:scale-110 group-hover:rotate-1 transition-transform duration-300 ease-out">
          {item.badge}
        </Badge>
        <h3 className="text-2xl font-semibold mb-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-base">
          {item.text}
        </p>
      </div>
    ))}
  </div>
</section>

      {/* Creator Highlight */}
      <section className="py-24 px-6 sm:px-12 lg:px-32 text-center">
        <h2 className="text-3xl font-bold mb-10">Meet the Creator</h2>
        <div className="flex justify-center mb-6">
          <div className="w-44 h-44 sm:w-52 sm:h-52 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border-4 border-indigo-500 shadow-xl">
            <Image
              src="/Image.jpg"
              alt="Yash Bansal"
              width={208}
              height={208}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold">Yash Bansal</h3>
          <p className="text-gray-700 dark:text-gray-300 text-base mt-2">
            I’m a solo developer passionate about making AI tools accessible, fast, and actually useful. This product is built, maintained, and refined by me with love.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 sm:px-12 lg:px-32 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">What People Are Saying</h2>
        <AnimatedTestimonials testimonials={testimonials} />
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 sm:px-12 lg:px-32 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Ready to simplify your documents?
        </h2>
        <Link
          href="/upload"
          className="inline-block bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition"
        >
          Upload Your PDF
        </Link>
      </section>
    </main>
  );
}

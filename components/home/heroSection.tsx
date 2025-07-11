import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="w-full py-16 lg:py-24">
      <div className="container mx-auto px-6 text-center">
        {/* Gradient Badge with Lucide Icon */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4 shadow-md">
          <Sparkles className="w-5 h-5 mr-1 animate-pulse" />
          AI-Powered Text Summarization
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white max-w-3xl mx-auto leading-tight">
          Summarize PDFs in Seconds with <span className="text-indigo-600">AI</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-base sm:text-lg">
          Upload your academic papers, reports, or lengthy articles and get concise, accurate summaries instantly.
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex justify-center">
          <Link href="/#pricing">
            <Button className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white px-6 py-3 text-sm sm:text-base font-semibold shadow-lg">
              Try Summarizing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

import { FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DemoSection() {
  return (
    <section className="w-full bg-white dark:bg-gray-950 py-20 lg:py-28 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Experience the Power of <span className="text-indigo-600 dark:text-indigo-400">AI Summarization</span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed">
            Watch how AI turns complex documents into crystal-clear summaries. Try it with a sample to see it live.
          </p>
        </div>

        {/* Demo Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Document */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Original Document
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think like humans and mimic their actions. AI applications include expert systems, natural language processing (NLP), speech recognition, and machine vision...
            </p>
          </div>

          {/* AI Summary */}
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-900/5 p-6 rounded-2xl shadow-md border border-indigo-100 dark:border-indigo-800">
            <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI-Generated Summary
            </h3>
            <p className="text-sm text-indigo-800 dark:text-indigo-100 leading-relaxed">
              AI enables machines to mimic human thinking to perform tasks such as understanding language, recognizing speech, and making informed decisions.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-lg px-8 py-4 text-base sm:text-lg font-semibold"
          >
            <Link href="/upload">Upload Your PDF</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

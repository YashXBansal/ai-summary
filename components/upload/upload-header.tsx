import { UploadCloud } from "lucide-react";
export function UploadHeader() {
  return (
    <div>
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
        Effortless AI-Powered Summarization
      </h1>

      {/* Subheading */}
      <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
        Upload your PDFs—research papers, reports, or lengthy docs—and let AI
        break them down into powerful insights in seconds.
      </p>

      {/* Optional note */}
    </div>
  );
}

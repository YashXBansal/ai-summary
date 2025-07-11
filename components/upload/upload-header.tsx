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

      {/* Upload Box */}
      {/* <div className="mt-10 bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl px-6 py-14 sm:px-10 text-gray-600 dark:text-gray-400 shadow-xl transition-all hover:border-indigo-500 dark:hover:border-indigo-400">
        <div className="flex flex-col items-center justify-center gap-4">
          <UploadCloud className="w-12 h-12 text-indigo-500 animate-bounce-slow" />
          <p className="text-sm sm:text-base">
            Drag & drop your PDF here or{" "}
            <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
              browse files
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Max size: 10MB · PDF only
          </p>

        //   {/* Replace this with real file upload logic */}
          {/* <button className="mt-6 px-6 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold rounded-md transition">
            Upload PDF
          </button>
        </div>
      </div> */}

      {/* Optional note */}
      
    </div>
  );
}

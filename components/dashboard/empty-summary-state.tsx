import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptySummaryState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="bg-fuchsia-100 dark:bg-fuchsia-900/20 p-4 rounded-full mb-6">
        <FileText className="h-10 w-10 text-fuchsia-600 dark:text-fuchsia-400" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
        No Summaries Yet
      </h2>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mb-6">
        Looks like you haven't created any summaries yet. Upload a PDF and we'll
        turn it into a smart summary for you.
      </p>

      <Link href="/upload" className="w-full sm:w-auto">
        <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 transition-all shadow-md hover:shadow-lg px-5 py-2 rounded-md text-sm font-medium">
          Upload a PDF
        </Button>
      </Link>
    </div>
  );
}

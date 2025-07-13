import { Card } from "@/components/ui/card";
import DeleteButton from "./delete-button";
import { FileText } from "lucide-react";
import { cn, formatFileName } from "@/lib/utils";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// ✅ Status Badge
const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      "px-3 py-1 text-xs font-medium rounded-full capitalize w-fit",
      status === "completed"
        ? "bg-green-100 text-green-700"
        : status === "processing"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    )}
  >
    {status}
  </span>
);

// ✅ Summary Header
const SummaryHeader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string;
  title: string;
  createdAt: string;
}) => (
  <div className="flex items-start gap-2 flex-1 min-w-0">
    <FileText className="w-5 h-5 text-fuchsia-500 mt-1 shrink-0" />
    <div className="min-w-0">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate max-w-[18ch] sm:max-w-[24ch] lg:max-w-[30ch]">
        {title || formatFileName(fileUrl)}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 truncate">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </p>
    </div>
  </div>
);

// ✅ Summary Card Component
export default function SummaryCard({ summary }: { summary: any }) {
  return (
    <Card className="relative h-full shadow-md border border-white/20 backdrop-blur-md bg-white/80 dark:bg-black/20 rounded-2xl transition-all hover:shadow-lg hover:scale-[1.015]">
      {/* Header + Delete Button Row */}
      <div className="flex items-start justify-between p-4 sm:p-6 pb-0">
        <SummaryHeader
          fileUrl={summary.original_file_url}
          title={summary.title}
          createdAt={summary.created_at}
        />
        <div className="shrink-0 -mt-1 ml-2">
          <DeleteButton summaryId={summary.id} />
        </div>
      </div>

      {/* Card content link */}
      <Link href={`/summaries/${summary.id}`} className="block p-4 sm:p-6 pt-3">
        <div className="flex flex-col gap-3 sm:gap-4 h-full">
          {/* Summary Preview */}
          <p className="text-gray-600 text-sm sm:text-[15px] leading-relaxed line-clamp-4 pl-1">
            {summary.summary_text}
          </p>

          {/* Status */}
          <div className="mt-4 flex justify-between items-center">
            <StatusBadge status={summary.status} />
          </div>
        </div>
      </Link>
    </Card>
  );
}

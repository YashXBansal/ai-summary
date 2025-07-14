"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import removeMarkdown from "remove-markdown";
import { Download } from "lucide-react";
import { ArrowLeft, Share2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import BgGradient from "@/components/common/bg-gradient";
import DownloadSummaryButton from "@/components/dashboard/download-summary-button";

interface SummaryPageProps {
  summary: {
    title: string;
    summary_text: string;
    status: string;
    created_at: string;
    file_name: string;
    original_file_url?: string;
  };
}

export function SummaryPage({ summary }: SummaryPageProps) {
  const wordCount = removeMarkdown(summary.summary_text || "")
    .trim()
    .split(/\s+/).length;

  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 150));

  const handleShare = async () => {
    const shareText = `📄 Summary: ${summary.title}\n\n${summary.summary_text}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: summary.title, text: shareText });
        toast.success("Summary shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Copied to clipboard");
      }
    } catch {
      toast.error("Failed to share summary");
    }
  };

  return (
    <>
      <div className=" lg:max-w-7xl mx-auto px-4 py-2">
        {/* AI Summary Badge */}
        <div className="mb-10 flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2 animate-fade-in-up">
            <Sparkles
              className="text-indigo-500 dark:text-indigo-400 drop-shadow-md animate-pulse"
              size={24}
            />
            <h2 className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              AI Generated Summary
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            This summary was created by AI to give you a quick understanding of
            the document’s key insights.
          </p>
        </div>

        {/* Summary Container */}
        <BgGradient>
          <div className="backdrop-blur-xl border border-white/20 rounded-3xl bg-white/60 dark:bg-black/40 shadow-2xl p-6 sm:p-8 md:p-10 space-y-8">
            {/* Back Button */}
            <div>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft size={16} /> Back to Dashboard
                </Button>
              </Link>
            </div>

            {/* Header Section */}
            <div className="grid sm:grid-cols-2 gap-4 sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">
                  {summary.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Uploaded{" "}
                  {formatDistanceToNow(new Date(summary.created_at), {
                    addSuffix: true,
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  📁 <span className="font-medium">{summary.file_name}</span>
                </p>

                {summary.original_file_url && (
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <Link
                      href={summary.original_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      📄 View Original PDF
                    </Link>

                    <DownloadSummaryButton
                      title={summary.title}
                      summaryText={summary.summary_text}
                      file_name={summary.file_name}
                      createdAt={summary.created_at}
                    />
                  </div>
                )}

                <p className="text-sm text-muted-foreground mt-1">
                  📝 Word Count:{" "}
                  <span className="font-semibold">{wordCount}</span>
                  {" · "}
                  ⏱️ {""}
                  <span className="font-semibold">
                    {readingTimeMinutes} mins read
                  </span>
                </p>
              </div>

              {/* Status & Share */}
              <div className="flex sm:flex-col gap-3 sm:items-end">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-sm",
                    summary.status === "completed"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                  )}
                >
                  {summary.status === "completed"
                    ? "✅ Completed"
                    : "⌛ Processing"}
                </Badge>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleShare}
                  className="gap-1"
                >
                  <Share2 size={16} /> Share
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-1 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

            {/* Markdown Summary */}
            <article
              id="summary-content"
              className={cn(
                "prose dark:prose-invert max-w-none",
                "prose-p:text-[1.05rem] prose-p:leading-relaxed",
                "prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h1:underline decoration-indigo-500",
                "prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:underline decoration-violet-500",
                "prose-h3:text-xl prose-h3:font-medium prose-h3:mt-4 prose-h3:mb-2 prose-h3:underline decoration-pink-500",
                "prose-ul:pl-5 prose-li:marker:text-indigo-500 prose-li:my-1 prose-li:text-base prose-li:leading-snug",
                "prose-strong:text-black dark:prose-strong:text-white",
                "prose-code:bg-muted/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono"
              )}
            >
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {summary.summary_text}
              </ReactMarkdown>
            </article>
          </div>
        </BgGradient>
      </div>
    </>
  );
}

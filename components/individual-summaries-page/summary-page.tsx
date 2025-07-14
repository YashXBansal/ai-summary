"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import removeMarkdown from "remove-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const handleShare = async () => {
    const shareText = `📄 Summary: ${summary.title}\n\n${summary.summary_text}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: summary.title,
          text: shareText,
        });
        toast.success("Summary shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Copied to clipboard (fallback)");
      }
    } catch (error) {
      toast.error("Failed to share summary");
    }
  };

  function countWords(text: string): number {
    const plainText = removeMarkdown(text || "");
    return plainText.trim().split(/\s+/).length;
  }
  const wordCount = countWords(summary.summary_text);
  return (
    <div className="max-w-4xl mx-auto backdrop-blur-xl border border-white/20 rounded-3xl bg-white/60 dark:bg-black/40 shadow-2xl p-8 md:p-12">
      {/* Back */}
      <div className="mb-6 flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft size={16} /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Title and Info */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">
            {summary.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Uploaded{" "}
            {formatDistanceToNow(new Date(summary.created_at), {
              addSuffix: true,
            })}{" "}
            · <span className="font-semibold">{summary.file_name}</span>
          </p>
          {summary.original_file_url && (
            <Link
              href={summary.original_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              📄 View Original PDF
            </Link>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            📝 Word Count: <span className="font-semibold">{wordCount}</span>
          </p>
        </div>

        {/* Status & Share */}
        <div className="flex flex-col sm:items-end gap-2">
          <Badge
            variant="outline"
            className={cn(
              "self-start text-sm",
              summary.status === "completed"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
            )}
          >
            {summary.status === "completed" ? "✅ Completed" : "⌛ Processing"}
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

      <div className="w-full h-1 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 mb-6" />

      {/* Summary Body */}
      <article className="prose dark:prose-invert prose-neutral sm:prose-base lg:prose-lg xl:prose-xl max-w-none prose-p:leading-relaxed prose-h2:text-indigo-600 dark:prose-h2:text-indigo-400 prose-h2:font-semibold prose-h3:text-purple-600 dark:prose-h3:text-purple-400">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {summary.summary_text}
        </ReactMarkdown>
      </article>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import removeMarkdown from "remove-markdown";
import {
  ArrowLeft,
  Share2,
  Sparkles,
  FileText,
  Clock,
  AlignLeft,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import DownloadSummaryButton from "@/components/dashboard/download-summary-button";

import { SentimentCard } from "@/components/sentiment-card";
import { DocumentIntelligencePanel } from "@/components/document-intelligence-panel";
import { ChatPanel } from "./chat-panel";
// 🛠️ FIX: Import the new renderer
import { SmartSummaryRenderer } from "./smart-summary-renderer";

interface SummaryPageProps {
  summary: {
    id?: string;
    title: string;
    summary_text: string;
    status: string;
    created_at: string;
    file_name: string;
    original_file_url?: string;
    original_text?: string;
    sentiment?: any;
    intelligence?: any;
  };
}

export function SummaryPage({ summary }: SummaryPageProps) {
  const wordCount = removeMarkdown(summary.summary_text || "")
    .trim()
    .split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 150));
  const hasIntelligence = !!summary.intelligence?.documentType;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 dark:from-slate-950 dark:via-indigo-950/20 dark:to-violet-950/20">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-200/20 dark:bg-violet-900/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Top Nav Bar ── */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground group"
            >
              <ArrowLeft
                size={15}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="gap-1.5 h-8 text-xs"
            >
              <Share2 size={13} />
              Share
            </Button>
            <DownloadSummaryButton
              title={summary.title}
              summaryText={summary.summary_text}
              file_name={summary.file_name}
              createdAt={summary.created_at}
            />
          </div>
        </div>

        {/* ── Hero Header Card ── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-indigo-100/30 dark:shadow-indigo-900/20 p-6 sm:p-8">
          {/* Decorative gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-2">
            <div className="flex-1 min-w-0">
              {/* AI badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 mb-3">
                <Sparkles
                  size={12}
                  className="text-indigo-500 dark:text-indigo-400 animate-pulse"
                />
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  AI-Enhanced Summary
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight truncate">
                {summary.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText size={12} />
                  {summary.file_name}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {formatDistanceToNow(new Date(summary.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <AlignLeft size={12} />
                  {wordCount} words · {readingTimeMinutes} min read
                </span>
              </div>
            </div>

            {/* Status + optional PDF link */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <Badge
                variant="outline"
                className={cn(
                  "h-6 text-xs font-medium",
                  summary.status === "completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
                )}
              >
                {summary.status === "completed"
                  ? "✓ Completed"
                  : "⏳ Processing"}
              </Badge>

              {summary.original_file_url && (
                <Link
                  href={summary.original_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  View PDF
                  <ExternalLink size={11} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* ── LEFT: Smart Summary ── */}
          <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-slate-100/40 dark:shadow-slate-900/30">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Summary
              </span>
            </div>

            {/* 🛠️ FIX: Replaced ReactMarkdown with SmartSummaryRenderer */}
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <SmartSummaryRenderer summaryText={summary.summary_text} />
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="flex flex-col gap-5">
            {/* Analytics / Intelligence */}
            {hasIntelligence ? (
              <>
                {/* Sentiment */}
                <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
                    <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-pink-500 to-rose-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Sentiment
                    </span>
                  </div>
                  <div className="p-5">
                    <SentimentCard sentiment={summary.sentiment} />
                  </div>
                </div>

                {/* Document Intelligence */}
                <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
                    <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Document Intelligence
                    </span>
                  </div>
                  <div className="p-5">
                    <DocumentIntelligencePanel
                      intelligence={summary.intelligence}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 p-6 text-center space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  No advanced analytics
                </p>
                <p className="text-xs text-muted-foreground/70">
                  This summary was generated before AI intelligence features
                  were added.
                </p>
              </div>
            )}

            {/* Chat Panel */}
            <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Ask About This Doc
                </span>
              </div>
              <div className="p-4">
                <ChatPanel
                  documentText={summary.original_text || summary.summary_text}
                  summaryContext={summary.summary_text}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-center py-4 gap-1.5 text-xs text-muted-foreground/60">
          <Sparkles size={11} className="text-indigo-400" />
          <span>Generated by AI · Always verify critical information</span>
        </div>
      </div>
    </div>
  );
}

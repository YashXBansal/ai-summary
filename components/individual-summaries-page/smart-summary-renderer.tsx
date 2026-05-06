"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Section {
  emoji: string;
  heading: string;
  body: string;
}

// ─── Colour palette for section cards ────────────────────────────────────────

const SECTION_ACCENTS = [
  { border: "border-l-indigo-400", bg: "bg-indigo-50/60 dark:bg-indigo-950/20", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300", dot: "bg-indigo-400" },
  { border: "border-l-violet-400", bg: "bg-violet-50/60 dark:bg-violet-950/20", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300", dot: "bg-violet-400" },
  { border: "border-l-rose-400", bg: "bg-rose-50/60 dark:bg-rose-950/20", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300", dot: "bg-rose-400" },
  { border: "border-l-amber-400", bg: "bg-amber-50/60 dark:bg-amber-950/20", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300", dot: "bg-amber-400" },
  { border: "border-l-teal-400", bg: "bg-teal-50/60 dark:bg-teal-950/20", badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300", dot: "bg-teal-400" },
  { border: "border-l-sky-400", bg: "bg-sky-50/60 dark:bg-sky-950/20", badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300", dot: "bg-sky-400" },
];

// ─── Parser ───────────────────────────────────────────────────────────────────

const EMOJI_PREFIX_RE = /^([\p{Emoji_Presentation}\p{Extended_Pictographic}✨🔑🎯📌🔍💡📝🏗️⚙️📊🚀🛡️📋🌐⚡🎨🔧📐🗺️]+)\s*(.*)/u;

function parseSections(markdown: string): { sections: Section[]; preamble: string } {
  const lines = markdown.split("\n");
  const sections: Section[] = [];
  let preamble = "";
  let currentSection: Section | null = null;
  let bodyLines: string[] = [];

  const flush = () => {
    if (currentSection) {
      currentSection.body = bodyLines.join("\n").trim();
      sections.push(currentSection);
      currentSection = null;
      bodyLines = [];
    }
  };

  let preambleLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (currentSection) bodyLines.push("");
      else preambleLines.push("");
      continue;
    }

    let isNewSection = false;
    let rawHeadingText = "";

    // 1. Is it a standard Markdown Header? (## or ###)
    const mdMatch = /^#{2,3}\s+(.+)$/.exec(line);
    
    // 2. Is it a fully bolded line? (e.g., "**Overview**")
    const boldMatch = /^\*\*\s*(.+)\s*\*\*$/.exec(line);

    if (mdMatch) {
      isNewSection = true;
      rawHeadingText = mdMatch[1];
    } else if (boldMatch) {
      const innerText = boldMatch[1];
      // ONLY make it a new card if it has an emoji OR is a very short title
      if (EMOJI_PREFIX_RE.test(innerText) || innerText.length < 35) {
        isNewSection = true;
        rawHeadingText = innerText;
      }
    }

    if (isNewSection) {
      flush();

      // Clean up the text
      rawHeadingText = rawHeadingText.replace(/\*/g, "").trim();

      let emoji = "📄"; // Default emoji
      let headingText = rawHeadingText;

      // Extract the emoji if it exists
      const emojiMatch = EMOJI_PREFIX_RE.exec(rawHeadingText);
      if (emojiMatch) {
        emoji = emojiMatch[1];
        headingText = emojiMatch[2];
      }

      // Capitalize first letter safely
      if (headingText.length > 0) {
        headingText = headingText.charAt(0).toUpperCase() + headingText.slice(1);
      }

      currentSection = { emoji, heading: headingText.trim(), body: "" };
      continue;
    }

    // If it's not a new section, push it to the current body
    if (currentSection) {
      bodyLines.push(lines[i]); 
    } else {
      preambleLines.push(lines[i]);
    }
  }

  flush();
  preamble = preambleLines.join("\n").trim();

  return { sections, preamble };
}

// ─── Sub-renderers ────────────────────────────────────────────────────────────

function BulletItem({ text, accentDot }: { text: string; accentDot: string }) {
  // Numbered list (e.g., "1. First point")
  const numMatch = /^(\d+\.)\s+(.+)/.exec(text);
  if (numMatch) {
    return (
      <li className="flex items-start gap-3 py-1.5">
        <span className="mt-[2px] shrink-0 text-sm font-bold text-slate-400 dark:text-slate-500 w-4 text-right">
          {numMatch[1]}
        </span>
        <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 flex-1">
          <InlineMarkdown text={numMatch[2]} />
        </span>
      </li>
    );
  }

  // Standard bullet point
  const clean = text.replace(/^[-*]\s+/, "");
  return (
    <li className="flex items-start gap-2.5 py-1.5">
      <span className={cn("mt-[8px] shrink-0 w-[6px] h-[6px] rounded-full", accentDot)} />
      <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <InlineMarkdown text={clean} />
      </span>
    </li>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    
    if (match[2]) {
      parts.push(<strong key={match.index} className="font-bold text-slate-900 dark:text-white"><em>{match[2]}</em></strong>);
    } else if (match[3]) {
      parts.push(<strong key={match.index} className="font-semibold text-slate-900 dark:text-white">{match[3]}</strong>);
    } else if (match[4]) {
      parts.push(<em key={match.index}>{match[4]}</em>);
    } else if (match[5]) {
      parts.push(<code key={match.index} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[0.82em]">{match[5]}</code>);
    }
    
    last = match.index + match[0].length;
  }
  
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function SectionBody({ body, accent }: { body: string; accent: (typeof SECTION_ACCENTS)[0] }) {
  if (!body) return null;

  const lines = body.split("\n");
  const nodes: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let paraBuffer: string[] = [];
  let keyIdx = 0;

  const flushBullets = () => {
    if (bulletBuffer.length) {
      nodes.push(
        <ul key={`ul-${keyIdx++}`} className="space-y-0.5 my-3 list-none p-0">
          {bulletBuffer.map((b, i) => <BulletItem key={i} text={b} accentDot={accent.dot} />)}
        </ul>
      );
      bulletBuffer = [];
    }
  };

  const flushPara = () => {
    const text = paraBuffer.join(" ").trim();
    if (text) {
      nodes.push(
        <p key={`p-${keyIdx++}`} className="text-sm leading-[1.85] text-slate-700 dark:text-slate-300 my-2">
          <InlineMarkdown text={text} />
        </p>
      );
    }
    paraBuffer = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) { flushPara(); flushBullets(); continue; }

    // Catch deep headings (#### Subheading) OR bolded lines inside the body
    const subHeadingMd = /^#{4,6}\s+(.+)/.exec(line);
    const boldSubheading = /^\*\*\s*(.+)\s*\*\*$/.exec(line);

    if (subHeadingMd) {
      flushBullets(); flushPara();
      nodes.push(
        <h4 key={`h4-${keyIdx++}`} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-5 mb-2">
          <InlineMarkdown text={subHeadingMd[1].replace(/\*/g, '')} />
        </h4>
      );
      continue;
    }

    // Treat pure bold lines inside a card as a sub-heading, not a new card!
    if (boldSubheading && line.length < 60) {
      flushBullets(); flushPara();
      nodes.push(
        <h4 key={`h4-bold-${keyIdx++}`} className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-5 mb-2">
          <InlineMarkdown text={boldSubheading[1]} />
        </h4>
      );
      continue;
    }

    if (/^([-*]|\d+\.)\s/.test(line)) {
      flushPara();
      bulletBuffer.push(line);
      continue;
    }

    flushBullets(); 
    paraBuffer.push(line);
  }

  flushBullets(); 
  flushPara();

  return <div className="space-y-0">{nodes}</div>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SmartSummaryRendererProps { summaryText: string; className?: string; }

export function SmartSummaryRenderer({ summaryText, className }: SmartSummaryRendererProps) {
  const { sections, preamble } = useMemo(() => parseSections(summaryText), [summaryText]);

  if (sections.length === 0) {
    return (
      <article className={cn("prose prose-slate dark:prose-invert max-w-none prose-p:text-[1rem] prose-p:leading-[1.8] prose-h2:text-xl prose-h2:font-semibold prose-li:marker:text-indigo-400", className)}>
        <ReactMarkdown>{summaryText}</ReactMarkdown>
      </article>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      {preamble && (
        <div className="text-sm leading-[1.85] text-slate-600 dark:text-slate-400 px-1 mb-4">
          {preamble.split('\n').map((para, i) => (
            <p key={i} className="mb-2 last:mb-0"><InlineMarkdown text={para} /></p>
          ))}
        </div>
      )}
      
      {sections.map((section, idx) => {
        const accent = SECTION_ACCENTS[idx % SECTION_ACCENTS.length];
        return (
          <div key={idx} className={cn("rounded-xl border-l-[3px] border border-slate-100 dark:border-white/[0.06] shadow-sm hover:shadow-md transition-shadow duration-200", accent.border, accent.bg)}>
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100/80 dark:border-white/[0.05]">
              <span className="text-xl leading-none">{section.emoji}</span>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">{section.heading}</h3>
            </div>
            <div className="px-5 py-4">
              <SectionBody body={section.body} accent={accent} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { DocumentIntelligence } from "@/utils/document-intelligence";

interface Props {
  intelligence: DocumentIntelligence;
}

const READABILITY_COLORS: Record<string, string> = {
  Simple: "#22c55e",
  Intermediate: "#3b82f6",
  Advanced: "#f59e0b",
  Expert: "#ef4444",
};

const DOC_TYPE_ICONS: Record<string, string> = {
  "Research Paper": "🔬",
  "Legal Contract": "⚖️",
  "Financial Report": "📈",
  "Technical Manual": "⚙️",
  "Business Proposal": "💼",
  "Academic Thesis": "🎓",
  "News Article": "📰",
  "Policy Document": "📋",
  "Medical Report": "🏥",
  "General Document": "📄",
};

export function DocumentIntelligencePanel({ intelligence }: Props) {
  const readColor =
    READABILITY_COLORS[intelligence.readabilityLevel] || "#94a3b8";
  const docIcon = DOC_TYPE_ICONS[intelligence.documentType] || "📄";

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatChip
          icon="📝"
          label="Words"
          value={intelligence.wordCount.toLocaleString()}
        />
        <StatChip
          icon="⏱️"
          label="Read Time"
          value={`~${intelligence.estimatedReadTime} min`}
        />
        <StatChip
          icon={docIcon}
          label="Doc Type"
          value={intelligence.documentType}
          small
        />
        <StatChip
          icon="📖"
          label="Readability"
          value={intelligence.readabilityLevel}
          valueColor={readColor}
        />
      </div>

      {/* Topics */}
      {intelligence.topics?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">
            Topics
          </p>
          <div className="flex flex-wrap gap-2">
            {intelligence.topics.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {intelligence.keywords?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">
            Key Terms
          </p>
          <div className="flex flex-wrap gap-2">
            {intelligence.keywords.slice(0, 12).map((kw) => (
              <KeywordChip
                key={kw.keyword}
                keyword={kw.keyword}
                relevance={kw.relevance}
                category={kw.category}
              />
            ))}
          </div>
        </div>
      )}

      {/* Readability bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Readability Score</span>
          <span style={{ color: readColor }} className="font-medium">
            {intelligence.readabilityScore}/100
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${intelligence.readabilityScore}%`,
              background: readColor,
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          <span>Expert</span>
          <span>Simple</span>
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
  valueColor,
  small,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
  small?: boolean;
}) {
  return (
    <div className="bg-muted/50 rounded-xl p-3 border border-border">
      <p className="text-xs text-muted-foreground mb-1">
        {icon} {label}
      </p>
      <p
        className={`font-semibold leading-tight ${small ? "text-xs" : "text-sm"}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  concept: { bg: "rgba(99,102,241,0.1)", text: "#818cf8" },
  entity: { bg: "rgba(236,72,153,0.1)", text: "#f472b6" },
  technical: { bg: "rgba(20,184,166,0.1)", text: "#2dd4bf" },
  action: { bg: "rgba(245,158,11,0.1)", text: "#fbbf24" },
};

function KeywordChip({
  keyword,
  relevance,
  category,
}: {
  keyword: string;
  relevance: number;
  category: string;
}) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.concept;
  const opacity = 0.5 + relevance / 200; // scale opacity by relevance

  return (
    <span
      className="px-2.5 py-1 rounded-lg text-xs font-medium cursor-default"
      style={{ background: style.bg, color: style.text, opacity }}
      title={`Relevance: ${relevance}% · ${category}`}
    >
      {keyword}
    </span>
  );
}

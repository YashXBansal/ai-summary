
"use client";

import { SentimentResult } from "@/utils/sentiment-analysis";

interface SentimentCardProps {
  sentiment: SentimentResult;
}

const LABEL_CONFIG = {
  positive: {
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.3)",
    emoji: "😊",
    label: "Positive",
  },
  negative: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    emoji: "😟",
    label: "Negative",
  },
  neutral: {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.3)",
    emoji: "😐",
    label: "Neutral",
  },
  mixed: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    emoji: "🤔",
    label: "Mixed",
  },
};

export function SentimentCard({ sentiment }: SentimentCardProps) {
  const cfg = LABEL_CONFIG[sentiment.label] || LABEL_CONFIG.neutral;

  return (
    <div
      className="rounded-2xl border p-5 space-y-4"
      style={{ borderColor: cfg.border, background: cfg.bg }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{cfg.emoji}</span>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Sentiment Analysis
            </p>
            <p className="text-lg font-bold" style={{ color: cfg.color }}>
              {cfg.label}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Confidence</p>
          <p className="text-sm font-semibold">
            {Math.round(sentiment.score * 100)}%
          </p>
        </div>
      </div>

      {/* Score bars */}
      <div className="space-y-2">
        <ScoreBar
          label="Positive"
          score={sentiment.positiveScore}
          color="#22c55e"
        />
        <ScoreBar
          label="Neutral"
          score={sentiment.neutralScore}
          color="#94a3b8"
        />
        <ScoreBar
          label="Negative"
          score={sentiment.negativeScore}
          color="#ef4444"
        />
      </div>

      {/* Dominant tone */}
      <div className="text-sm">
        <span className="text-muted-foreground">Dominant Tone: </span>
        <span className="font-medium">{sentiment.dominantTone}</span>
      </div>

      {/* Emotion tags */}
      <div className="flex flex-wrap gap-2">
        {sentiment.emotions.map((emotion) => (
          <span
            key={emotion}
            className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
            style={{
              background: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
            }}
          >
            {emotion}
          </span>
        ))}
      </div>

      {/* Summary */}
      <p
        className="text-sm text-muted-foreground leading-relaxed border-t pt-3"
        style={{ borderColor: cfg.border }}
      >
        {sentiment.summary}
      </p>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs w-16 text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs w-8 text-right font-medium">{score}%</span>
    </div>
  );
}

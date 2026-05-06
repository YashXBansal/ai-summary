import { GoogleGenerativeAI } from "@google/generative-ai";

export type SentimentLabel = "positive" | "negative" | "neutral" | "mixed";

export interface SentimentResult {
  label: SentimentLabel;
  score: number; // 0.0 - 1.0 confidence
  positiveScore: number; // 0-100
  negativeScore: number; // 0-100
  neutralScore: number; // 0-100
  emotions: string[]; // e.g. ["analytical", "confident", "cautious"]
  dominantTone: string; // e.g. "Academic & Informative"
  summary: string; // 1-2 sentence human-readable sentiment summary
}

const SENTIMENT_PROMPT = `
You are a sentiment and tone analysis engine. Analyze the following text extracted from a PDF document and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:

{
  "label": "positive" | "negative" | "neutral" | "mixed",
  "score": <float 0.0 to 1.0, confidence in the label>,
  "positiveScore": <integer 0-100>,
  "negativeScore": <integer 0-100>,
  "neutralScore": <integer 0-100>,
  "emotions": [<array of 2-4 tone descriptors, e.g. "analytical", "optimistic", "critical", "formal", "cautious", "confident", "urgent", "persuasive">],
  "dominantTone": <short phrase describing overall tone, e.g. "Academic & Informative" or "Critical & Skeptical">,
  "summary": <1-2 sentence human-readable summary of the document's sentiment and tone>
}

Rules:
- positiveScore + negativeScore + neutralScore should approximately sum to 100
- "mixed" label means significant presence of both positive and negative signals
- Be precise and document-type aware (legal docs are neutral, not negative just because they discuss risks)
- Emotions should be professional descriptors, not casual words

TEXT TO ANALYZE:
`;

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  if (!process.env.GEMINI_API_KEY && !process.env.AI_API_KEY) {
    throw new Error(
      "Missing GEMINI_API_KEY or AI_API_KEY environment variable",
    );
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "";

  // Truncate text to ~3000 words to stay within token limits
  const truncated = text.split(" ").slice(0, 3000).join(" ");

  const genAI = new GoogleGenerativeAI(apiKey);
  // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const result = await model.generateContent(SENTIMENT_PROMPT + truncated);
  const raw = result.response.text().trim();

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, "").trim();

  const parsed: SentimentResult = JSON.parse(clean);
  return parsed;
}

// Lightweight rule-based fallback (no API call, instant)
// Use this if you want to show a quick estimate before the AI call resolves
export function quickSentimentEstimate(
  text: string,
): Pick<
  SentimentResult,
  "positiveScore" | "negativeScore" | "neutralScore" | "label"
> {
  const lower = text.toLowerCase();

  const positiveWords = [
    "success",
    "excellent",
    "achieve",
    "improve",
    "benefit",
    "growth",
    "positive",
    "effective",
    "innovate",
    "opportunity",
    "advance",
    "recommend",
    "support",
    "great",
    "best",
  ];
  const negativeWords = [
    "fail",
    "problem",
    "issue",
    "risk",
    "concern",
    "challenge",
    "difficult",
    "poor",
    "decline",
    "threat",
    "error",
    "loss",
    "damage",
    "crisis",
    "inadequate",
  ];

  const words = lower.split(/\W+/);
  let pos = 0,
    neg = 0;

  words.forEach((w) => {
    if (positiveWords.includes(w)) pos++;
    if (negativeWords.includes(w)) neg++;
  });

  const total = Math.max(pos + neg, 1);
  const positiveScore = Math.round((pos / total) * 100 * 0.6 + 20); // bias toward neutral
  const negativeScore = Math.round((neg / total) * 100 * 0.6);
  const neutralScore = Math.max(0, 100 - positiveScore - negativeScore);

  let label: SentimentLabel = "neutral";
  if (positiveScore > 50) label = "positive";
  else if (negativeScore > 40) label = "negative";
  else if (positiveScore > 30 && negativeScore > 25) label = "mixed";

  return { positiveScore, negativeScore, neutralScore, label };
}

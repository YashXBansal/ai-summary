import { GoogleGenerativeAI } from "@google/generative-ai";

export interface KeywordResult {
  keyword: string;
  relevance: number; // 0-100
  category: string; // "concept", "entity", "technical", "action"
}

export interface DocumentIntelligence {
  keywords: KeywordResult[];
  topics: string[]; // top 3 topic tags e.g. ["Machine Learning", "Healthcare", "Data Science"]
  documentType: string; // "Research Paper" | "Legal Contract" | "Financial Report" | "Technical Manual" | etc.
  readabilityLevel: "Simple" | "Intermediate" | "Advanced" | "Expert";
  readabilityScore: number; // Flesch-Kincaid approximation 0-100 (higher = easier)
  estimatedReadTime: number; // in minutes
  wordCount: number;
  autoTitle: string; // AI-generated concise title for the document
  language: string; // detected language
}

const INTELLIGENCE_PROMPT = `
You are a document intelligence engine. Analyze the following text and return ONLY a valid JSON object (no markdown, no explanation):

{
  "keywords": [
    { "keyword": "<term>", "relevance": <0-100>, "category": "concept"|"entity"|"technical"|"action" }
    // Return 8-12 most important keywords
  ],
  "topics": ["<topic1>", "<topic2>", "<topic3>"],
  "documentType": "<one of: Research Paper, Legal Contract, Financial Report, Technical Manual, Business Proposal, Academic Thesis, News Article, Policy Document, Medical Report, General Document>",
  "readabilityLevel": "Simple"|"Intermediate"|"Advanced"|"Expert",
  "readabilityScore": <0-100, higher means easier to read>,
  "autoTitle": "<concise, descriptive title for this document, max 10 words>",
  "language": "<detected language, e.g. English>"
}

TEXT TO ANALYZE:
`;

export async function extractDocumentIntelligence(
  text: string,
): Promise<DocumentIntelligence> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || "";
  const truncated = text.split(" ").slice(0, 2500).join(" ");

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = Math.ceil(wordCount / 250); // avg reading speed

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(INTELLIGENCE_PROMPT + truncated);
  const raw = result.response
    .text()
    .trim()
    .replace(/```json|```/g, "")
    .trim();

  const parsed = JSON.parse(raw);

  return {
    ...parsed,
    wordCount,
    estimatedReadTime,
  };
}

// Flesch-Kincaid readability estimate (pure JS, no API)
export function computeReadability(text: string): {
  score: number;
  level: DocumentIntelligence["readabilityLevel"];
} {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  const syllables = words.reduce((acc, word) => acc + countSyllables(word), 0);

  if (sentences.length === 0 || words.length === 0)
    return { score: 50, level: "Intermediate" };

  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;

  // Flesch Reading Ease
  const score = Math.max(
    0,
    Math.min(
      100,
      206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord,
    ),
  );

  let level: DocumentIntelligence["readabilityLevel"] = "Intermediate";
  if (score >= 70) level = "Simple";
  else if (score >= 50) level = "Intermediate";
  else if (score >= 30) level = "Advanced";
  else level = "Expert";

  return { score: Math.round(score), level };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  const matches = word.match(/[aeiouy]+/g);
  return matches ? matches.length : 1;
}

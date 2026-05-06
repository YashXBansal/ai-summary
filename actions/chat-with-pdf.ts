"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatWithPdfInput {
  question: string;
  documentText: string; // pass the raw extracted text from the PDF
  chatHistory?: ChatMessage[]; // previous turns for multi-turn support
  summaryContext?: string; // optionally pass the existing summary for extra context
}

interface ChatWithPdfResult {
  answer: string;
  sourceParagraph?: string; // the most relevant chunk used
  confidence: "high" | "medium" | "low";
}

const SYSTEM_PROMPT = `You are an intelligent document assistant. A user has uploaded a PDF document and wants to ask questions about it.

Your job:
1. Answer the user's question based ONLY on the provided document text.
2. If the answer is explicitly in the document, give a direct, precise answer.
3. If the answer requires inference, clearly say "Based on the document, it appears that..."
4. If the document does not contain relevant information, say "The document does not cover this topic."
5. Keep answers concise (2-4 sentences) unless the question requires more detail.
6. Never make up information not in the document.

Return a JSON object:
{
  "answer": "<your answer>",
  "sourceParagraph": "<the 1-2 sentence excerpt from the document that best supports your answer, or null>",
  "confidence": "high" | "medium" | "low"
}
`;

export async function chatWithPdf(
  input: ChatWithPdfInput,
): Promise<ChatWithPdfResult> {
  const { question, documentText, chatHistory = [], summaryContext } = input;

  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) throw new Error("Missing AI API key");

  // Truncate document to fit context (keep most relevant chunks via simple sliding window)
  const docChunks = chunkText(documentText, 800); // 800-word chunks
  const relevantChunks = selectRelevantChunks(question, docChunks, 4); // top 4 chunks
  const contextText = relevantChunks.join("\n\n---\n\n");

  const historyStr = chatHistory
    .slice(-6) // last 3 turns
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const userMessage = `
DOCUMENT CONTENT:
${contextText}

${summaryContext ? `DOCUMENT SUMMARY:\n${summaryContext}\n` : ""}

${historyStr ? `CHAT HISTORY:\n${historyStr}\n` : ""}

USER QUESTION: ${question}

Respond with a valid JSON object only.
`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    // model: "gemini-2.0-flash",
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(userMessage);
  const raw = result.response
    .text()
    .trim()
    .replace(/```json|```/g, "")
    .trim();

  const parsed: ChatWithPdfResult = JSON.parse(raw);
  return parsed;
}

// Split text into word-count-limited chunks
function chunkText(text: string, wordsPerChunk: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
  }
  return chunks;
}

// Simple keyword overlap scoring to pick most relevant chunks
function selectRelevantChunks(
  question: string,
  chunks: string[],
  topN: number,
): string[] {
  const qWords = new Set(
    question
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3),
  );

  const scored = chunks.map((chunk) => {
    const chunkWords = chunk.toLowerCase().split(/\W+/);
    const overlap = chunkWords.filter((w) => qWords.has(w)).length;
    return { chunk, score: overlap };
  });

  scored.sort((a, b) => b.score - a.score);
  // Always include first chunk (intro context) + top N-1 scored
  const best = scored.slice(0, topN - 1).map((s) => s.chunk);
  if (!best.includes(chunks[0])) best.unshift(chunks[0]);

  return best.slice(0, topN);
}

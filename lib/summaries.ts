import { currentUser } from "@clerk/nextjs/server";
import { getDbConnection } from "./db";

export async function getSummaries(userId: string) {
  const sql = await getDbConnection();
  const summaries = await sql`
    SELECT * 
    FROM pdf_summaries 
    WHERE user_id = ${userId} AND is_deleted = false
    ORDER BY created_at DESC
  `;
  return summaries;
}

export async function getSummaryById(id: string) {
  try {
    const sql = await getDbConnection();
    const [summary] = await sql`
      SELECT * 
      FROM pdf_summaries 
      WHERE id = ${id} AND is_deleted = false
    `;
    return summary;
  } catch (error) {
    console.log("Error fetching summary by id", error);
    return null;
  }
}

export async function getEnhancedSummaryById(summaryId: string) {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) return null;

  const sql = await getDbConnection();

  const result = await sql`
    SELECT * FROM pdf_summaries
    WHERE id = ${summaryId} AND user_id = ${userId} AND is_deleted = FALSE
  `;

  if (!result[0]) return null;
  const row = result[0];

  const sentiment = {
    label: row.sentiment_label || "neutral",
    score: row.sentiment_score || 0,
    positiveScore: row.sentiment_positive || 0,
    negativeScore: row.sentiment_negative || 0,
    neutralScore: row.sentiment_neutral || 100,
    emotions: row.sentiment_emotions || [],
    dominantTone: row.sentiment_tone || "Unknown",
    summary: row.sentiment_summary || "No sentiment data available.",
  };

  const intelligence = {
    documentType: row.doc_type || "General Document",
    keywords: row.doc_keywords || [],
    topics: row.doc_topics || [],
    readabilityLevel: row.readability_level || "Intermediate",
    readabilityScore: row.readability_score || 0,
    wordCount: row.word_count || 0,
    estimatedReadTime: row.read_time_minutes || 0,
    autoTitle: row.title,
    language: "English",
  };

  return { ...row, sentiment, intelligence };
}

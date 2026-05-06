"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { trackAnonSummaryInCookie } from "@/lib/trackSummaryUpload";
import { getOrSetAnonId } from "@/utils/setAnonCookie";

// ✅ 1. Import your new AI Engines
import { analyzeSentiment } from "@/utils/sentiment-analysis";
import { extractDocumentIntelligence } from "@/utils/document-intelligence";

// ✅ 2. Update Interface to hold new AI data
interface PdfSummaryType {
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
  originalText?: string;
  sentiment?: any;
  intelligence?: any;
}

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    },
  ],
) {
  if (!uploadResponse) {
    return { success: false, message: "File Upload Failed.", data: null };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return { success: false, message: "File URL missing.", data: null };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log("📝 Extracted PDF Text (Preview):", pdfText.slice(0, 300));

    // ✅ 3. Run all AI tasks in PARALLEL for maximum speed
    const [summary, sentiment, intelligence] = await Promise.all([
      generateSummaryFromGemini(pdfText),
      analyzeSentiment(pdfText).catch((e) => null), // Catch errors so one failure doesn't crash everything
      extractDocumentIntelligence(pdfText).catch((e) => null),
    ]);

    console.log("📄 AI Analysis Completed.");

    if (!summary) {
      return {
        success: false,
        message: "Summary generation failed.",
        data: null,
      };
    }

    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Summary and analysis generated successfully.",
      data: {
        title: formattedFileName,
        summary,
        originalText: pdfText, // Needed for the Chat Panel RAG
        sentiment,
        intelligence,
      },
    };
  } catch (err) {
    console.error("❌ AI Pipeline Error:", err);
    return {
      success: false,
      message: "Unexpected error occurred.",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
  originalText,
  sentiment,
  intelligence,
}: PdfSummaryType & { userId: string }) {
  try {
    const sql = await getDbConnection();
    const cookieStore = await cookies();
    const anonId = cookieStore.get("anon_summary_id")?.value;

    // ✅ 4. Insert all the new data into the Database
    const [savedSummary] = await sql`
      INSERT INTO pdf_summaries (
        user_id, anon_summary_id, original_file_url, summary_text, title, file_name,
        original_text,
        sentiment_label, sentiment_score, sentiment_positive, sentiment_negative, sentiment_neutral,
        sentiment_emotions, sentiment_tone, sentiment_summary,
        doc_type, doc_keywords, doc_topics, readability_level, readability_score, word_count, read_time_minutes
      )
      VALUES (
        ${userId}, ${anonId ?? null}, ${fileUrl}, ${summary}, ${title}, ${fileName},
        ${originalText ?? null},
        ${sentiment?.label ?? null}, ${sentiment?.score ?? null}, ${sentiment?.positiveScore ?? null}, 
        ${sentiment?.negativeScore ?? null}, ${sentiment?.neutralScore ?? null},
        ${sentiment?.emotions ? JSON.stringify(sentiment.emotions) : null}, 
        ${sentiment?.dominantTone ?? null}, ${sentiment?.summary ?? null},
        ${intelligence?.documentType ?? null}, 
        ${intelligence?.keywords ? JSON.stringify(intelligence.keywords) : null}, 
        ${intelligence?.topics ? JSON.stringify(intelligence.topics) : null},
        ${intelligence?.readabilityLevel ?? null}, ${intelligence?.readabilityScore ?? null}, 
        ${intelligence?.wordCount ?? null}, ${intelligence?.estimatedReadTime ?? null}
      ) RETURNING id, summary_text;
    `;

    return savedSummary;
  } catch (error) {
    console.error("Error saving PDF summary:", error);
    return { success: false, message: "Failed to save PDF summary." };
  }
}

export async function getUploadStatus() {
  // ... (Keep your exact existing getUploadStatus function here, no changes needed) ...
  const sql = await getDbConnection();
  const user = await currentUser();

  if (!user) {
    const cookieStore = await cookies();
    const anonId = cookieStore.get("anon_summary_id")?.value;

    if (!anonId) {
      return {
        allowed: true,
        reason: null,
        isPro: false,
        isAnonymous: true,
        remaining: 1,
      };
    }

    const anonCount = (
      await sql`SELECT COUNT(*)::int FROM pdf_summaries WHERE anon_summary_id = ${anonId} AND is_deleted = false;`
    )[0].count;

    return {
      allowed: anonCount < 1,
      reason: anonCount < 1 ? null : "anonymous_limit_reached",
      isPro: false,
      isAnonymous: true,
      remaining: Math.max(0, 1 - anonCount),
    };
  }

  const email = user.emailAddresses?.[0]?.emailAddress;
  const dbUser = (
    await sql`SELECT status FROM users WHERE email = ${email};`
  )[0];
  const isPro = dbUser?.status === "active";

  if (isPro) {
    return {
      allowed: true,
      reason: null,
      isPro: true,
      isAnonymous: false,
      remaining: Infinity,
    };
  }

  const uploadsCount = (
    await sql`SELECT COUNT(*)::int FROM pdf_summaries WHERE user_id = ${user.id} AND is_deleted = false;`
  )[0].count;

  return {
    allowed: uploadsCount < 3,
    reason: uploadsCount < 3 ? null : "free_limit_reached",
    isPro: false,
    isAnonymous: false,
    remaining: Math.max(0, 3 - uploadsCount),
  };
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
  originalText,
  sentiment,
  intelligence,
}: PdfSummaryType) {
  const { userId: authUserId } = await auth();
  const cookieStore = await cookies();
  const sql = await getDbConnection();

  const anonId = cookieStore.get("anon_summary_id")?.value;
  const summaryId = await getOrSetAnonId();
  const anonUserId = `anon-${summaryId}`;

  const resolvedUserId = authUserId || anonUserId;
  const uploadStatus = await getUploadStatus();

  if (!uploadStatus.allowed) {
    throw new Error(uploadStatus.reason || "Upload limit exceeded");
  }

  if (authUserId && summaryId) {
    await sql`
      UPDATE pdf_summaries SET user_id = ${authUserId}
      WHERE user_id = ${anonUserId} AND is_deleted = false;
    `;
    cookieStore.delete("anon_summary_id");
  }

  // ✅ 5. Pass everything down to savePdfSummary
  const saved = await savePdfSummary({
    userId: resolvedUserId,
    fileUrl,
    summary,
    title,
    fileName,
    originalText,
    sentiment,
    intelligence,
  });

  if (resolvedUserId === "anon-user") {
    await trackAnonSummaryInCookie(saved.id);
  }

  revalidatePath(`/summaries/${saved.id}`);

  return {
    success: true,
    message: "Summary saved successfully.",
    data: { id: saved.id, isAnonymous: resolvedUserId === "anon-user" },
  };
}

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

interface PdfSummaryType {
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
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
  ]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File Upload Failed.",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File URL missing.",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log("📝 Extracted PDF Text (Preview):", pdfText.slice(0, 300));

    const summary = await generateSummaryFromGemini(pdfText);
    console.log("📄 Gemini Summary Output:", summary);

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
      message: "Summary generated successfully using Gemini.",
      data: {
        title: formattedFileName,
        summary,
      },
    };
  } catch (err) {
    console.error("❌ Gemini Summary Error:", err);
    return {
      success: false,
      message: "Unexpected error occurred while generating summary.",
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
}: {
  userId: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}) {
  try {
    const sql = await getDbConnection();
    const cookieStore = await cookies();
    const anonId = cookieStore.get("anon_summary_id")?.value;

    const [savedSummary] = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        anon_summary_id,
        original_file_url,
        summary_text,
        title,
        file_name
      )
      VALUES (
        ${userId},
        ${anonId ?? null},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName}
      ) RETURNING id, summary_text;
    `;

    return savedSummary;
  } catch (error) {
    console.error("Error saving PDF summary:", error);
    return {
      success: false,
      message: "Failed to save PDF summary.",
    };
  }
}

export async function getUploadStatus() {
  const sql = await getDbConnection();
  const user = await currentUser();

  if (!user) {
    const cookieStore = await cookies(); // ✅ no need for await
    const anonId = cookieStore.get("anon_summary_id")?.value;

    // ❗ Allow only if cookie exists and count < 1
    if (!anonId) {
      // Treat this as first-ever anon upload from this browser
      return {
        allowed: true,
        reason: null,
        isPro: false,
        isAnonymous: true,
        remaining: 1,
      };
    }

    // Check how many uploads exist for this anon ID
    const anonCount = (
      await sql`
        SELECT COUNT(*)::int
        FROM pdf_summaries
        WHERE anon_summary_id = ${anonId} AND is_deleted = false;
      `
    )[0].count;

    return {
      allowed: anonCount < 1,
      reason: anonCount < 1 ? null : "anonymous_limit_reached",
      isPro: false,
      isAnonymous: true,
      remaining: Math.max(0, 1 - anonCount),
    };
  }

  // 🧑‍💼 Logged-in logic
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
    await sql`
      SELECT COUNT(*)::int
      FROM pdf_summaries
      WHERE user_id = ${user.id} AND is_deleted = false;
    `
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
}: PdfSummaryType) {
  const { userId: authUserId } = await auth();
  const cookieStore = await cookies();
  const sql = await getDbConnection();

  const anonId = cookieStore.get("anon_summary_id")?.value;
  const summaryId = await getOrSetAnonId();
  const anonUserId = `anon-${summaryId}`;

  const resolvedUserId = authUserId || anonUserId;

  // ✅ Upload limit logic centralized
  const uploadStatus = await getUploadStatus();

  if (!uploadStatus.allowed) {
    throw new Error(uploadStatus.reason || "Upload limit exceeded");
  }

  // ✅ Migrate anon to signed-in user (if just logged in)
  if (authUserId && summaryId) {
    await sql`
      UPDATE pdf_summaries 
    SET user_id = ${authUserId}
    WHERE user_id = ${anonUserId}
      AND is_deleted = false;
    `;
    cookieStore.delete("anon_summary_id");
    console.log("🔄 Migrated anonymous summary to logged-in user");
  }

  // ✅ Save the summary
  const saved = await savePdfSummary({
    userId: resolvedUserId,
    fileUrl,
    summary,
    title,
    fileName,
  });

  // ✅ Track anon summary ID in cookie (if anon)
  if (resolvedUserId === "anon-user") {
    await trackAnonSummaryInCookie(saved.id);
  }

  revalidatePath(`/summaries/${saved.id}`);

  return {
    success: true,
    message: "Summary saved successfully.",
    data: {
      id: saved.id,
      isAnonymous: resolvedUserId === "anon-user",
    },
  };
}

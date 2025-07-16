"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
    const [savedSummary] = await sql`INSERT INTO pdf_summaries (
      user_id,
      original_file_url,
      summary_text,
      title,
      file_name
    )
    VALUES (
      ${userId},
      ${fileUrl},
      ${summary},
      ${title},
      ${fileName}
    ) RETURNING id, summary_text;`;
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
    // Anonymous user logic
    const anonCount = (
      await sql`
        SELECT COUNT(*)::int
        FROM pdf_summaries
        WHERE user_id = 'anon-user' AND is_deleted = false;
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

  // ✅ Count all summaries under this user, including migrated ones
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
  const resolvedUserId = authUserId || "anon-user";

  try {
    const sql = await getDbConnection();
    const uploadStatus = await getUploadStatus();

    if (!uploadStatus.allowed) {
      return {
        success: false,
        message:
          uploadStatus.reason === "anonymous_limit_reached"
            ? "You’ve already used your free anonymous summary. Please sign in to get more."
            : "You’ve used all your free summaries. Please upgrade to Pro.",
        data: null,
      };
    }

    // ✅ Check if anonymous summary exists in cookie and link to new user if logged in
    const cookieStore = await cookies();
    const anonSummaryId = cookieStore.get("anon_summary_id")?.value;

    if (authUserId && anonSummaryId) {
      await sql`
        UPDATE pdf_summaries
        SET user_id = ${authUserId}
        WHERE id = ${anonSummaryId} AND user_id = 'anon-user';
      `;
      cookieStore.delete("anon_summary_id");
      console.log("🔄 Linked anonymous summary to logged-in user");
    }

    const savedSummary = await savePdfSummary({
      userId: resolvedUserId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary. Please try again.",
        data: null,
      };
    }

    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
      success: true,
      message: "PDF summary stored successfully.",
      data: {
        id: savedSummary.id,
        isAnonymous: resolvedUserId === "anon-user",
      },
    };
  } catch (error) {
    console.error("❌ Error storing PDF summary:", error);
    return {
      success: false,
      message: "Unexpected error while saving summary.",
      data: null,
    };
  }
}

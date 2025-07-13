"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  // userId: string;
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
    }
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
    // 1. Extract text from PDF
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log("📝 Extracted PDF Text (Preview):", pdfText.slice(0, 300));

    // 2. Generate summary from Gemini
    const summary = await generateSummaryFromGemini(pdfText);
    console.log("📄 Gemini Summary Output:", summary); // 🔥 Ensure this prints

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
  // sql inserting pdf summary
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

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found.",
      };
    }
    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });
    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary. Please Try again",
      };
    }
  } catch (error) {
    console.error("Error storing PDF summary:", error);
    return {
      success: false,
      message: "Failed to store PDF summary.",
      data: null,
    };
  }

  // Revalidate the cache
  revalidatePath(`/summaries/${savedSummary.id}`);
  return {
    success: true,
    message: "PDF summary stored successfully.",
    data: {
      id: savedSummary.id,
    },
  };
}

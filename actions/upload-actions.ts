"use server";

import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";

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

    return {
      success: true,
      message: "Summary generated successfully using Gemini.",
      data: {
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

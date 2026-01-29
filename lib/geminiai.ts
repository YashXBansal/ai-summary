import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { text } from "stream/consumers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      // model: "gemini-2.5-flash-lite-preview-06-17",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500,
      },
    });
    const prompt = {
      contents: [
        {
          role: "user",
          parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
              text: `Transform the following document into an engaging, easy to read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response || !response.text) {
      throw new Error("No response text from Gemini API.");
    }

    return response.text();
  } catch (error: any) {
    if (error?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error(
      error?.message || "Failed to generate summary due to unknown error."
    );
  }
};

import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummaryFromOpenAI(pdfText: string) {
  try {
    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error("Input text is empty. Cannot generate summary.");
    }
    console.log("Using OpenAI Key:", process.env.OPENAI_API_KEY?.slice(0, 8));
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not set.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Transform the following document into an engaging, easy to read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const message = completion.choices[0]?.message?.content;

    if (!message) {
      throw new Error("OpenAI returned no message content.");
    }

    return message;
  } catch (error: any) {
    console.error("❌ OpenAI Summary Error:", error);

    if (error?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    throw new Error(
      error?.message || "Failed to generate summary due to unknown error."
    );
  }
}

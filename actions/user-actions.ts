"use server";

import { auth } from "@clerk/nextjs/server";
import { getDbConnection } from "@/lib/db";

export async function reassignAnonSummaryToUser(summaryId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    const sql = await getDbConnection();

    // Reassign ownership of the anon summary
    const updated = await sql`
      UPDATE pdf_summaries
      SET user_id = ${userId}
      WHERE id = ${summaryId} AND user_id = 'anon-user'
      RETURNING id;
    `;

    if (updated.length === 0) {
      return {
        success: false,
        message: "No matching anonymous summary found or already linked.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Error linking anon summary:", err);
    return { success: false, message: "Server error while linking summary." };
  }
}

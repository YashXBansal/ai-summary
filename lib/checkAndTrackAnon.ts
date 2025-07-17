// lib/usage/checkAndTrackAnonUpload.ts
import { cookies } from "next/headers";
import { getDbConnection } from "@/lib/db";

export async function checkAndTrackAnonUpload() {
  const cookieStore = await cookies();
  const existingId = cookieStore.get("anon_summary_id")?.value;

  const sql = await getDbConnection();

  if (existingId) {
    const result = await sql`
      SELECT id FROM pdf_summaries WHERE id = ${existingId}
    `;

    if (result.length > 0) {
      return {
        allowed: false,
        reason: "You’ve already used your 1 free summary. Login to get 2 more!",
      };
    }
  }

  return {
    allowed: true,
    reason: null,
  };
}

// lib/migrateAnonSummaryToUser.ts

"use server";

import { cookies } from "next/headers";
import { getDbConnection } from "@/lib/db";

export async function migrateAnonSummaryToUser(loggedInUserId: string) {
  const cookieStore = await cookies();
  const anonSummaryId = cookieStore.get("anon_summary_id")?.value;

  if (!anonSummaryId) return;

  const sql = await getDbConnection();

  // Confirm it's actually an anon-user summary
  const [summary] = await sql`
    SELECT * FROM pdf_summaries
    WHERE id = ${anonSummaryId}
    AND user_id = 'anon-user'
    AND is_deleted = false;
  `;

  if (!summary) return;

  // Update summary ownership to logged-in user
  await sql`
    UPDATE pdf_summaries
    SET user_id = ${loggedInUserId}
    WHERE id = ${anonSummaryId};
  `;
}

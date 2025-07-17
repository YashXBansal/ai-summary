// app/actions/migrate-from-client.ts
"use server";

import { cookies } from "next/headers";
import { getDbConnection } from "@/lib/db";

export async function migrateAnonSummaryToUserFromClient(
  userId: string,
  anonId: string
) {
  const sql = await getDbConnection();
  const anonUserId = `anon-${anonId}`;

  await sql`
    UPDATE pdf_summaries
    SET user_id = ${userId}
    WHERE user_id = ${anonUserId}
      AND is_deleted = false;
  `;

  (await cookies()).delete("anon_summary_id"); // clear cookie after migration
}

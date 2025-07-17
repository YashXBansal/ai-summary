// lib/migrateAnonSummaryToUser.ts
"use server";

import { cookies } from "next/headers";
import { getDbConnection } from "@/lib/db";

export async function migrateAnonSummaryToUser(loggedInUserId: string) {
  const cookieStore = await cookies();
  const anonId = cookieStore.get("anon_summary_id")?.value;

  if (!anonId) return;

  const sql = await getDbConnection();
  const anonUserId = `anon-${anonId}`;

  // Fetch all summaries tied to the anon user ID
  const summaries = await sql`
    SELECT id FROM pdf_summaries
    WHERE user_id = ${anonUserId}
      AND is_deleted = false;
  `;

  if (summaries.length === 0) return;

  // Migrate all summaries to the logged-in user
  await sql`
    UPDATE pdf_summaries
    SET user_id = ${loggedInUserId}
    WHERE user_id = ${anonUserId}
      AND is_deleted = false;
  `;

  // // Optional: Clear the cookie after migration
  // cookieStore.set("anon_summary_id", "", {
  //   path: "/",
  //   maxAge: 0,
  // });
}

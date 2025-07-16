import { getDbConnection } from "@/lib/db";

export async function getSummaryCountByEmail(email: string) {
  const db = await getDbConnection();
  const result = await db`
    SELECT COUNT(*) FROM pdf_summaries WHERE user_id = ${email};
  `;
  return parseInt(result[0].count || "0", 10);
}

export async function getUserStatus(email: string) {
  const db = await getDbConnection();
  const result = await db`
    SELECT status FROM users WHERE email = ${email};
  `;
  return result.length > 0 ? result[0].status : "inactive";
}

// export function getAnonymousCount(): number {
//   const count = typeof window !== "undefined"
//     ? parseInt(localStorage.getItem("anon_count") || "0", 10)
//     : 0;
//   return count;
// }

// export function incrementAnonymousCount(): void {
//   if (typeof window !== "undefined") {
//     const current = getAnonymousCount();
//     localStorage.setItem("anon_count", String(current + 1));
//   }
// }

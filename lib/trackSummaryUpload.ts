// lib/usage/trackAnonSummaryInCookie.ts
import { cookies } from "next/headers";

export async function trackAnonSummaryInCookie(savedSummaryId: string) {
  const cookieStore = await cookies();
  cookieStore.set("anon_summary_id", savedSummaryId, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });
}

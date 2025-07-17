import { cookies } from "next/headers";
import { nanoid } from "nanoid";

export async function getOrSetAnonId(): Promise<string> {
  const cookieStore = await cookies();
  let anonId = cookieStore.get("anon_summary_id")?.value;

  if (!anonId) {
    anonId = nanoid();
    cookieStore.set("anon_summary_id", anonId, {
      path: "/",
      httpOnly: false,
      secure: true,
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return anonId;
}

// app/api/users/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  try {
    const sql = await getDbConnection();
    const result = await sql`SELECT status FROM users WHERE email = ${email}`;
    const user = result[0];

    if (!user) return NextResponse.json({ status: "inactive" });

    return NextResponse.json({ status: user.status });
  } catch (err) {
    console.error("❌ Failed to get user status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSummaryCountByEmail, getUserStatus } from "@/lib/userAccess";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();

    if (user?.emailAddresses?.[0]?.emailAddress) {
      const email = user.emailAddresses[0].emailAddress;
      const status = await getUserStatus(email);

      if (status === "active") {
        return NextResponse.json({ allowed: true, reason: "pro" });
      }

      const count = await getSummaryCountByEmail(email);
      if (count < 3) {
        return NextResponse.json({ allowed: true, reason: "free-logged-in", remaining: 3 - count });
      } else {
        return NextResponse.json({ allowed: false, reason: "limit-exceeded" });
      }
    }

    // Anonymous user fallback
    return NextResponse.json({ allowed: false, reason: "unauthenticated" });
  } catch (error) {
    console.error("❌ Error checking limit:", error);
    return NextResponse.json({ allowed: false, reason: "error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDbConnection } from "@/lib/db";

const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userEmail,
      amount,
      priceId,
    } = body;

    const generated_signature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("🔐 Signature check: computed vs sent", {
      generated_signature,
      received: razorpay_signature,
    });

    if (generated_signature !== razorpay_signature) {
      console.error("❌ Invalid Razorpay signature");
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const sql = await getDbConnection();

    await sql`
      INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email)
      VALUES (${amount}, 'paid', ${razorpay_payment_id}, ${priceId}, ${userEmail})
    `;

    await sql`
      UPDATE users SET status = 'active', price_id = ${priceId}
      WHERE email = ${userEmail}
    `;

    console.log("✅ Payment verified and saved for:", userEmail);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Verification error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
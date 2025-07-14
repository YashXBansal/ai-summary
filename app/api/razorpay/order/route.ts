import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getDbConnection } from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { email, amount, priceId } = await req.json();
    const sql = await getDbConnection();

    console.log("📩 Creating order for:", email);

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (user.length === 0) {
      console.log("🆕 Creating new user in DB");
      await sql`INSERT INTO users (email, full_name, status) VALUES (${email}, '', 'inactive')`;
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: true,
    });

    console.log("✅ Order created:", order.id);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      priceId,
      email,
    });
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}

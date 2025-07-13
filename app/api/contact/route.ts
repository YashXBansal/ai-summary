// app/api/contact/route.ts

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const response = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Use a verified sender in production
      to: "yashbansal414@gmail.com", // Your receiving email
      subject: `New Contact Message from ${name}`,
      replyTo: email,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    console.log("✅ Email sent:", response);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Email send failed:", err);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}

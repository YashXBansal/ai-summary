"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function RazorpayButton() {
  const { user } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const fullName = user?.fullName;

  const handlePayment = async () => {
    const amount = 299;
    const priceId = "pro_monthly";

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount, priceId }),
      });

      const data = await res.json();
      console.log("📦 Razorpay Order Response:", data);

      if (!data.orderId) {
        alert("⚠️ Failed to create Razorpay order");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        name: "AI-SUMMARY",
        description: "Monthly Subscription",
        order_id: data.orderId,
        handler: async function (response: any) {
          console.log("✅ Razorpay Response:", response);

          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userEmail: email,
              amount,
              priceId,
            }),
          });

          const verifyData = await verifyRes.json();
          console.log("🔍 Verify Response:", verifyData);

          if (verifyData.success) {
            alert("✅ Payment successful & verified!");
          } else {
            alert("⚠️ Payment verification failed.");
          }
        },
        prefill: {
          name: fullName ?? "User",
          email: email ?? "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => console.log("❌ User closed payment modal"),
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("❌ Error initiating Razorpay:", err);
      alert("Something went wrong while starting payment.");
    }
  };

  return <Button onClick={handlePayment}>Subscribe - ₹299</Button>;
}

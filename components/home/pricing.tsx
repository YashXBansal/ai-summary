"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RazorpayButton from "@/components/payment/razorpay-page";
import { fetchProStatus } from "@/lib/check-user-pro/check-pro";

export default function PricingSection() {
  const { user } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!email) return;
      const isProUser = await fetchProStatus(email);
      setIsPro(isProUser); // ✅ Correctly sets boolean
    };

    checkStatus();
  }, [email]);

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-black"
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Badge className="mb-4 text-sm">Pricing</Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Choose the plan that fits you
        </h2>
        <p className="text-muted-foreground mb-8">
          Simple, transparent pricing. No hidden fees.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Free Plan */}
          <Card className="border border-gray-200 dark:border-zinc-800 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Free Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left mb-4 text-sm">
                <li>✅ Summarize up to 3 PDFs</li>
                <li>🚫 No access to long PDFs</li>
                <li>🚫 No premium features</li>
              </ul>
              <div className="text-xl font-bold">₹0</div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border border-violet-500 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-violet-600 dark:text-violet-400">
                Pro Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left mb-4 text-sm">
                <li>✅ Unlimited summaries</li>
                <li>✅ Priority AI queue</li>
                <li>✅ Support for large academic PDFs</li>
              </ul>
              <div className="text-xl font-bold mb-4">₹299/month</div>

              {isPro ? (
                <Badge className="bg-green-600 hover:bg-green-600 text-white">
                  ✅ You’re already a Pro user
                </Badge>
              ) : (
                <RazorpayButton />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

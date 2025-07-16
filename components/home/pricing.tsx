"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RazorpayButton from "@/components/payment/razorpay-page";
import { fetchProStatus } from "@/lib/check-user-pro/check-pro";
import { CheckCircle, XCircle, Star } from "lucide-react";
import clsx from "clsx";

export default function PricingSection() {
  const { user } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!email) return;
      const isProUser = await fetchProStatus(email);
      setIsPro(isProUser);
    };
    checkStatus();
  }, [email]);

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-black"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-4 text-sm">Pricing</Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          Choose the plan that fits your needs
        </h2>
        <p className="text-muted-foreground mb-10 text-sm sm:text-base">
          Transparent pricing. No hidden fees, cancel anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className="group relative transition-all duration-300 border border-gray-200 dark:border-zinc-800 shadow-md hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Free Plan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="space-y-3 text-sm text-left text-gray-700 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Summarize up to <strong>3 PDFs</strong>
                </li>
                <li className="flex items-center gap-2 text-gray-400 line-through">
                  <XCircle className="w-4 h-4" />
                  No long PDF support
                </li>
                <li className="flex items-center gap-2 text-gray-400 line-through">
                  <XCircle className="w-4 h-4" />
                  No priority queue or premium tools
                </li>
              </ul>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                ₹0
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card
            className={clsx(
              "group relative transition-all duration-300 border-2 shadow-lg hover:scale-[1.025] hover:border-violet-600 hover:shadow-violet-200 dark:hover:shadow-violet-900",
              "border-violet-500"
            )}
          >
            <div className="absolute -top-4 right-4">
              <Badge className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full shadow-md">
                <Star className="w-3 h-3 mr-1 inline-block" /> Most Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-violet-600 dark:text-violet-400 font-semibold">
                Pro Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="space-y-3 text-sm text-left text-gray-700 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <strong>Unlimited</strong> PDF summaries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Priority AI queue
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Supports large academic PDFs
                </li>
              </ul>
              <div className="text-xl font-bold text-violet-600 dark:text-violet-300">
                ₹299/month
              </div>

              {isPro ? (
                <Badge className="bg-green-600 hover:bg-green-600 text-white px-3 py-1 w-fit mx-auto">
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

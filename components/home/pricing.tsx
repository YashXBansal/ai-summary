"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingSection() {
  const plans = [
    {
      title: "Basic",
      price: "Free",
      features: [
        "Summarize up to 5 PDFs",
        "Basic AI summary quality",
        "Access via dashboard",
      ],
      cta: "Get Started",
      href: "/sign-in",
      highlighted: false,
    },
    {
      title: "Pro",
      price: "₹299/month",
      features: [
        "Unlimited PDF summaries",
        "Advanced AI with deeper insights",
        "Priority processing",
        "Download & export summaries",
        "Early access to new features",
      ],
      cta: "Go Pro",
      href: "/sign-up",
      highlighted: true,
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-gray-950 py-20 lg:py-28 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Simple, Transparent{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Pricing
            </span>
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Pick the plan that works for you — no hidden fees or long contracts.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className={`relative flex flex-col justify-between px-6 py-8 rounded-2xl border shadow-sm
                ${
                  plan.highlighted
                    ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white border-indigo-600 dark:border-indigo-400"
                    : "bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white border-gray-200 dark:border-gray-800"
                }
              `}
            >
              {/* Most Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 right-4 sm:right-6">
                  <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-white text-indigo-600 dark:bg-gray-950 dark:text-indigo-300 shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex-1">
                <h3
                  className={`text-2xl sm:text-3xl font-bold mb-2 ${
                    plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.title}
                </h3>
                <p
                  className={`text-3xl sm:text-4xl font-bold mb-6 ${
                    plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.price}
                </p>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 text-sm sm:text-base ${
                        plan.highlighted
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${
                          plan.highlighted ? "text-white" : "text-green-500"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                size="lg"
                className={`w-full font-semibold mt-4 ${
                  plan.highlighted
                    ? "bg-white text-indigo-600 hover:bg-gray-100"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

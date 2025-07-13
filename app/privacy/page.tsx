// app/privacy/page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto text-gray-800"
    >
      <h1 className="text-4xl font-bold mb-4 text-neutral-900 tracking-tight">
        Privacy Policy
      </h1>
      <p className="mb-10 text-sm text-gray-500">
        Last updated: <time dateTime="2025-07-13">July 13, 2025</time>
      </p>

      {sections.map((section, index) => (
        <section key={index} className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-neutral-800">
            {section.title}
          </h2>
          {Array.isArray(section.content) ? (
            <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
              {section.content.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-base leading-relaxed">{section.content}</p>
          )}
        </section>
      ))}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
        <p className="text-base leading-relaxed">
          If you have questions or requests about this Privacy Policy or your
          data, please email us at{" "}
          <a
            href="mailto:yashbansal26.dev@gmail.com"
            className="text-blue-600 hover:underline"
          >
            yashbansal26.dev@gmail.com
          </a>
          .
        </p>
      </section>

      <p className="text-sm text-gray-500">
        For more information, please see our{" "}
        <a href="/terms" className="underline text-blue-600 hover:text-blue-700">
          Terms of Service
        </a>
        .
      </p>
    </motion.div>
  );
}

const sections = [
  {
    title: "1. Introduction",
    content:
      "We respect your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information, and your rights under data protection laws.",
  },
  {
    title: "2. What Data We Collect",
    content: [
      "Personal data: name, email address, billing details, and company information.",
      "Usage data: IP address, browser type, time spent on pages, interactions.",
      "Support data: messages and communications sent through support channels.",
    ],
  },
  {
    title: "3. How We Collect It",
    content:
      "We collect data through sign-up forms, when you use our services (via cookies or analytics), and when you contact us directly for support.",
  },
  {
    title: "4. Why We Use Your Data",
    content:
      "To operate our service, personalize your experience, process billing, respond to inquiries, and improve performance through analytics.",
  },
  {
    title: "5. Data Sharing & Third Parties",
    content:
      "We only share data with trusted third parties like payment processors, analytics services, or legal authorities when required.",
  },
  {
    title: "6. Data Retention",
    content:
      "Your data is kept only as long as needed to serve legitimate purposes like compliance, analytics, or service delivery. You can request deletion at any time.",
  },
  {
    title: "7. Security Measures",
    content:
      "We use secure protocols (HTTPS), encryption, access control, and routine audits to protect your data from unauthorized access or misuse.",
  },
  {
    title: "8. Cookies & Tracking",
    content:
      "Cookies help us remember your preferences and understand user behavior. You can manage cookie settings from your browser or in our app.",
  },
  {
    title: "9. Changes to This Policy",
    content:
      "We may revise this policy as needed. You will be notified via email or in-app notifications whenever a significant change is made.",
  },
  {
    title: "10. Your Rights",
    content:
      "You have the right to access, update, delete, or restrict your personal data. Contact us to exercise any of these rights under GDPR, CCPA, or equivalent laws.",
  },
];

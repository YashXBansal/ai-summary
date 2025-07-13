// app/terms/page.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using our service, you agree to be bound by these Terms. If you do not agree, please do not use the service.`,
  },
  {
    title: "2. Definitions",
    content: `“Service” refers to the AI PDF Summarization platform. “You” means the user or entity using the Service.`,
  },
  {
    title: "3. License & Use Restrictions",
    content: [
      `We grant you a non-exclusive, non-transferable license to use the Service per these Terms.`,
      `You may not: reverse-engineer, copy, redistribute, sublicense, or misuse the Service.`,
    ],
  },
  {
    title: "4. Account Registration",
    content: [
      `You must provide accurate information and keep your account secure.`,
      `Account sharing is prohibited. You are responsible for all activity under your account.`,
    ],
  },
  {
    title: "5. Fees, Billing & Refunds",
    content: [
      `Service fees are charged per selected plan on a recurring basis (monthly/yearly).`,
      `We accept credit card payment via a secure processor.`,
      `No refunds for unused time unless required by law.`,
      `We may change pricing with 30 days' notice.`,
    ],
  },
  {
    title: "6. Intellectual Property",
    content: [
      `We (and our licensors) own all rights to the Service and its content.`,
      `You retain ownership of your content but grant us a worldwide license to operate the Service.`,
    ],
  },
  {
    title: "7. Acceptable Use & Prohibited Conduct",
    content: `You must not use the Service to: break laws, send spam, infringe on rights, or disrupt operations.`,
  },
  {
    title: "8. Confidentiality",
    content: `Each party will keep the other's confidential information secure.`,
  },
  {
    title: "9. Warranties & Disclaimers",
    content: [
      `We provide the Service “as is” without warranties of any kind.`,
      `We disclaim implied warranties of merchantability or fitness for a particular purpose.`,
    ],
  },
  {
    title: "10. Limitation of Liability",
    content: `To the maximum extent permitted by law, we are not liable for indirect damages or losses and total liability is limited to fees paid in the last 12 months.`,
  },
  {
    title: "11. Termination",
    content: [
      `We may suspend or terminate your account for violations or non-payment.`,
      `You can terminate your subscription via account settings; fees already paid are non-refundable.`,
    ],
  },
  {
    title: "12. Governing Law & Dispute Resolution",
    content: `These Terms are governed by the laws of [Your Jurisdiction]. Disputes must be resolved in local courts or via binding arbitration.`,
  },
  {
    title: "13. Changes to Terms",
    content: `We may update these Terms. We’ll notify you and updates are effective upon posting. Continued use means you accept the changes.`,
  },
  {
    title: "14. Third‑Party Links",
    content: `Our Service may include links to third-party sites. We are not responsible for their practices or content.`,
  },
  {
    title: "15. Contact Information",
    content: `Questions about these Terms? Contact us at [yashbansal26.dev@gmail.com].`,
  },
];

export default function TermsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto text-gray-800"
    >
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Terms of Service</h1>
      <p className="mb-10 text-sm text-gray-500">
        Last updated: <time dateTime="2025-07-13">July 13, 2025</time>
      </p>

      {sections.map((sec, i) => (
        <section key={i} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{sec.title}</h2>
          {Array.isArray(sec.content) ? (
            <ul className="list-disc pl-5 space-y-2">
              {sec.content.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          ) : (
            <p>{sec.content}</p>
          )}
        </section>
      ))}

      <p className="text-sm text-gray-500">
        You can also view our{" "}
        <a href="/privacy" className="underline text-blue-600 hover:text-blue-700">
          Privacy Policy
        </a>
        .
      </p>
    </motion.div>
  );
}

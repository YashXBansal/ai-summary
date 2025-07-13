import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

// app/layout.tsx or page.tsx
export const metadata: Metadata = {
  title: "AI PDF Summary | Instantly Summarize PDFs with AI",
  description:
    "AI PDF Summary helps you extract key insights from PDF documents instantly using powerful AI. Fast, accurate, and perfect for students, researchers, and professionals.",
  keywords: [
    "PDF summarizer",
    "AI PDF summary",
    "summarize PDF online",
    "extract text from PDF",
    "academic summarizer",
    "chat with PDF",
    "AI document summarization",
    "PDF AI tool",
  ],
  openGraph: {
    title: "AI PDF Summary | Summarize Your PDFs Instantly",
    description:
      "Summarize academic papers, reports, or e-books in seconds with our AI-powered PDF summarizer. No more manual reading.",
    url: "https://ai-summary-azure.vercel.app/",
    siteName: "AI PDF Summary",
    images: [
      {
        url: "https://ai-summary-azure.vercel.app/og-image.png", // custom OG image for previews
        width: 1200,
        height: 630,
        alt: "AI PDF Summary Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI PDF Summary",
    description:
      "AI-powered tool to summarize PDF documents instantly. Save time, boost productivity.",
    images: ["https://ai-summary-azure.vercel.app/og-image.png"],
    creator: "@Yash261204",
  },
  metadataBase: new URL("https://ai-summary-azure.vercel.app/"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
          <div className="relative min-h-screen flex flex-col">
            <Suspense fallback={<div className="h-16" />}>
              <Header />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Suspense fallback={<div className="h-24" />}>
              <Footer />
            </Suspense>
          </div>

          <Suspense fallback={null}>
            <Analytics />
          </Suspense>

          <Suspense fallback={null}>
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                className:
                  "border border-gray-200 shadow-md text-gray-900 dark:text-white",
                style: {
                  backgroundColor: "#fef3c7",
                  color: "#1f2937",
                  borderRadius: "8px",
                  fontSize: "14px",
                },
              }}
            />
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}

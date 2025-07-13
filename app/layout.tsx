import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ai-summary",
  description: "Web app for summarizing pdf's",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${firaCode.variable} antialiased`}>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Analytics />
          </div>
          <Toaster
            position="top-center"
            richColors // Enables colored toasts
            toastOptions={{
              className:
                "border border-gray-200 shadow-md text-gray-900 dark:text-white",
              style: {
                backgroundColor: "#fef3c7", // Light yellow
                color: "#1f2937", // Gray-900
                borderRadius: "8px",
                fontSize: "14px",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}

"use client";
import Link from "next/link";
import { FileText, Upload, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

function Header() {
  const isLoggedIn = true;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 z-50">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-gray-900 dark:text-white hover:rotate-12 transition-transform duration-200 ease-in-out" />
            <span className="font-extrabold text-lg text-gray-900 dark:text-white">
              Ai-Summary
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm whitespace-nowrap">
          <Link
            href="/#pricing"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition"
          >
            Pricing
          </Link>

          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition"
            >
              Your Summaries
            </Link>
          )}

          {isLoggedIn && (
            <Link
              href="/upload"
              className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF</span>
            </Link>
          )}

          {isLoggedIn && (
            <div className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md font-medium">
              PRO
            </div>
          )}

          {isLoggedIn ? (
            <Button
              size="sm"
              className="text-sm text-white hover:text-red-600 transition"
            >
              Sign Out
            </Button>
          ) : (
            <Link
              href="/sign-in"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Nav - Only on Mobile */}
        <div className="md:hidden flex items-center gap-2">
          {/* Menu Button */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] p-6 space-y-6">
              <nav className="flex flex-col gap-4 text-sm">
                <Link
                  href="/#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-indigo-600"
                >
                  Pricing
                </Link>
                {isLoggedIn && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-indigo-600"
                  >
                    Your Summaries
                  </Link>
                )}
                {isLoggedIn && (
                  <Link
                    href="/upload"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-1 hover:text-indigo-600"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </Link>
                )}
                {isLoggedIn ? (
                  <Button size="sm" className="text-sm mt-2">
                    Sign Out
                  </Button>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-indigo-600"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* PRO Badge next to menu icon (only on mobile) */}
          {isLoggedIn && (
            <div className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md font-medium">
              PRO
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

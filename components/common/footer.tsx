"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        {/* Branding Section */}
        <div className="text-center sm:text-left space-y-1">
          <p className="font-semibold text-gray-800 dark:text-white text-base">
            &copy; {new Date().getFullYear()} PDF Summarizer AI
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 font-medium text-gray-600 dark:text-gray-300">
          <Link
            href="/about"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            About
          </Link>
          <Link
            href="/#pricing"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Contact
          </Link>
          <Link
            href="/privacy"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}

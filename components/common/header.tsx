import Link from "next/link";
import { FileText, Upload } from "lucide-react";
import { Button } from "../ui/button";

function Header() {
  const isLoggedIn = true;

  return (
    <nav className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8 overflow-x-auto">
      {/* Left: Logo */}
      <div className="flex items-center flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-gray-900 hover:rotate-12 transition-transform duration-200 ease-in-out" />
          <span className="font-extrabold text-base sm:text-lg lg:text-xl text-gray-900">
            Ai-Summary
          </span>
        </Link>
      </div>

      {/* Right: Navigation Links */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-10 text-sm sm:text-base whitespace-nowrap overflow-x-auto">
        <Link
          href="/#pricing"
          className="text-gray-700 hover:text-indigo-600 transition"
        >
          Pricing
        </Link>

        {isLoggedIn && (
          <Link
            href="/dashboard"
            className="text-gray-700 hover:text-indigo-600 transition"
          >
            Your Summaries
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <Link
              href="/upload"
              className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 transition"
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Upload PDF</span>
            </Link>

            <div className="text-xs sm:text-sm px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md font-medium">
              PRO
            </div>

            <Button
              size="sm"
              className="text-sm text-white hover:text-red-600 transition"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="text-gray-700 hover:text-indigo-600 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;

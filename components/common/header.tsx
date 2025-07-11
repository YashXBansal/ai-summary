"use client";

import Link from "next/link";
import { FileText, Upload, Menu } from "lucide-react";
import { useState } from "react";
import {
  useUser,
  UserButton,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link
        href="/#pricing"
        onClick={onClick}
        className="hover:text-indigo-600 transition"
      >
        Pricing
      </Link>

      {isSignedIn && (
        <>
          <Link
            href="/dashboard"
            onClick={onClick}
            className="hover:text-indigo-600 transition"
          >
            Your Summaries
          </Link>

          <Link
            href="/upload"
            onClick={onClick}
            className="flex items-center gap-1 hover:text-indigo-600 transition"
          >
            <Upload className="w-4 h-4" />
            Upload PDF
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 z-50">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-gray-900 dark:text-white hover:rotate-12 transition-transform duration-200 ease-in-out" />
          <span className="font-extrabold text-lg text-gray-900 dark:text-white">
            Ai-Summary
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <NavLinks />

          {isSignedIn ? (
            <>
              <div className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md font-medium">
                PRO
              </div>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Menu">
                <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full max-w-xs px-4 py-6 space-y-6 dark:bg-gray-950 sm:px-6"
            >
              <div className="flex flex-col gap-6 text-sm text-gray-800 dark:text-gray-200">
                {/* Avatar & Info Section */}
                {isSignedIn && (
                  <div className="flex items-center gap-3">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9",
                        },
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-base leading-tight dark:text-white">
                        Welcome
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        PRO User
                      </span>
                    </div>
                  </div>
                )}

                {/* Nav Links */}
                <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                  <NavLinks onClick={() => setMenuOpen(false)} />
                </div>

                {/* Sign In / Out Button */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  {isSignedIn ? (
                    <SignOutButton>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-sm py-2"
                        onClick={() => setMenuOpen(false)} // manually close sheet
                      >
                        Sign Out
                      </Button>
                    </SignOutButton>
                  ) : (
                    <SignInButton mode="modal">
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full text-sm py-2"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {isSignedIn && (
            <div className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md font-medium">
              PRO
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

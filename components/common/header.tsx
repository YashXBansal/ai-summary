"use client";

import Link from "next/link";
import { FileText, Upload, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useUser,
  UserButton,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import { fetchProStatus } from "@/lib/check-user-pro/check-pro"; // ✅ import shared function

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const [isPro, setIsPro] = useState(false);

  const email = user?.emailAddresses?.[0]?.emailAddress;

  useEffect(() => {
    const checkStatus = async () => {
      if (!email) return;
      const pro = await fetchProStatus(email);
      setIsPro(pro);
    };

    checkStatus();
  }, [email]);

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
              {isPro && (
                <div className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md font-medium">
                  PRO
                </div>
              )}
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
              <DialogTitle className="sr-only">Mobile Menu</DialogTitle>
              <div className="flex flex-col gap-6 text-sm text-gray-800 dark:text-gray-200">
                {/* Avatar & Info Section */}
                {isSignedIn && (
                  <div className="flex items-center gap-3">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{ elements: { avatarBox: "w-9 h-9" } }}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-base leading-tight dark:text-white">
                        Welcome
                      </span>
                      {isPro && (
                        <span className="text-xs text-yellow-500 font-medium">
                          PRO User
                        </span>
                      )}
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
                        onClick={() => setMenuOpen(false)}
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

          {isSignedIn && isPro && (
            <div className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md font-medium">
              PRO
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

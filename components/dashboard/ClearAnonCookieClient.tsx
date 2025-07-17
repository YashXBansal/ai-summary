"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function ClearAnonCookieClient() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      // ✅ Clear cookie
      document.cookie =
        "anon_summary_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // ✅ Clear localStorage
      localStorage.removeItem("anon_summary_id");
    }
  }, [isSignedIn]);

  return null;
}

// components/clear-anon-cookie-client.tsx
"use client";

import { useEffect } from "react";

export default function ClearAnonCookieClient() {
  useEffect(() => {
    // Delete cookie from client side
    document.cookie = "anon_summary_id=; path=/; max-age=0";
  }, []);

  return null;
}

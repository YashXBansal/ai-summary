// components/dashboard/MigrateFromClient.tsx
"use client";

import { useEffect } from "react";
import { migrateAnonSummaryToUserFromClient } from "@/actions/migrate-from-client";

interface Props {
  userId: string;
}

export default function MigrateFromClient({ userId }: Props) {
  useEffect(() => {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const anonCookie = cookies.find((c) => c.startsWith("anon_summary_id="));
    const anonId = anonCookie?.split("=")[1];

    if (anonId) {
      migrateAnonSummaryToUserFromClient(userId, anonId);
    }
  }, [userId]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { reassignAnonSummaryToUser } from "@/actions/user-actions";
import { toast } from "sonner";

export default function LinkAnonSummaryToUser() {
  const { userId, isSignedIn } = useAuth();

  useEffect(() => {
    const summaryId = localStorage.getItem("anon_summary_id");

    if (isSignedIn && summaryId) {
      reassignAnonSummaryToUser(summaryId)
        .then((res) => {
          if (res?.success) {
            localStorage.removeItem("anon_summary_id");
            toast.success(
              "🎉 Your previous summary was linked to your account!"
            );
          } else {
            console.warn("❌ Linking failed:", res?.message);
          }
        })
        .catch((err) => {
          console.error("❌ Error linking anon summary:", err);
        });
    }
  }, [isSignedIn]);

  return null;
}

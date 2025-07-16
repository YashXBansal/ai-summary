"use client";

import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
  getUploadStatus,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.size < 24 * 1024 * 1024, {
      message: "File must be less than 24MB",
    })
    .refine((file) => file.type.startsWith("application/pdf"), {
      message: "File must be a PDF",
    }),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.success("✅ Upload Complete", {
        description: "Your file was uploaded successfully.",
      });
    },
    onUploadError: (err) => {
      toast.error("❌ Upload Failed", {
        description: err.message || "Something went wrong. Please try again.",
      });
    },
    onUploadBegin: () => {
      toast("📤 Upload Started", {
        description: `Your file is uploading...`,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      // ✅ Step 1: Validate file
      const validated = schema.safeParse({ file });
      if (!validated.success) {
        const message =
          validated.error.flatten().fieldErrors.file?.[0] ?? "Invalid file.";
        toast.error("❌ File Validation Error", {
          description: message,
        });
        return;
      }

      // ✅ Step 2: Check user upload status before continuing
      const status = await getUploadStatus();

      if (!status.allowed) {
        if (status.isAnonymous) {
          toast.error("🔒 Free Limit Reached", {
            description:
              "You've already summarized 1 PDF. Please sign up or log in to get 2 more summaries for free.",
            action: {
              label: "Sign Up",
              onClick: () => router.push("/sign-up"),
            },
          });
        } else if (!status.isPro) {
          toast.error("🚫 Free Limit Reached", {
            description:
              "You've used your 3 free summaries. Please upgrade to Pro to continue summarizing PDFs.",
            action: {
              label: "Upgrade",
              onClick: () => router.push("/#pricing"),
            },
          });
        }
        return;
      }

      // ✅ Step 3: Start Upload
      const resp = await startUpload([file]);
      if (!resp) {
        toast.error("❌ Upload Failed", {
          description: "Something went wrong while uploading your file.",
        });
        return;
      }

      toast("📄 Processing File...", {
        description: `Generating summary using AI...`,
      });

      // ✅ Step 4: Generate Summary
      const result = await generatePdfSummary([resp[0]]);
      const { data = null } = result || {};

      if (data?.summary) {
        toast("📦 Saving Summary", {
          description: "Saving your summarized content...",
        });

        // ✅ Step 5: Save summary to DB
        const storeResult = await storePdfSummaryAction({
          summary: data.summary,
          fileUrl: resp[0].serverData.file.url,
          title: data.title,
          fileName: file.name,
        });

        if (!storeResult?.success) {
          toast.error("❌ Save Failed", {
            description:
              storeResult.message ||
              "Could not save your summary. You may have hit your usage limit.",
          });
          return;
        }

        const summaryId = storeResult?.data?.id;

        if (storeResult?.data?.isAnonymous && summaryId) {
          localStorage.setItem("anon_summary_id", storeResult.data.id);
          document.cookie = `anon_summary_id=${storeResult.data.id}; path=/`;
          console.log(
            "💾 Stored anon summary ID in cookie for linking after signup"
          );
        }

        toast.success("✨ Summary Ready", {
          description: "Your PDF has been summarized and saved successfully.",
        });

        formRef.current?.reset();
        if (summaryId) {
          router.push(`/summaries/${summaryId}`);
        }
      } else {
        toast.error("⚠️ Summary Generation Failed", {
          description:
            "We couldn't generate a summary. Try a different file or check back later.",
        });
      }
    } catch (error) {
      console.error("❌ Unexpected Error:", error);
      toast.error("🚨 Something went wrong", {
        description: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        ref={formRef}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

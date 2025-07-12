"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";

// Zod schema for validating uploaded file
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
  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("✅ File uploaded successfully!");
      toast.success("✅ Upload Complete", {
        description: "Your file has been uploaded successfully.",
      });
    },

    onUploadError: (err) => {
      console.error("❌ Upload error:", err);
      toast.error("❌ Upload Failed", {
        description: err.message || "An unexpected error occurred.",
      });
    },

    onUploadBegin: ({ file }) => {
      console.log("📤 Upload started for:", file);
      toast("📤 Upload Started", {
        description: `Uploading File...`,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // 🧪 Validate PDF file
    const validated = schema.safeParse({ file });

    if (!validated.success) {
      const message =
        validated.error.flatten().fieldErrors.file?.[0] ?? "Invalid file.";
      toast.error("❌ Invalid File", {
        description: message,
      });
      return;
    }

    // 🚀 Upload file
    const resp = await startUpload([file]);

    if (!resp) {
      console.error("❌ Upload failed");
      toast.error("❌ Upload Failed", {
        description: "Something went wrong. Please try again.",
      });
      return;
    }

    toast("📤 Upload processing", {
      description: `Processing File...`,
    });

    // Parse the pdf using langchain
    const summary = await generatePdfSummary(resp);
    console.log("PDF Summary:", summary);

    // ✅ Everything else after this is already handled in callbacks
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}

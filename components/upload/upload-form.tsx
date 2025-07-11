"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";
import { useRef, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false); // ✅ Step 1

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.success("✅ Upload Complete", {
        description: "Your file has been uploaded successfully.",
      });
    },
    onUploadError: (err) => {
      toast.error("❌ Upload Failed", {
        description: err.message || "An unexpected error occurred.",
      });
    },
    onUploadBegin: ({ file }) => {
      toast("📤 Upload Started", {
        description: `Uploading File...`,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // ✅ Step 2

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;

      const validated = schema.safeParse({ file });
      if (!validated.success) {
        const message =
          validated.error.flatten().fieldErrors.file?.[0] ?? "Invalid file.";
        toast.error("❌ Invalid File", {
          description: message,
        });
        return;
      }

      const resp = await startUpload([file]);
      if (!resp) {
        toast.error("❌ Upload Failed", {
          description: "Something went wrong. Please try again.",
        });
        return;
      }

      toast("📤 Upload processing", {
        description: `Processing File...`,
      });

      const result = await generatePdfSummary(resp);
      const { data = null } = result || {};

      if (data) {
        toast("📤 Saving PDF", {
          description: `Hang tight, your summary PDF is being saved...`,
        });
        formRef.current?.reset();
        // if(data.summary){
        // save the summary to db
        //}
      }
    } catch (error) {
      console.error("❌ Error during form submission:", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false); // ✅ Step 3
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        ref={formRef}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />{" "}
      {/* ✅ Step 4 */}
    </div>
  );
}

"use client";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.size < 24 * 1024 * 1024, "File must be a PDF")
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // validating the fields
    const validatedFields = schema.safeParse({ file });
    console.log(validatedFields);
    if (!validatedFields.success) {
      console.log(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid file"
      );
      return;
    }
    // schema validation with zod
    // upload file to Uploadthings
    // parse the pdf using lang chain
    // summarize the pdf using OpenAI or gemini
    // save the summary to db
    // redirect to the [id] summary page
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}

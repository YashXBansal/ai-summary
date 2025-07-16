import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async () => {
      const user = await currentUser();

      return {
        userId: user?.id || "anon-user", // ✅ fallback to "anon-user"
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ File uploaded for user:", metadata.userId);
      console.log("File URL:", file.url); // ✅ use correct property

      return {
        userId: metadata.userId,
        file: {
          name: file.name,
          url: file.url, // ✅ fixed
        },
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

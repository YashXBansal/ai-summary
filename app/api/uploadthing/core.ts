import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async () => {
      const user = await currentUser();

      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ File uploaded for user:", metadata.userId);
      console.log("File URL:", file.ufsUrl); // Use `file.url`, not ufsUrl

      // ✅ Return only JSON-safe data
      return {
        userId: metadata.userId,
        file
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
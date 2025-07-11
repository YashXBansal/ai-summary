import BgGradient from "@/components/common/bg-gradient";
import UploadForm from "@/components/upload/upload-form";
import { UploadHeader } from "@/components/upload/upload-header";

export default function UploadPage() {
  return (
    <BgGradient>
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl text-center">
          <UploadHeader />
          <UploadForm />
          <p className="mt-6 text-xs text-gray-400">
            Your files are secure & processed instantly. No data is stored.
          </p>
        </div>
      </section>
    </BgGradient>
  );
}

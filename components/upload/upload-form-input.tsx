"use client";
import { useState, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function UploadFormInput({ onSubmit }: UploadFormInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      const input = document.getElementById("file") as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <form
      className="w-full flex flex-col items-center gap-6"
      onSubmit={onSubmit}
    >
      <label
        htmlFor="file"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full cursor-pointer transition border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center justify-center text-center 
          ${
            isDragging
              ? "border-indigo-600 bg-indigo-50 dark:bg-gray-800"
              : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          } hover:border-indigo-500`}
      >
        <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {fileName || "Click or drag & drop your PDF here"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Max 24MB · PDF only</p>
        <Input
          id="file"
          name="file"
          type="file"
          accept="application/pdf"
          required
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        Upload PDF
      </Button>
    </form>
  );
}

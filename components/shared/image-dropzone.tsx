"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { UploadCloudIcon, XIcon } from "lucide-react";

interface ImageDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  className?: string;
  maxFiles?: number;
}

export function ImageDropzone({ onFilesAdded, className, maxFiles = 5 }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [previews, setPreviews] = React.useState<{ url: string; file: File }[]>([]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    const allowedNewFiles = newFiles.slice(0, maxFiles - previews.length);

    if (allowedNewFiles.length > 0) {
      const newPreviews = allowedNewFiles.map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
      onFilesAdded(allowedNewFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const removeImage = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors text-center cursor-pointer",
          isDragging
            ? "border-[#14B8A6] bg-[#14B8A6]/10"
            : "border-[#1E293B]/70 bg-[#0E121B]/50 hover:bg-[#1E293B]/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <UploadCloudIcon className="h-10 w-10 text-slate-400 mb-4" />
        <p className="text-sm text-slate-300 font-medium mb-1">
          Drag & drop images here, or click to select
        </p>
        <p className="text-xs text-slate-500">
          Supports JPG, PNG, WEBP. Max {maxFiles} files.
        </p>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {previews.map((preview, i) => (
            <div key={i} className="relative aspect-square rounded-md border border-[#1E293B]/70 overflow-hidden group bg-[#06080A]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.url} alt="Preview" className="object-cover w-full h-full" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

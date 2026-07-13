"use client";

import { useState } from "react";
import { FiImage, FiLoader, FiUploadCloud, FiX } from "react-icons/fi";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.url) {
    throw new Error(data?.message || "Upload failed");
  }

  return data.url as string;
}

type ImageUploadProps = {
  label: string;
  hint?: string;
  // Current image URLs. Single-item array when `multiple` is false.
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
};

export default function ImageUpload({
  label,
  hint,
  value,
  onChange,
  multiple = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const files = Array.from(fileList);
      const uploaded = await Promise.all(files.map((file) => uploadImage(file)));

      if (multiple) {
        onChange([...value, ...uploaded]);
      } else {
        onChange([uploaded[uploaded.length - 1]]);
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>

      <label className="nm-dent flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 text-center transition-all duration-200 hover:text-sky-700">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          disabled={isUploading}
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <span className="nm-protrude inline-flex h-11 w-11 items-center justify-center rounded-xl text-sky-700">
          {isUploading ? (
            <FiLoader className="animate-spin" size={18} aria-hidden="true" />
          ) : (
            <FiUploadCloud size={18} aria-hidden="true" />
          )}
        </span>
        <span className="text-sm font-semibold text-slate-600">
          {isUploading
            ? "Uploading..."
            : multiple
              ? "Click to upload images"
              : "Click to upload an image"}
        </span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </label>

      {error ? (
        <p role="alert" className="text-xs font-semibold text-rose-600">
          {error}
        </p>
      ) : null}

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="nm-protrude relative h-20 w-20 overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${label} ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Remove image"
                className="nm-protrude absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e0e5ec] text-rose-500 outline-none transition-all duration-200 hover:nm-dent active:nm-pressed"
              >
                <FiX size={13} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FiImage size={13} aria-hidden="true" />
          <span>No image selected</span>
        </div>
      )}
    </div>
  );
}

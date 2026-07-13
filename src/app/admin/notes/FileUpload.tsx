"use client";

import { useState } from "react";
import { fileUpload } from "@/lib/supabaseFileUpload";
import { FiFile, FiLoader, FiPaperclip, FiUploadCloud, FiX } from "react-icons/fi";

type FileItem = {
  url: string;
  filename: string;
};

type FileUploadProps = {
  label: string;
  hint?: string;
  value: FileItem[];
  onChange: (files: FileItem[]) => void;
};

export default function FileUpload({
  label,
  hint,
  value,
  onChange,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setError("");
    setIsUploading(true);

    try {
      const uploaded: FileItem[] = [];

      for (const file of Array.from(fileList)) {
        const url = await fileUpload(file);

        if (!url) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        uploaded.push({ url, filename: file.name });
      }

      onChange([...value, ...uploaded]);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload file.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>

      <label className="nm-dent flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 text-center transition-all duration-200 hover:text-sky-700">
        <input
          type="file"
          multiple
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
          {isUploading ? "Uploading..." : "Click to upload files"}
        </span>
        {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
      </label>

      {error ? (
        <p role="alert" className="text-xs font-semibold text-rose-600">
          {error}
        </p>
      ) : null}

      {value.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {value.map((file, index) => (
            <li
              key={`${file.url}-${index}`}
              className="nm-protrude flex items-center gap-3 rounded-xl px-3 py-2"
            >
              <div className="nm-dent flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-amber-600">
                <FiFile size={14} aria-hidden="true" />
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate text-xs font-semibold text-sky-700 underline-offset-2 hover:underline"
              >
                {file.filename}
              </a>
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${file.filename}`}
                className="nm-protrude inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e0e5ec] text-rose-500 outline-none transition-all duration-200 hover:nm-dent active:nm-pressed"
              >
                <FiX size={13} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FiPaperclip size={13} aria-hidden="true" />
          <span>No files attached</span>
        </div>
      )}
    </div>
  );
}

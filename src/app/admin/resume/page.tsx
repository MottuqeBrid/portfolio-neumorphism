"use client";

import type { SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  FiFileText,
  FiUpload,
  FiExternalLink,
  FiLoader,
  FiCheck,
} from "react-icons/fi";
import { fileUpload } from "@/lib/supabaseFileUpload";

type ResumeData = {
  _id: string;
  key: string;
  url: string;
  filename: string;
  createdAt: string;
  updatedAt: string;
};

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isActive = true;

    const loadResume = async () => {
      try {
        const res = await fetch("/api/admin/resume", { cache: "no-store" });
        const data = await res.json().catch(() => null);

        if (!isActive) return;

        if (!res.ok || !data?.resume) {
          setFetchError("Unable to load resume info.");
          return;
        }

        setResume(data.resume as ResumeData);
      } catch {
        if (isActive) setFetchError("Network error while loading resume.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadResume();
    return () => {
      isActive = false;
    };
  }, []);

  const handleUpload = async (
    event: SyntheticEvent<HTMLInputElement, Event>,
  ) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadSuccess("");
    setIsUploading(true);

    try {
      const url = await fileUpload(file);

      if (!url) {
        setUploadError("File upload failed. Please try again.");
        return;
      }

      const res = await fetch("/api/admin/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, filename: file.name }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadError(data?.message || "Unable to save resume. Please try again.");
        return;
      }

      setResume(data.resume as ResumeData);
      setUploadSuccess("Resume updated successfully.");
    } catch {
      setUploadError("Network error. Please check your connection and try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="nm-dent rounded-full px-6 py-3 text-sm font-semibold text-slate-500">
          Loading resume...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
          Resume
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your resume that visitors can download.
        </p>
      </div>

      {fetchError && !resume ? (
        <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-rose-600">
          {fetchError}
        </div>
      ) : null}

      <div className="nm-protrude flex flex-col gap-5 rounded-3xl p-6 sm:p-7">
        <h2 className="text-lg font-black tracking-tight text-slate-800">
          Current resume
        </h2>

        {resume ? (
          <div className="nm-dent flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="nm-protrude flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sky-600">
                <FiFileText size={26} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {resume.filename}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Updated{" "}
                  {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <a
              href={resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="nm-protrude inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
            >
              <FiExternalLink size={16} aria-hidden="true" />
              View resume
            </a>
          </div>
        ) : (
          <div className="nm-dent rounded-2xl p-8 text-center text-sm font-semibold text-slate-500">
            No resume uploaded yet.
          </div>
        )}
      </div>

      <div className="nm-protrude flex flex-col gap-5 rounded-3xl p-6 sm:p-7">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-800">
            {resume ? "Update resume" : "Upload resume"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Upload a PDF file to replace your current resume.
          </p>
        </div>

        <label
          className={`nm-dent flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300/60 p-8 text-center transition-all duration-200 hover:border-sky-400/60 hover:bg-sky-500/5 ${
            isUploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <div className="nm-protrude flex h-14 w-14 items-center justify-center rounded-2xl text-sky-600">
            {isUploading ? (
              <FiLoader size={24} className="animate-spin" aria-hidden="true" />
            ) : (
              <FiUpload size={24} aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">
              {isUploading ? "Uploading..." : "Click to select a PDF file"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              PDF only, max recommended 5 MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleUpload}
            disabled={isUploading}
            className="sr-only"
          />
        </label>

        {uploadError ? (
          <p
            role="alert"
            className="nm-dent rounded-xl px-4 py-3 text-sm font-semibold text-rose-600"
          >
            {uploadError}
          </p>
        ) : null}

        {uploadSuccess ? (
          <p
            role="status"
            className="nm-dent flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-600"
          >
            <FiCheck size={16} aria-hidden="true" />
            {uploadSuccess}
          </p>
        ) : null}
      </div>
    </div>
  );
}

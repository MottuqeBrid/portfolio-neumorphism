"use client";

import { FiX, FiClock, FiFile, FiImage } from "react-icons/fi";
import { editorBlocksToHtml } from "./htmlConverter";

type NoteData = {
  _id: string;
  title: string;
  editorData?: string;
  images?: string[];
  files?: { url: string; filename: string }[];
  createdAt: string;
  updatedAt: string;
};

type NoteViewModalProps = {
  note: NoteData;
  onClose: () => void;
};

export default function NoteViewModal({ note, onClose }: NoteViewModalProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  let html = "";
  if (note?.editorData) {
    try {
      const parsed = JSON.parse(note.editorData) as {
        blocks: Array<{ type: string; data: Record<string, unknown> }>;
      };
      html = editorBlocksToHtml(parsed);
      console.log("html:", html);
    } catch {
      html = "";
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-white/50 backdrop-blur-md sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-view-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="nm-protrude flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl sm:max-w-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-200/60 px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <h2
              id="note-view-title"
              className="truncate text-base font-black tracking-tight text-slate-900 sm:text-lg"
            >
              {note.title}
            </h2>
            <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <FiClock size={11} aria-hidden="true" />
                {formatDate(note.createdAt)} at {formatTime(note.createdAt)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="nm-protrude inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:text-slate-800 active:nm-pressed"
          >
            <FiX size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          {html ? (
            <div
              className="prose-note max-w-none text-sm leading-7 text-slate-700"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : null}

          {!html &&
          (!note.images || note.images.length === 0) &&
          (!note.files || note.files.length === 0) ? (
            <p className="py-6 text-center text-sm font-medium text-slate-500">
              This note is empty.
            </p>
          ) : null}

          {note.images && note.images.length > 0 ? (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                <FiImage size={13} aria-hidden="true" />
                <span>Images</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {note.images.map((url, i) => (
                  <a
                    key={`${url}-${i}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nm-protrude block h-24 w-24 overflow-hidden rounded-2xl transition-all duration-200 hover:nm-dent"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Note image ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {note.files && note.files.length > 0 ? (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                <FiFile size={13} aria-hidden="true" />
                <span>Files</span>
              </div>
              <ul className="flex flex-col gap-2">
                {note.files.map((file, i) => (
                  <li
                    key={`${file.url}-${i}`}
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
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

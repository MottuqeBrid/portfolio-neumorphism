"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSave,
  FiX,
  FiLoader,
  FiFileText,
} from "react-icons/fi";
import NoteViewModal from "./NoteViewModal";
import ImageUpload from "../projects/ImageUpload";
import FileUpload from "./FileUpload";
import type { TiptapEditorHandle } from "@/_components/editor";

const TiptapEditor = dynamic(
  () => import("@/_components/editor").then((m) => m.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FiLoader className="animate-spin" />
          <span>Loading editor...</span>
        </div>
      </div>
    ),
  },
);

type NoteInstance = {
  _id: string;
  title: string;
  editorData?: string;
  images?: string[];
  files?: { url: string; filename: string }[];
  createdAt: string;
  updatedAt: string;
};

const inputClass =
  "nm-dent w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]";

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<{ url: string; filename: string }[]>([]);
  const [editorContent, setEditorContent] = useState<string>("");
  const [editorKey, setEditorKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const editorRef = useRef<TiptapEditorHandle | null>(null);

  const [viewingNote, setViewingNote] = useState<NoteInstance | null>(null);
  const [pendingDelete, setPendingDelete] = useState<NoteInstance | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const fetchNotes = async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/notes", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data)) {
        setFetchError("Unable to load notes.");
        return;
      }
      setNotes(data as NoteInstance[]);
    } catch {
      setFetchError("Network error while loading notes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const note = () => {
      void fetchNotes();
    };
    note();
  }, []);

  const resetForm = () => {
    setTitle("");
    setImages([]);
    setFiles([]);
    setEditorContent("");
    setEditorKey((k) => k + 1);
    setEditingId(null);
    setFormError("");
    setFormSuccess("");
  };

  const startEdit = (note: NoteInstance) => {
    setEditingId(note._id);
    setTitle(note.title);
    setImages(note.images ?? []);
    setFiles(note.files ?? []);
    setEditorContent(note.editorData ?? "");
    setEditorKey((k) => k + 1);
    setFormError("");
    setFormSuccess("");
  };

  const handleEditorUpdate = useCallback((_json: unknown, html: string) => {
    setEditorContent(html);
  }, []);

  const handleSubmit = async () => {
    setFormError("");
    setFormSuccess("");

    if (!title.trim()) {
      setFormError("Note title is required.");
      return;
    }

    if (!editorRef.current) {
      setFormError("Editor is not ready. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const json = editorRef.current.getJSON();
      const content = JSON.stringify(json);

      const isEmpty =
        !json.content ||
        json.content.length === 0 ||
        (json.content.length === 1 &&
          json.content[0].type === "paragraph" &&
          !json.content[0].content);

      if (isEmpty) {
        setFormError("Note content cannot be empty.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...(editingId ? { id: editingId } : {}),
        title: title.trim(),
        editorData: content,
        images,
        files,
      };

      const method = editingId ? "PATCH" : "POST";

      const res = await fetch("/api/notes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(data?.message || "Unable to save note. Please try again.");
        return;
      }

      if (editingId) {
        setNotes((prev) =>
          prev.map((n) => (n._id === editingId ? data.note : n)),
        );
        setFormSuccess("Note updated successfully.");
      } else {
        setNotes((prev) => [data.note, ...prev]);
        setFormSuccess("Note created successfully.");
      }

      resetForm();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleteError("");
    setDeletingId(pendingDelete._id);
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pendingDelete._id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data?.message || "Unable to delete note.");
        return;
      }
      setNotes((prev) => prev.filter((n) => n._id !== pendingDelete._id));
    } catch {
      setDeleteError("Network error while deleting.");
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="nm-dent rounded-full px-6 py-3 text-sm font-semibold text-slate-500">
          Loading notes...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
          Notes
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Write and manage your notes with a rich text editor.
        </p>
      </div>

      <div className="nm-protrude flex flex-col gap-5 rounded-3xl p-6 sm:p-7">
        <h2 className="text-lg font-black tracking-tight text-slate-800">
          {editingId ? "Edit note" : "New note"}
        </h2>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-slate-700">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className={inputClass}
          />
        </label>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Content</span>
            {saveStatus !== "idle" && (
              <span
                className={`text-xs font-medium ${saveStatus === "saving" ? "text-amber-600" : saveStatus === "saved" ? "text-emerald-600" : ""}`}
              >
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "saved"
                    ? "Saved"
                    : ""}
              </span>
            )}
          </div>
          <div className="nm-dent rounded-xl overflow-hidden">
            <TiptapEditor
              key={editorKey}
              ref={editorRef}
              content={editorContent || undefined}
              editable
              onUpdate={handleEditorUpdate}
              placeholder="Start writing your note..."
            />
          </div>
        </div>

        <ImageUpload
          label="Images"
          hint="Optional - attach images to this note"
          value={images}
          onChange={setImages}
          multiple
        />

        <FileUpload
          label="Files"
          hint="Optional - attach files to this note"
          value={files}
          onChange={setFiles}
        />

        {formError ? (
          <p
            role="alert"
            className="nm-dent rounded-xl px-4 py-3 text-sm font-semibold text-rose-600"
          >
            {formError}
          </p>
        ) : null}

        {formSuccess ? (
          <p
            role="status"
            className="nm-dent rounded-xl px-4 py-3 text-sm font-semibold text-emerald-600"
          >
            {formSuccess}
          </p>
        ) : null}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting}
            className="nm-protrude inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:nm-protrude"
          >
            {isSubmitting ? (
              <FiLoader className="animate-spin text-lg" aria-hidden="true" />
            ) : editingId ? (
              <FiSave className="text-lg" aria-hidden="true" />
            ) : (
              <FiPlus className="text-lg" aria-hidden="true" />
            )}
            <span>
              {isSubmitting
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Add note"}
            </span>
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="nm-protrude inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-slate-600 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiX className="text-lg" aria-hidden="true" />
              <span>Cancel</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-slate-800">
          All notes
        </h2>
        <span className="nm-dent rounded-full px-3 py-1 text-xs font-black text-sky-700">
          {notes.length}
        </span>
      </div>

      {fetchError ? (
        <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-rose-600">
          {fetchError}
        </div>
      ) : notes.length === 0 ? (
        <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-slate-500">
          No notes yet. Start writing above.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li
              key={note._id}
              className="nm-protrude flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="nm-dent flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sky-600">
                    <FiFileText size={16} aria-hidden="true" />
                  </div>
                  <h3 className="truncate text-sm font-bold text-slate-800">
                    {note.title}
                  </h3>
                </div>
                <div className="mt-2 flex items-center gap-3 pl-11 text-xs text-slate-500">
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              </div>

              <div className="flex shrink-0 gap-1.5 pl-11 sm:pl-0">
                <button
                  type="button"
                  onClick={() => setViewingNote(note)}
                  aria-label={`View ${note.title}`}
                  className="nm-protrude inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed"
                >
                  <FiEye size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(note)}
                  disabled={editingId !== null}
                  aria-label={`Edit ${note.title}`}
                  className={`nm-protrude inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-50 ${
                    editingId === note._id
                      ? "text-sky-600 ring-2 ring-sky-400/60"
                      : "text-slate-500 hover:text-sky-700"
                  }`}
                >
                  <FiEdit2 size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(note)}
                  disabled={deletingId === note._id}
                  aria-label={`Delete ${note.title}`}
                  className="nm-protrude inline-flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewingNote ? (
        <NoteViewModal
          note={viewingNote}
          onClose={() => setViewingNote(null)}
        />
      ) : null}

      {pendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-note-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPendingDelete(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setPendingDelete(null);
          }}
        >
          <div className="nm-protrude mx-4 flex w-full max-w-sm flex-col gap-5 rounded-3xl p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="nm-dent flex h-12 w-12 items-center justify-center rounded-2xl text-rose-600">
                <FiTrash2 size={22} aria-hidden="true" />
              </div>
              <div>
                <h3
                  id="delete-note-title"
                  className="text-base font-black tracking-tight text-slate-900"
                >
                  Delete note?
                </h3>
                <p className="mt-0.5 text-sm font-medium text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-700">
              Delete{" "}
              <span className="font-black text-slate-900">
                {pendingDelete.title}
              </span>
              ?
            </p>

            {deleteError && deletingId === null ? (
              <p
                role="alert"
                className="nm-dent rounded-xl px-4 py-3 text-sm font-semibold text-rose-600"
              >
                {deleteError}
              </p>
            ) : null}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deletingId !== null}
                className="nm-protrude inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-slate-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deletingId !== null}
                className="nm-protrude inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-500/10 px-5 text-sm font-black text-rose-700 transition-all duration-200 outline-none hover:bg-rose-500/20 active:nm-pressed disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiTrash2 size={15} aria-hidden="true" />
                {deletingId !== null ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

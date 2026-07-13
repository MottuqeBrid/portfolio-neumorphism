"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiTrash2,
  FiLoader,
  FiMail,
  FiSend,
  FiX,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
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

type EmailInstance = {
  _id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  messageId: string | null;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

const inputClass =
  "nm-dent w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]";

export default function EmailPage() {
  const [emails, setEmails] = useState<EmailInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [from, setFrom] = useState("me@brid.bd");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<TiptapEditorHandle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [viewingEmail, setViewingEmail] = useState<EmailInstance | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EmailInstance | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const fetchEmails = async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/email", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.emails) {
        setFetchError("Unable to load emails.");
        return;
      }
      setEmails((data.emails as EmailInstance[]).filter((e) => !e.isDeleted));
    } catch {
      setFetchError("Network error while loading emails.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = () => {
      void fetchEmails();
    };
    load();
  }, []);

  const resetForm = () => {
    setFrom("");
    setTo("");
    setSubject("");
    setEditorKey((k) => k + 1);
    setFormError("");
    setFormSuccess("");
  };

  const handleSubmit = useCallback(async () => {
    setFormError("");
    setFormSuccess("");
    if (!from.trim() || !to.trim() || !subject.trim()) {
      setFormError("From, To, and Subject are required.");
      return;
    }
    const html = editorRef.current?.getHTML() ?? "";
    if (!html || html === "<p></p>") {
      setFormError("Message cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, message: html }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(data?.message || "Failed to send email.");
        return;
      }
      setFormSuccess("Email sent successfully!");
      resetForm();
      void fetchEmails();
    } catch {
      setFormError("Network error while sending email.");
    } finally {
      setIsSubmitting(false);
    }
  }, [from, to, subject]);

  const handleDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setDeleteError("");
    setDeletingId(pendingDelete._id);
    try {
      const res = await fetch("/api/admin/email", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: pendingDelete._id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data?.message || "Unable to delete email.");
        return;
      }
      setEmails((prev) => prev.filter((e) => e._id !== pendingDelete._id));
    } catch {
      setDeleteError("Network error while deleting.");
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  }, [pendingDelete]);

  const toggleRead = useCallback(async (email: EmailInstance) => {
    try {
      const res = await fetch("/api/admin/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: email._id, isRead: !email.isRead }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.email) {
        setEmails((prev) =>
          prev.map((e) =>
            e._id === email._id ? { ...e, isRead: !e.isRead } : e,
          ),
        );
      }
    } catch {
      // silent
    }
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="nm-dent rounded-full px-6 py-3 text-sm font-semibold text-slate-500">
          Loading emails...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
          Email
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Send and manage your emails.
        </p>
      </div>

      <div className="nm-protrude flex flex-col gap-5 rounded-3xl p-6 sm:p-7">
        <h2 className="text-lg font-black tracking-tight text-slate-800">
          Compose
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">From</span>
            <input
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">To</span>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@email.com"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-slate-700">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className={inputClass}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-slate-700">Message</span>
          <div className="nm-dent rounded-xl overflow-hidden">
            <TiptapEditor
              key={editorKey}
              ref={editorRef}
              editable
              placeholder="Write your message..."
            />
          </div>
        </div>

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
            ) : (
              <FiSend className="text-lg" aria-hidden="true" />
            )}
            <span>{isSubmitting ? "Sending..." : "Send email"}</span>
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={isSubmitting}
            className="nm-protrude inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-slate-600 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiX className="text-lg" aria-hidden="true" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-slate-800">
          All emails
        </h2>
        <span className="nm-dent rounded-full px-3 py-1 text-xs font-black text-sky-700">
          {emails.length}
        </span>
      </div>

      {fetchError ? (
        <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-rose-600">
          {fetchError}
        </div>
      ) : emails.length === 0 ? (
        <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-slate-500">
          No emails yet. Send one above.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {emails.map((email) => (
            <li
              key={email._id}
              className={`nm-protrude flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${
                !email.isRead ? "ring-2 ring-sky-400/40" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`nm-dent flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      !email.isRead ? "text-sky-600" : "text-slate-400"
                    }`}
                  >
                    <FiMail size={16} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`truncate text-sm ${
                        !email.isRead
                          ? "font-black text-slate-800"
                          : "font-semibold text-slate-600"
                      }`}
                    >
                      {email.subject}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span>
                        From: {email.from} → To: {email.to}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>{formatDate(email.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-1.5 pl-11 sm:pl-0">
                <button
                  type="button"
                  onClick={() => setViewingEmail(email)}
                  aria-label={`View ${email.subject}`}
                  className="nm-protrude inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed"
                >
                  <FiEye size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => void toggleRead(email)}
                  aria-label={email.isRead ? "Mark as unread" : "Mark as read"}
                  className="nm-protrude inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 outline-none hover:nm-dent hover:text-amber-600 active:nm-pressed"
                >
                  {email.isRead ? (
                    <FiEyeOff size={15} aria-hidden="true" />
                  ) : (
                    <FiEye size={15} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(email)}
                  disabled={deletingId === email._id}
                  aria-label={`Delete ${email.subject}`}
                  className="nm-protrude inline-flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewingEmail ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setViewingEmail(null)}
        >
          <div
            className="nm-protrude mx-4 flex max-h-[80vh] w-full max-w-6xl flex-col gap-5 rounded-3xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-black tracking-tight text-slate-800">
                  {viewingEmail.subject}
                </h2>
                <div className="mt-1 flex flex-col gap-0.5 text-xs text-slate-500">
                  <span>
                    <strong className="text-slate-600">From:</strong>{" "}
                    {viewingEmail.from}
                  </span>
                  <span>
                    <strong className="text-slate-600">To:</strong>{" "}
                    {viewingEmail.to}
                  </span>
                  <span>{formatDate(viewingEmail.createdAt)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingEmail(null)}
                className="nm-protrude inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed"
              >
                <FiX size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="nm-dent max-h-[50vh] overflow-y-auto rounded-2xl p-5">
              <div
                className="prose-note text-sm leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{ __html: viewingEmail.message }}
              />
            </div>

            {viewingEmail.messageId ? (
              <p className="truncate text-xs text-slate-400">
                Message ID: {viewingEmail.messageId}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {pendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-email-title"
          onClick={() => {
            setPendingDelete(null);
            setDeleteError("");
          }}
        >
          <div
            className="nm-protrude mx-4 flex w-full max-w-sm flex-col gap-5 rounded-3xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="delete-email-title"
              className="text-lg font-black tracking-tight text-slate-800"
            >
              Delete email?
            </h2>
            <p className="text-sm text-slate-600">
              This will permanently delete{" "}
              <strong>&ldquo;{pendingDelete.subject}&rdquo;</strong>. This
              action cannot be undone.
            </p>

            {deleteError ? (
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
                onClick={() => void handleDelete()}
                disabled={deletingId !== null}
                className="nm-protrude inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-rose-600 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:nm-protrude"
              >
                {deletingId ? (
                  <FiLoader
                    className="animate-spin text-lg"
                    aria-hidden="true"
                  />
                ) : (
                  <FiTrash2 className="text-lg" aria-hidden="true" />
                )}
                <span>{deletingId ? "Deleting..." : "Delete"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingDelete(null);
                  setDeleteError("");
                }}
                disabled={deletingId !== null}
                className="nm-protrude inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-slate-600 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiX className="text-lg" aria-hidden="true" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

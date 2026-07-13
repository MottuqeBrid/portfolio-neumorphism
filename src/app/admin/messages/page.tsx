"use client";

import { useEffect, useState } from "react";
import {
  FiMail,
  FiInbox,
  FiTrash2,
  FiRefreshCw,
  FiUser,
  FiClock,
} from "react-icons/fi";
import type { EmailInstance } from "@/models/Email.Model";

export default function EmailPage() {
  const [emails, setEmails] = useState<EmailInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EmailInstance | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const unreadCount = emails.filter((e) => !e.isRead).length;

  const fetchEmails = async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/emails", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data)) {
        setFetchError("Unable to load messages.");
        return;
      }
      setEmails(data as EmailInstance[]);
    } catch {
      setFetchError("Network error while loading messages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const email = () => {
      void fetchEmails();
    };
    email();
  }, []);

  const toggleRead = async (email: EmailInstance) => {
    setTogglingId(email._id);
    try {
      const res = await fetch("/api/emails", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: email._id, isRead: !email.isRead }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.email) {
        setEmails((prev) =>
          prev.map((e) => (e._id === email._id ? data.email : e)),
        );
      }
    } catch {
      // silent
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleteError("");
    setDeletingId(pendingDelete._id);
    try {
      const res = await fetch("/api/emails", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pendingDelete._id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data?.message || "Unable to delete message.");
        return;
      }
      setEmails((prev) => prev.filter((e) => e._id !== pendingDelete._id));
      if (expandedId === pendingDelete._id) setExpandedId(null);
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

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="nm-dent rounded-full px-6 py-3 text-sm font-semibold text-slate-500">
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
            Messages
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Messages submitted through your contact form.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {unreadCount > 0 ? (
            <span className="nm-dent inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black text-sky-700">
              <FiMail size={13} aria-hidden="true" />
              {unreadCount} unread
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => void fetchEmails()}
            disabled={isLoading}
            aria-label="Refresh messages"
            className="nm-protrude inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {fetchError ? (
        <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-rose-600">
          {fetchError}
        </div>
      ) : emails.length === 0 ? (
        <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-slate-500">
          No messages yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {emails.map((email) => {
            const isExpanded = expandedId === email._id;

            return (
              <li
                key={email._id}
                className={`nm-protrude overflow-hidden rounded-3xl transition-all duration-200 ${
                  !email.isRead ? "ring-2 ring-sky-400/30" : ""
                }`}
              >
                <div className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                  <div
                    className={`nm-dent flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      email.isRead ? "text-slate-400" : "text-sky-600"
                    }`}
                  >
                    {email.isRead ? (
                      <FiInbox size={20} aria-hidden="true" />
                    ) : (
                      <FiMail size={20} aria-hidden="true" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : email._id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h3
                        className={`truncate text-sm ${
                          email.isRead
                            ? "font-medium text-slate-600"
                            : "font-bold text-slate-800"
                        }`}
                      >
                        {email.name}
                      </h3>
                      {!email.isRead ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                      ) : null}
                    </div>
                    <p
                      className={`mt-0.5 truncate text-xs ${
                        email.isRead ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {email.subject}
                    </p>
                  </button>

                  <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">
                    {formatDate(email.createdAt)}
                  </span>

                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => void toggleRead(email)}
                      disabled={togglingId === email._id}
                      aria-label={
                        email.isRead
                          ? `Mark ${email.subject} as unread`
                          : `Mark ${email.subject} as read`
                      }
                      className="nm-protrude inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {email.isRead ? (
                        <FiMail size={15} aria-hidden="true" />
                      ) : (
                        <FiInbox size={15} aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(email)}
                      disabled={deletingId === email._id}
                      aria-label={`Delete message from ${email.name}`}
                      className="nm-protrude inline-flex h-9 w-9 items-center justify-center rounded-xl text-rose-500 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiTrash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="border-t border-slate-200/60 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FiUser size={12} aria-hidden="true" />
                        {email.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FiClock size={12} aria-hidden="true" />
                        {formatDate(email.createdAt)} at{" "}
                        {formatTime(email.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                      {email.message}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {pendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-msg-title"
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
                  id="delete-msg-title"
                  className="text-base font-black tracking-tight text-slate-900"
                >
                  Delete message?
                </h3>
                <p className="mt-0.5 text-sm font-medium text-slate-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-700">
              Delete message from{" "}
              <span className="font-black text-slate-900">
                {pendingDelete.name}
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
                className="nm-protrude inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-slate-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-slate-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void confirmDelete()}
                disabled={deletingId !== null}
                className="nm-protrude inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-500/10 px-5 text-sm font-black text-rose-700 transition-all duration-200 outline-none hover:bg-rose-500/20 active:nm-pressed focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] disabled:cursor-not-allowed disabled:opacity-50"
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

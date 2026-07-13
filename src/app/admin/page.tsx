"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiMail,
  FiSearch,
  FiChevronDown,
  FiX,
  FiLoader,
  FiArrowUp,
  FiArrowDown,
  FiUsers,
  FiCalendar,
  FiInbox,
} from "react-icons/fi";

type Email = {
  _id: string;
  email: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments: unknown[];
  messageId: string;
  replyTo: string | null;
  receivedAt: string;
  headers: Record<string, string>;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type SortKey = "date-desc" | "date-asc" | "subject" | "sender";

const PAGE_SIZE = 10;

const inputClass =
  "nm-dent w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateText(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

function extractPreview(html: string, text: string) {
  if (text && text.trim()) return truncateText(text.trim(), 150);
  const div = document.createElement("div");
  div.innerHTML = html;
  const plain = div.textContent || div.innerText || "";
  return truncateText(plain.trim(), 150);
}

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  const [viewingEmail, setViewingEmail] = useState<Email | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setFetchError("");
      try {
        const res = await fetch(
          "https://notes-nextjs-three.vercel.app/api/email",
          { signal: controller.signal, cache: "no-store" },
        );
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.emails) {
          setFetchError("Unable to load emails.");
          return;
        }
        setEmails(
          (data.emails as Email[]).filter((e) => !e.isDeleted),
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setFetchError("Network error while loading emails.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = emails;

    if (q) {
      list = list.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.from.toLowerCase().includes(q) ||
          e.text.toLowerCase().includes(q),
      );
    }

    const sorted = [...list];
    switch (sortKey) {
      case "date-desc":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "date-asc":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "subject":
        sorted.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
      case "sender":
        sorted.sort((a, b) => a.from.localeCompare(b.from));
        break;
    }

    return sorted;
  }, [emails, search, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const uniqueSenders = useMemo(
    () => new Set(emails.map((e) => e.from)).size,
    [emails],
  );

  const sortLabels: Record<SortKey, string> = {
    "date-desc": "Newest first",
    "date-asc": "Oldest first",
    subject: "Subject A-Z",
    sender: "Sender A-Z",
  };

  const handleView = useCallback((email: Email) => {
    setViewingEmail(email);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="nm-dent flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold text-slate-500">
          <FiLoader className="animate-spin" />
          <span>Loading emails...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="nm-dent rounded-3xl p-10">
          <FiMail className="mx-auto mb-4 text-4xl text-rose-400" />
          <h2 className="text-lg font-black text-slate-800">
            Failed to load emails
          </h2>
          <p className="mt-2 text-sm text-slate-500">{fetchError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
          Email Inbox
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View all incoming emails from your Brevo inbox.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="nm-protrude flex items-center gap-4 rounded-2xl p-5">
          <div className="nm-dent flex h-12 w-12 items-center justify-center rounded-xl text-sky-600">
            <FiInbox size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">
              {emails.length}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Total emails
            </p>
          </div>
        </div>
        <div className="nm-protrude flex items-center gap-4 rounded-2xl p-5">
          <div className="nm-dent flex h-12 w-12 items-center justify-center rounded-xl text-violet-600">
            <FiUsers size={20} />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">
              {uniqueSenders}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Unique senders
            </p>
          </div>
        </div>
        <div className="nm-protrude flex items-center gap-4 rounded-2xl p-5">
          <div className="nm-dent flex h-12 w-12 items-center justify-center rounded-xl text-emerald-600">
            <FiCalendar size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-slate-800">
              {emails.length > 0
                ? formatDate(
                    emails.reduce((latest, e) =>
                      new Date(e.createdAt) > new Date(latest.createdAt)
                        ? e
                        : latest,
                    ).createdAt,
                  )
                : "—"}
            </p>
            <p className="text-xs font-semibold text-slate-500">Latest email</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by subject, sender, or content..."
            className={`${inputClass} pl-11`}
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <FiX size={16} />
            </button>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((o) => !o)}
            className="nm-protrude inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed"
          >
            {sortKey === "date-desc" || sortKey === "date-asc" ? (
              sortKey === "date-desc" ? (
                <FiArrowDown size={14} />
              ) : (
                <FiArrowUp size={14} />
              )
            ) : null}
            <span>{sortLabels[sortKey]}</span>
            <FiChevronDown
              size={14}
              className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
            />
          </button>

          {sortOpen ? (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSortOpen(false)}
              />
              <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl nm-protrude p-1.5">
                {(Object.entries(sortLabels) as [SortKey, string][]).map(
                  ([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSortKey(key);
                        setCurrentPage(1);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 ${
                        sortKey === key
                          ? "nm-pressed text-sky-700"
                          : "text-slate-600 hover:nm-protrude-sm hover:text-sky-700"
                      }`}
                    >
                      {key === "date-desc" || key === "date-asc" ? (
                        key === "date-desc" ? (
                          <FiArrowDown size={13} />
                        ) : (
                          <FiArrowUp size={13} />
                        )
                      ) : null}
                      {label}
                    </button>
                  ),
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-slate-800">
          All emails
        </h2>
        <span className="nm-dent rounded-full px-3 py-1 text-xs font-black text-sky-700">
          {filtered.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="nm-dent rounded-3xl p-10 text-center">
          <FiMail className="mx-auto mb-3 text-3xl text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">
            {search ? "No emails match your search." : "No emails found."}
          </p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {paginated.map((email) => (
              <li
                key={email._id}
                className="nm-protrude flex flex-col gap-3 rounded-3xl p-5 transition-all duration-200 hover:nm-dent sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="nm-dent mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sky-600">
                      <FiMail size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black text-slate-800">
                        {email.subject}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                        <span className="font-semibold text-slate-600">
                          {email.from}
                        </span>
                        <span className="text-slate-300">→</span>
                        <span>{email.to}</span>
                        <span className="text-slate-300">·</span>
                        <span>{formatDate(email.createdAt)}</span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                        {extractPreview(email.html, email.text)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 pl-13 sm:pl-0">
                  <button
                    type="button"
                    onClick={() => handleView(email)}
                    className="nm-protrude inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed"
                  >
                    <FiMail size={14} />
                    <span>View</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="nm-protrude inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-bold text-slate-600 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:nm-protrude"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - safePage) <= 1,
                )
                .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) {
                    acc.push("ellipsis");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "ellipsis" ? (
                    <span
                      key={`e-${i}`}
                      className="px-1 text-sm text-slate-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      className={`nm-protrude inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 outline-none hover:nm-dent active:nm-pressed ${
                        safePage === item
                          ? "nm-pressed text-sky-700"
                          : "text-slate-600"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="nm-protrude inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-bold text-slate-600 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:nm-protrude"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}

      {viewingEmail ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setViewingEmail(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setViewingEmail(null);
          }}
        >
          <div
            className="nm-protrude mx-4 flex max-h-[85vh] w-full max-w-4xl flex-col gap-5 rounded-3xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-black tracking-tight text-slate-800">
                  {viewingEmail.subject}
                </h2>
                <div className="mt-2 flex flex-col gap-1 text-xs text-slate-500">
                  <span>
                    <strong className="text-slate-600">From:</strong>{" "}
                    {viewingEmail.from}
                  </span>
                  <span>
                    <strong className="text-slate-600">To:</strong>{" "}
                    {viewingEmail.to}
                  </span>
                  <span>
                    <strong className="text-slate-600">Received:</strong>{" "}
                    {formatDate(viewingEmail.receivedAt)}
                  </span>
                  {viewingEmail.replyTo ? (
                    <span>
                      <strong className="text-slate-600">Reply-To:</strong>{" "}
                      {viewingEmail.replyTo}
                    </span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingEmail(null)}
                className="nm-protrude inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="nm-dent max-h-[60vh] overflow-y-auto rounded-2xl p-5 sm:p-6">
              <div
                className="prose-note text-sm leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{ __html: viewingEmail.html }}
              />
            </div>

            {viewingEmail.attachments.length > 0 ? (
              <div>
                <p className="mb-2 text-xs font-bold text-slate-600">
                  Attachments ({viewingEmail.attachments.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {viewingEmail.attachments.map((att, i) => (
                    <span
                      key={i}
                      className="nm-dent-sm rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500"
                    >
                      {(att as { name?: string })?.name ?? `File ${i + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {viewingEmail.messageId ? (
              <p className="truncate text-xs text-slate-400">
                Message ID: {viewingEmail.messageId}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

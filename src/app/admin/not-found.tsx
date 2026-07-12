import Link from "next/link";
import { FiGrid, FiHome } from "react-icons/fi";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-4 py-8">
      <div className="nm-protrude flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl p-8 text-center sm:p-10">
        <span className="nm-dent inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-sky-700">
          Admin · 404
        </span>

        <div className="nm-dent inline-flex h-24 w-24 items-center justify-center rounded-3xl text-sky-700">
          <FiGrid size={40} aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
            Page not found
          </h1>
          <p className="mx-auto max-w-sm text-base leading-7 text-slate-600">
            This admin page doesn&apos;t exist or may have been moved. Head back
            to the dashboard to continue managing your content.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin"
            className="nm-protrude inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
          >
            <FiGrid className="text-lg" aria-hidden="true" />
            <span>Back to dashboard</span>
          </Link>
          <Link
            href="/"
            className="nm-dent inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-slate-700 transition-all duration-200 outline-none hover:nm-protrude hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
          >
            <FiHome className="text-lg" aria-hidden="true" />
            <span>View site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

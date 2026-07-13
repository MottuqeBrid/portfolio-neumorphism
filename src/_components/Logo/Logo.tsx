import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Code House home"
      className="group flex items-center gap-3 rounded-2xl px-1.5 py-1 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#e0e5ec]"
    >
      <div className="nm-protrude relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-active:nm-pressed">
        <span className="absolute inset-1 rounded-2xl bg-linear-to-br from-white/70 via-sky-100/70 to-sky-300/50" />
        <span className="absolute bottom-1 left-1 h-3 w-3 rounded-full bg-sky-500/25 blur-sm" />
        <span className="relative text-xl font-black tracking-[-0.04em] text-sky-700 drop-shadow-sm">
          MB
        </span>
      </div>

      <div className="hidden leading-none sm:block">
        <span className="block text-xl font-black tracking-tight text-gray-800 transition-colors duration-300 group-hover:text-sky-700">
          Code
        </span>
        <span className="mt-1 block text-[0.68rem] font-bold uppercase tracking-[0.26em] text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
          House
        </span>
      </div>
    </Link>
  );
}

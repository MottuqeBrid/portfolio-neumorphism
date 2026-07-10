import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      {/* Logo Icon */}
      <div className="nm-protrude flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105">
        <span className="text-2xl font-black text-sky-600">N</span>
      </div>

      {/* Logo Text */}
      <div className="leading-tight">
        <h1 className="text-xl font-extrabold tracking-tight text-gray-800">
          NeoUI
        </h1>
        <p className="text-xs font-medium tracking-widest text-gray-500 uppercase">
          Soft Design
        </p>
      </div>
    </Link>
  );
}

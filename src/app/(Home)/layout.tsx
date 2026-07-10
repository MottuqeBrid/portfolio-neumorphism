import type { ReactNode } from "react";
import Navbar from "@/_component/Navbar/Navbar";

export default function HomeLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#e0e5ec] text-slate-800">
      <Navbar />
      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}

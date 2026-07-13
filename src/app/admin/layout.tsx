import type { ReactNode } from "react";
import ScrollToTop from "@/_components/ScrollToTop/ScrollToTop";
import AdminNavbar from "@/_components/AdminNavbar/AdminNavbar";

export default function HomeLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#e0e5ec] text-slate-800">
      <AdminNavbar />
      <main className="relative mx-auto w-full max-w-7xl  pb-8 pt-24 sm:pb-10 sm:pt-28">
        {children}
      </main>
      <ScrollToTop />
    </div>
  );
}

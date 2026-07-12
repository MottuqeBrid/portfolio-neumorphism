"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import Logo from "../Logo/Logo";
import { LuLogOut, LuMenu, LuX } from "react-icons/lu";
import { FiFileText, FiFolder, FiGrid, FiMail, FiBook } from "react-icons/fi";

type AdminNavItem = {
  name: string;
  href: string;
  icon: IconType;
};

const adminNavItems: AdminNavItem[] = [
  { name: "Dashboard", href: "/admin", icon: FiGrid },
  { name: "Projects", href: "/admin/projects", icon: FiFolder },
  { name: "Resume", href: "/admin/resume", icon: FiFileText },
  { name: "Messages", href: "/admin/messages", icon: FiMail },
  { name: "Notes", href: "/admin/notes", icon: FiBook },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const isNavItemActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 8;
      setIsScrolled(scrolled);
      if (scrolled) {
        setIsMenuOpen(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={`mx-auto flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled
            ? "nm-protrude mt-2 max-w-6xl rounded-2xl bg-[#e0e5ec]/80 px-3 py-2.5 backdrop-blur-md sm:mt-3 sm:px-4"
            : "mt-0 max-w-7xl rounded-none bg-transparent px-4 py-4 sm:px-6 lg:px-8"
        }`}
      >
        <div className="flex items-center gap-3">
          <Logo />
          <span className="nm-dent hidden rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-sky-700 sm:inline-flex">
            Admin
          </span>
        </div>

        <ul className="nm-dent hidden items-center gap-1 rounded-2xl p-1.5 lg:flex">
          {adminNavItems.map(({ name, href, icon: Icon }) => {
            const isActive = isNavItemActive(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] ${
                    isActive
                      ? "nm-pressed text-sky-700"
                      : "text-gray-600 hover:nm-protrude hover:text-sky-700"
                  }`}
                >
                  <Icon className="text-base" aria-hidden="true" />
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="nm-protrude hidden h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-gray-700 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] md:flex"
          >
            <LuLogOut className="text-lg" aria-hidden="true" />
            <span>Logout</span>
          </Link>

          <button
            type="button"
            aria-controls="admin-mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="nm-protrude inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl text-gray-700 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] lg:hidden"
          >
            {isMenuOpen ? (
              <LuX aria-hidden="true" />
            ) : (
              <LuMenu aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="admin-mobile-navigation"
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isMenuOpen ? "max-h-128 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`mx-auto px-4 pb-5 pt-3 transition-all duration-300 sm:px-6 ${
            isScrolled ? "max-w-6xl" : "max-w-7xl"
          }`}
        >
          <div className="nm-protrude rounded-2xl bg-[#e0e5ec]/80 p-3 backdrop-blur-md">
            <ul className="grid gap-2 sm:grid-cols-2">
              {adminNavItems.map(({ name, href, icon: Icon }) => {
                const isActive = isNavItemActive(href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] ${
                        isActive
                          ? "nm-pressed text-sky-700"
                          : "nm-dent text-gray-700 hover:nm-protrude hover:text-sky-700"
                      }`}
                    >
                      <Icon className="text-lg" aria-hidden="true" />
                      <span>{name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 border-t border-slate-300/60 pt-3">
              <Link
                href="/login"
                onClick={closeMenu}
                className="nm-dent flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-200 outline-none hover:nm-protrude hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
              >
                <span>Logout</span>
                <LuLogOut className="text-lg" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

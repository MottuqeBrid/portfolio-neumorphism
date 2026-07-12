"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo/Logo";
import { LuLogIn, LuMenu, LuX } from "react-icons/lu";
import { BiDownload } from "react-icons/bi";

const navItems = [
  { name: "Home", href: "/#hero", hash: "" },
  { name: "About", href: "/#about", hash: "#about" },
  { name: "Services", href: "/#services", hash: "#services" },
  { name: "Contact", href: "/#contact", hash: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const closeMenu = () => setIsMenuOpen(false);
  const isNavItemActive = (hash: string) =>
    isHome && (hash ? activeHash === hash : activeHash === "");

  useEffect(() => {
    const updateActiveHash = () => {
      setActiveHash(window.location.hash);
    };

    updateActiveHash();
    window.addEventListener("hashchange", updateActiveHash);

    return () => {
      window.removeEventListener("hashchange", updateActiveHash);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[#e0e5ec]/95 shadow-[0_10px_30px_rgba(148,163,184,0.16)] backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="nm-dent hidden items-center gap-1 rounded-2xl p-1.5 lg:flex">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.hash);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] ${
                    isActive
                      ? "nm-pressed text-sky-700"
                      : "text-gray-600 hover:nm-protrude hover:text-sky-700"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-all duration-200 outline-none active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] ${
                isLogin
                  ? "nm-pressed text-sky-700"
                  : "nm-protrude text-gray-700 hover:nm-dent hover:text-sky-700"
              }`}
            >
              <LuLogIn className="text-lg" aria-hidden="true" />
              <span>Login</span>
            </Link>
            <button
              type="button"
              className="nm-protrude flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-gray-700 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
            >
              <span>Resume</span>
              <BiDownload className="text-xl" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            aria-controls="mobile-navigation"
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
        id="mobile-navigation"
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isMenuOpen
            ? "max-h-128 border-t border-white/60 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 pb-5 sm:px-6">
          <div className="nm-protrude rounded-2xl p-3">
            <ul className="grid gap-2 sm:grid-cols-2">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item.hash);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] ${
                        isActive
                          ? "nm-pressed text-sky-700"
                          : "nm-dent text-gray-700 hover:nm-protrude hover:text-sky-700"
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive ? (
                        <span
                          className="h-2 w-2 rounded-full bg-sky-500"
                          aria-hidden="true"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 grid gap-2 border-t border-slate-300/60 pt-3 md:hidden">
              <Link
                href="/login"
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] ${
                  isLogin
                    ? "nm-pressed text-sky-700"
                    : "nm-dent text-gray-700 hover:nm-protrude hover:text-sky-700"
                }`}
              >
                <span>Login</span>
                <LuLogIn className="text-lg" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="nm-dent flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-200 outline-none hover:nm-protrude hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
              >
                <span>Resume</span>
                <BiDownload className="text-xl" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

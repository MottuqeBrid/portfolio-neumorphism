"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo/Logo";
import { LuLogIn, LuMenu, LuX } from "react-icons/lu";
import { BiDownload } from "react-icons/bi";

type ResumeData = { url: string; filename: string } | null;

const navItems = [
  { name: "Home", href: "/#hero", hash: "" },
  { name: "About", href: "/#about", hash: "#about" },
  { name: "Skills", href: "/#skills", hash: "#skills" },
  { name: "Projects", href: "/#projects", hash: "#projects" },
  { name: "Contact", href: "/#contact", hash: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [resume, setResume] = useState<ResumeData>(null);

  const isHome = pathname === "/";
  const isLogin = pathname === "/login";
  const closeMenu = () => setIsMenuOpen(false);
  const isNavItemActive = (hash: string) =>
    isHome && (hash ? activeHash === hash : activeHash === "");

  useEffect(() => {
    let isActive = true;
    fetch("/api/admin/resume", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (isActive && data?.resume?.url) {
          setResume({ url: data.resume.url, filename: data.resume.filename });
        }
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, []);

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

  useEffect(() => {
    const menu = () => {
      closeMenu();
    };
    menu();
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={`mx-auto flex items-center justify-between gap-3 transition-all duration-300 sm:gap-4 ${
          isScrolled
            ? "nm-protrude mt-2 max-w-7xl rounded-2xl bg-[#e0e5ec]/80 px-3 py-2.5 backdrop-blur-md sm:mt-3 sm:px-4"
            : "mt-0 max-w-7xl rounded-none bg-transparent px-3 py-3 sm:px-4 sm:py-4 lg:px-8"
        }`}
      >
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
              href="/admin"
              className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition-all duration-200 outline-none active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] ${
                isLogin
                  ? "nm-pressed text-sky-700"
                  : "nm-protrude text-gray-700 hover:nm-dent hover:text-sky-700"
              }`}
            >
              <LuLogIn className="text-lg" aria-hidden="true" />
              <span>Admin</span>
            </Link>
            {resume ? (
              <a
                href={resume.url}
                target="_blank"
                download={resume.filename}
                rel="noopener noreferrer"
                className="nm-protrude flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-gray-700 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
              >
                <span>Resume</span>
                <BiDownload className="text-xl" aria-hidden="true" />
              </a>
            ) : null}
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
          isMenuOpen ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`mx-auto px-3 pb-5 pt-3 transition-all duration-300 sm:px-4 ${
            isScrolled ? "max-w-6xl" : "max-w-7xl"
          }`}
        >
          <div className="nm-protrude rounded-2xl bg-[#e0e5ec]/80 p-3 backdrop-blur-md">
            <ul className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-2">
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

            <div className="mt-3 flex flex-col gap-2 border-t border-slate-300/60 pt-3 sm:grid sm:grid-cols-2 md:hidden">
              <Link
                href="/admin"
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] ${
                  isLogin
                    ? "nm-pressed text-sky-700"
                    : "nm-dent text-gray-700 hover:nm-protrude hover:text-sky-700"
                }`}
              >
                <span>Admin</span>
                <LuLogIn className="text-lg" aria-hidden="true" />
              </Link>
              {resume ? (
                <a
                  href={resume.url}
                  target="_blank"
                  download={resume.filename}
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="nm-dent flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-200 outline-none hover:nm-protrude hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
                >
                  <span>Resume</span>
                  <BiDownload className="text-xl" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo/Logo";
import { LuLogIn } from "react-icons/lu";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="bg-[#e0e5ec] border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 hover:nm-dent ${
                    isActive
                      ? "nm-pressed text-blue-600"
                      : "nm-protrude text-gray-700 hover:scale-105"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* <button className="nm-protrude w-11 h-11 rounded-full flex items-center justify-center text-xl text-gray-700 active:nm-pressed">
            <FiSearch />
          </button> */}

          <Link href="/login" className="nm-protrude px-5 py-2 rounded-xl font-semibold text-gray-700 active:nm-pressed flex items-center gap-2 hover:nm-dent">
            <span>Login</span>
            <LuLogIn />
          </Link>
          <Link href="/register" className="nm-protrude px-5 py-2 rounded-xl font-semibold text-gray-700 active:nm-pressed hover:nm-dent">
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const themes = [
  { name: "light", icon: <FaSun size={18} />, label: "Light" },
  { name: "dark", icon: <FaMoon size={18} />, label: "Dark" },
];

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "toggle" | "button" | "dropdown";
}

export default function ThemeToggle({
  showLabel = false,
  size = "md",
  variant = "toggle",
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fun = () => {
      setMounted(true);
      // Get theme from localStorage or system preference
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        const systemTheme = prefersDark ? "dark" : "light";
        setTheme(systemTheme);
        document.documentElement.setAttribute("data-theme", systemTheme);
      }
    };

    fun();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const setSpecificTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`${
          size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10"
        } rounded-full bg-base-300 animate-pulse`}
      />
    );
  }

  const sizeClasses = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  // Toggle Switch Variant
  if (variant === "toggle") {
    return (
      <label className="flex items-center gap-2 cursor-pointer">
        <FaSun
          className={`${
            theme === "light" ? "text-warning" : "text-base-content/30"
          } transition-colors`}
          size={size === "sm" ? 14 : size === "lg" ? 22 : 18}
        />
        <input
          style={{
            paddingInline: "0",
          }}
          type="checkbox"
          className={`toggle ${
            size === "sm"
              ? "toggle-sm"
              : size === "lg"
                ? "toggle-lg"
                : "toggle-md"
          } ${theme === "dark" ? "toggle-primary" : ""}`}
          checked={theme === "dark"}
          onChange={toggleTheme}
          aria-label="Toggle theme"
        />
        <FaMoon
          className={`${
            theme === "dark" ? "text-primary" : "text-base-content/30"
          } transition-colors`}
          size={size === "sm" ? 14 : size === "lg" ? 22 : 18}
        />
        {showLabel && (
          <span className="text-sm font-medium ml-1">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
        )}
      </label>
    );
  }

  // Button Variant
  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={`btn btn-ghost btn-circle ${sizeClasses[size]} group relative overflow-hidden`}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Sun Icon */}
          <FaSun
            className={`absolute transition-all duration-300 text-warning ${
              theme === "light"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-50"
            }`}
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
          />
          {/* Moon Icon */}
          <FaMoon
            className={`absolute transition-all duration-300 text-primary ${
              theme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-50"
            }`}
            size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
          />
        </div>
      </button>
    );
  }

  // Dropdown Variant
  if (variant === "dropdown") {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className={`btn btn-ghost ${sizeClasses[size]} gap-2`}
        >
          {theme === "light" ? (
            <FaSun className="text-warning" size={18} />
          ) : (
            <FaMoon className="text-primary" size={18} />
          )}
          {showLabel && (
            <span className="hidden sm:inline">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          )}
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-1 menu p-2 shadow-lg bg-base-100 rounded-box w-40 mt-2 border border-base-200"
        >
          {themes.map((t) => (
            <li key={t.name}>
              <button
                onClick={() => setSpecificTheme(t.name)}
                className={`flex items-center gap-2 ${
                  theme === t.name ? "active" : ""
                }`}
              >
                <span
                  className={
                    t.name === "light" ? "text-warning" : "text-primary"
                  }
                >
                  {t.icon}
                </span>
                {t.label}
                {theme === t.name && (
                  <span className="ml-auto text-success">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

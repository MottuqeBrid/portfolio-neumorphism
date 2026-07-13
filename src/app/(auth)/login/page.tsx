"use client";

import type { SyntheticEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiLogIn,
  FiMail,
} from "react-icons/fi";

const fieldClass =
  "nm-dent w-full rounded-xl bg-transparent py-3 pl-11 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setError(data?.message || "Unable to sign in. Please try again.");
        return;
      }

      // Login succeeded: the session cookie is now set, so the admin route is
      // accessible. We intentionally do not redirect — the user stays here and
      // can continue to the dashboard when they choose to.
      setError("");
      setIsSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] w-full items-center justify-center px-4 py-10">
      <div className="nm-protrude w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="space-y-3 text-center">
          <div className="mx-auto inline-flex">
            <span
              className={`nm-dent inline-flex h-16 w-16 items-center justify-center rounded-2xl ${
                isSuccess ? "text-emerald-600" : "text-sky-700"
              }`}
            >
              {isSuccess ? (
                <FiCheckCircle size={26} aria-hidden="true" />
              ) : (
                <FiLogIn size={26} aria-hidden="true" />
              )}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
            {isSuccess ? "You're signed in" : "Welcome back"}
          </h1>
          <p className="text-sm text-slate-600">
            {isSuccess
              ? "Your session is active. You can now open the admin dashboard."
              : "Sign in to access your admin dashboard."}
          </p>
        </div>

        {isSuccess ? (
          <div className="mt-8 flex flex-col gap-4">
            <p
              role="status"
              className="nm-dent rounded-xl px-4 py-3 text-center text-sm font-semibold text-emerald-600"
            >
              Login successful.
            </p>
            <Link
              href="/admin"
              className="nm-protrude inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
            >
              <span>Go to dashboard</span>
              <FiArrowRight className="text-lg" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700">Email</span>
              <div className="relative">
                <FiMail
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                  aria-hidden="true"
                />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700">Password</span>
              <div className="relative">
                <FiLock
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                  aria-hidden="true"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="Your password"
                  className={`${fieldClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 outline-none transition-colors duration-200 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-400/60"
                >
                  {showPassword ? (
                    <FiEyeOff size={16} aria-hidden="true" />
                  ) : (
                    <FiEye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </label>

            {error ? (
              <p
                role="alert"
                className="nm-dent rounded-xl px-4 py-3 text-sm font-semibold text-rose-600"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="nm-protrude mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:nm-protrude"
            >
              <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
              {!isSubmitting ? (
                <FiLogIn className="text-lg" aria-hidden="true" />
              ) : null}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

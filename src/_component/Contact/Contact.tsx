"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { IconType } from "react-icons";
import { FiMapPin, FiSend } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";
import { GrGithub, GrLinkedin } from "react-icons/gr";

type Channel = {
  label: string;
  value: string;
  href: string;
  icon: IconType;
  tint: string;
};

const channels: Channel[] = [
  {
    label: "WhatsApp",
    value: "+880 1308 133343",
    href: "https://wa.me/8801308133343",
    icon: BsWhatsapp,
    tint: "#25d366",
  },
  {
    label: "LinkedIn",
    value: "in/md-mottuqe-brid",
    href: "https://linkedin.com/in/md-mottuqe-brid",
    icon: GrLinkedin,
    tint: "#0a66c2",
  },
  {
    label: "GitHub",
    value: "MottuqeBrid",
    href: "https://github.com/MottuqeBrid",
    icon: GrGithub,
    tint: "#181717",
  },
];

const fieldClass =
  "nm-dent w-full rounded-xl bg-transparent px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]";

export default function Contact({ id }: { id: string }) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sent");
    event.currentTarget.reset();
  };

  return (
    <section
      id={id}
      className="mt-16 px-4 sm:px-6 lg:px-0"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-3xl space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="nm-dent inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-sky-700">
            Contact
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
        <h2
          id="contact-heading"
          className="text-3xl font-black leading-[1.15] tracking-tight text-slate-800 sm:text-4xl lg:text-5xl"
        >
          Available for web development work and collaboration.
        </h2>
        <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          Reach out on WhatsApp for a direct discussion, LinkedIn for a
          professional introduction, or GitHub to review my work. You can also
          drop a message below and I&apos;ll get back to you.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
        <div className="flex flex-col gap-4">
          <div className="nm-protrude flex items-center gap-4 rounded-3xl p-5 sm:p-6">
            <span className="nm-dent inline-flex shrink-0 rounded-2xl p-3 text-sky-700">
              <FiMapPin size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Based in
              </p>
              <p className="text-base font-bold text-slate-800">
                Khulna, Bangladesh
              </p>
            </div>
          </div>

          <ul className="grid gap-4" aria-label="Contact channels">
            {channels.map(({ label, value, href, icon: Icon, tint }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nm-protrude group flex items-center gap-4 rounded-3xl p-5 outline-none transition-all duration-200 hover:-translate-y-0.5 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] sm:p-6"
                >
                  <span
                    className="nm-dent inline-flex shrink-0 rounded-2xl p-3"
                    style={{ color: tint }}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                    <p className="truncate text-base font-bold text-slate-800 transition-colors duration-200 group-hover:text-sky-700">
                      {value}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="nm-protrude flex flex-col gap-4 rounded-3xl p-6 sm:p-7"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700">Name</span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-bold text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClass}
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Subject</span>
            <input
              type="text"
              name="subject"
              required
              placeholder="What is this about?"
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell me a little about your project or idea..."
              className={`${fieldClass} resize-none`}
            />
          </label>

          <div className="mt-1 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="nm-protrude inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
            >
              <span>Send message</span>
              <FiSend className="text-lg" aria-hidden="true" />
            </button>

            <p
              role="status"
              aria-live="polite"
              className={`text-sm font-bold text-emerald-600 transition-opacity duration-200 ${
                status === "sent" ? "opacity-100" : "opacity-0"
              }`}
            >
              Thanks! I&apos;ll get back to you soon.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

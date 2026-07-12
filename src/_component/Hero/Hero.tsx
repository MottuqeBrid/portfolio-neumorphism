"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { BsWhatsapp } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { GrGithub, GrLinkedin } from "react-icons/gr";
import ME from "@/image/me.jpg";

import type { IconType } from "react-icons";
import {
  SiExpress,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";

type TechItem = {
  name: string;
  icon: IconType;
  tint: string;
};

const roleTitles = [
  "Next.js Developer",
  "Frontend Engineer",
  "MERN Stack Developer",
];

const techStack: TechItem[] = [
  { name: "React", icon: SiReact, tint: "#61dafb" },
  { name: "Next.js", icon: SiNextdotjs, tint: "#111111" },
  { name: "Node.js", icon: SiNodedotjs, tint: "#539e43" },
  { name: "Express", icon: SiExpress, tint: "#444444" },
  { name: "MongoDB", icon: SiMongodb, tint: "#00ed64" },
  { name: "Tailwind CSS", icon: SiTailwindcss, tint: "#06b6d4" },
];
const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/MottuqeBrid",
    icon: GrGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mottuqebrid/",
    icon: GrLinkedin,
  },
  {
    label: "WhatsApp",
    href: "https://www.whatsapp.com/send?phone=8801308133343",
    icon: BsWhatsapp,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/mottuqe.brid/",
    icon: FaFacebook,
  },
];

export default function Hero({ id }: { id?: string }) {
  return (
    <section
      id={id}
      className="grid grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-0 w-full"
    >
      <div className="flex flex-col justify-center gap-6 order-2 lg:order-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="nm-dent inline-flex rounded-full px-4 py-2 text-sm font-bold text-sky-700">
            Welcome to Code House
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>

        <div className="space-y-5">
          <h1 className="max-w-3xl text-3xl font-black leading-[1.15] text-slate-800 sm:text-4xl sm:leading-[1.1] lg:text-5xl xl:text-6xl xl:leading-[1.08]">
            Hi, I am <span className="text-sky-700">Md. Mottuqe Brid</span>, a
            web developer building polished digital products.
          </h1>

          <div className="nm-dent w-full max-w-full overflow-hidden rounded-2xl px-2 py-3 sm:max-w-2xl">
            <Marquee speed={36} pauseOnHover gradient={false} autoFill>
              {roleTitles.map((title) => (
                <span
                  key={title}
                  className="mx-4 inline-flex items-center gap-3 text-sm font-black uppercase text-sky-700 sm:text-base"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-500" />
                  {title}
                </span>
              ))}
            </Marquee>
          </div>

          <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            I build fast, scalable web applications with clean UI, responsive
            layouts, and maintainable frontend architecture. My main stack is
            React, Next.js, Node.js, Express, and MongoDB.
          </p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Primary tech stack">
          {techStack.map(({ name, icon: Icon, tint }) => (
            <li
              key={name}
              className="nm-protrude flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-slate-700"
            >
              <Icon size={14} style={{ color: tint }} />
              {name}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="nm-protrude inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black text-sky-700 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
          >
            <span>Download Resume</span>
            <FiDownload className="text-lg" aria-hidden="true" />
          </button>

          <div className="flex flex-wrap gap-3" aria-label="Social links">
            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="nm-protrude inline-flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-slate-700 transition-all duration-200 outline-none hover:nm-dent hover:text-sky-700 active:nm-pressed focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec]"
                >
                  <Icon aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="order-1 flex items-center justify-center lg:order-2 lg:justify-end">
        <div className="nm-protrude relative aspect-square w-full max-w-[16rem] overflow-hidden rounded-4xl p-3 xs:max-w-[18rem] sm:max-w-88 sm:p-4 lg:max-w-104 xl:max-w-120">
          <div className="nm-dent h-full overflow-hidden rounded-3xl bg-slate-200">
            <Image
              className="h-full w-full object-cover"
              src={ME}
              alt="Md. Mottuqe Brid"
              width={500}
              height={500}
              priority
              sizes="(min-width: 1024px) 30rem, (min-width: 640px) 22rem, 16rem"
            />
          </div>
          <div className="absolute bottom-3 left-3 rounded-2xl bg-[#e0e5ec]/90 px-3 py-2 shadow-[8px_8px_18px_rgba(148,163,184,0.35),-8px_-8px_18px_rgba(255,255,255,0.65)] backdrop-blur sm:bottom-5 sm:left-5 sm:px-4 sm:py-3">
            <p className="text-xs font-bold uppercase text-slate-500">
              Available for
            </p>
            <p className="text-sm font-black text-sky-700">Web Development</p>
          </div>
        </div>
      </div>
    </section>
  );
}

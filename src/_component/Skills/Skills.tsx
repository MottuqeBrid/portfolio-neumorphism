import type { IconType } from "react-icons";
import { BsTools } from "react-icons/bs";
import { DiPython } from "react-icons/di";
import { FiCode, FiLayers, FiTool } from "react-icons/fi";
import {
  SiExpress,
  SiFirebase,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNumpy,
  SiNodedotjs,
  SiPandas,
  SiPostman,
  SiReact,
  SiR,
  SiScikitlearn,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { PiChartScatterBold } from "react-icons/pi";
import { TbChartHistogram } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";

type SkillItem = {
  name: string;
  icon: IconType;
  tint: string;
};

type SkillGroup = {
  index: string;
  title: string;
  description: string;
  Icon: IconType;
  accent: string;
  skills: SkillItem[];
};

const skillGroups: SkillGroup[] = [
  {
    index: "01",
    title: "Frontend development",
    description:
      "Crafting responsive interfaces with modern frameworks, strong component structure, and maintainable styling.",
    Icon: FiLayers,
    accent: "#06b6d4",
    skills: [
      { name: "React", icon: SiReact, tint: "#61dafb" },
      { name: "Next.js", icon: SiNextdotjs, tint: "#111111" },
      { name: "TypeScript", icon: SiTypescript, tint: "#3178c6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, tint: "#06b6d4" },
      { name: "JavaScript", icon: SiJavascript, tint: "#f7df1e" },
    ],
  },
  {
    index: "02",
    title: "Backend, APIs & Database",
    description:
      "Building practical server-side features, integrating APIs, and delivering reliable application flows end to end.",
    Icon: FiCode,
    accent: "#22c55e",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, tint: "#539e43" },
      { name: "Express.js", icon: SiExpress, tint: "#444444" },
      { name: "Firebase", icon: SiFirebase, tint: "#ffca28" },
      { name: "Postman", icon: SiPostman, tint: "#ff6c37" },
      { name: "MongoDB", icon: SiMongodb, tint: "#00ed64" },
    ],
  },
  {
    index: "03",
    title: "Workflow and tooling",
    description:
      "Using collaborative and design-oriented tools to ship features cleanly and iterate with less friction.",
    Icon: FiTool,
    accent: "#f05032",
    skills: [
      { name: "Git", icon: SiGit, tint: "#f05032" },
      { name: "GitHub", icon: SiGithub, tint: "#181717" },
      { name: "VS Code", icon: VscVscode, tint: "#007acc" },
    ],
  },
  {
    index: "04",
    title: "Other languages & tools",
    description:
      "Experience with other programming languages and tools that complement my main stack and help deliver better products.",
    Icon: BsTools,
    accent: "#f7931e",
    skills: [
      { name: "Python", icon: DiPython, tint: "#3776ab" },
      { name: "R", icon: SiR, tint: "#276dc3" },
      { name: "STATA", icon: TbChartHistogram, tint: "#1a5a96" },
      { name: "SPSS", icon: PiChartScatterBold, tint: "#1261a0" },
      { name: "Pandas", icon: SiPandas, tint: "#150458" },
      { name: "NumPy", icon: SiNumpy, tint: "#4dabcf" },
      { name: "Scikit-Learn", icon: SiScikitlearn, tint: "#f7931e" },
    ],
  },
];

const focusAreas = [
  "Component-driven UI",
  "Responsive layouts",
  "REST API integration",
  "Performance-aware builds",
];

export default function Skills({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="mt-16 px-4 sm:px-6 lg:px-0"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-3xl space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="nm-dent inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-sky-700">
            Skills
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
        <h2
          id="skills-heading"
          className="text-3xl font-black leading-[1.15] tracking-tight text-slate-800 sm:text-4xl lg:text-5xl"
        >
          A practical stack for building modern web products.
        </h2>
        <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          My toolkit is centered on JavaScript and TypeScript ecosystems, with a
          strong focus on React-based frontend work, API-driven backend
          delivery, and tools that keep projects maintainable.
        </p>
        <ul
          className="flex flex-wrap gap-2.5 pt-1"
          aria-label="Focus areas"
        >
          {focusAreas.map((item) => (
            <li
              key={item}
              className="nm-protrude rounded-full px-4 py-2 text-sm font-bold text-slate-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {skillGroups.map(
          ({ index, title, description, Icon, accent, skills }) => (
            <article
              key={title}
              className="nm-protrude group flex flex-col gap-5 rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <div
                  className="nm-dent inline-flex shrink-0 rounded-2xl p-3"
                  style={{ color: accent }}
                >
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-black tabular-nums"
                      style={{ color: accent }}
                    >
                      {index}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 sm:text-xl">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              </div>

              <ul className="mt-auto flex flex-wrap content-start gap-2.5">
                {skills.map(({ name, icon: SkillIcon, tint }) => (
                  <li
                    key={name}
                    className="nm-protrude-sm flex items-center gap-2 rounded-full border border-transparent py-1.5 pl-1.5 pr-3.5 transition-all duration-200 hover:-translate-y-0.5 active:nm-pressed"
                    style={{ ["--tint" as string]: tint }}
                  >
                    <span
                      className="nm-dent-sm inline-flex rounded-full p-1.5"
                      style={{ color: tint }}
                    >
                      <SkillIcon size={16} />
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

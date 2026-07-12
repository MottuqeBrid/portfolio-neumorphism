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
    <section id={id} className="mt-12" aria-labelledby="skills-heading">
      <div className="max-w-3xl space-y-4">
        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Skills
        </span>
        <h2
          id="skills-heading"
          className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl lg:text-5xl"
        >
          A practical stack for building modern web products.
        </h2>
        <p className="max-w-2xl text-base leading-8 text-base-content/75 sm:text-lg">
          My toolkit is centered on JavaScript and TypeScript ecosystems, with a
          strong focus on React-based frontend work, API-driven backend
          delivery, and tools that keep projects maintainable.
        </p>
        <div className="flex flex-wrap gap-3 pt-1 text-sm text-base-content/75">
          {focusAreas.map((item) => (
            <span
              key={item}
              className="rounded-full border border-base-300 bg-base-200/80 px-4 py-2"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 divide-y divide-base-300 border-y border-base-300">
        {skillGroups.map(
          ({ index, title, description, Icon, accent, skills }) => (
            <article
              key={title}
              className="group grid gap-6 py-8 sm:grid-cols-[auto_1fr] sm:gap-8 lg:grid-cols-[3rem_16rem_1fr]"
            >
              <span
                className="hidden text-sm font-black tabular-nums lg:block"
                style={{ color: accent }}
              >
                {index}
              </span>

              <div className="flex items-start gap-4 lg:flex-col lg:items-start lg:gap-3">
                <div
                  className="inline-flex shrink-0 rounded-2xl p-3"
                  style={{ backgroundColor: `${accent}1a`, color: accent }}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-base-content sm:text-xl">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-base-content/70">
                    {description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap content-start gap-2.5">
                {skills.map(({ name, icon: SkillIcon, tint }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 py-2 pl-2 pr-4 transition-colors duration-200 hover:border-transparent"
                    style={{ ["--tint" as string]: tint }}
                  >
                    <span
                      className="inline-flex rounded-full p-1.5"
                      style={{ backgroundColor: `${tint}20`, color: tint }}
                    >
                      <SkillIcon size={16} />
                    </span>
                    <span className="text-sm font-medium text-base-content">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

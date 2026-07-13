import type { IconType } from "react-icons";
import { FiCheckCircle, FiCode, FiLayers, FiTrendingUp } from "react-icons/fi";
export default function About({ id }: { id?: string }) {
  type FocusArea = {
    title: string;
    desc: string;
    Icon: IconType;
    accent: string;
  };

  const keyFeatures = [
    "Responsive by default",
    "Clean architecture",
    "Performance-minded",
    "Maintainable code",
    "Fast and scalable",
    "Polished UI",
  ];

  const focusAreas: FocusArea[] = [
    {
      title: "Frontend systems",
      desc: "Building polished interfaces with React, Next.js, Tailwind CSS, and a strong focus on accessibility.",
      Icon: FiLayers,
      accent: "#06b6d4",
    },
    {
      title: "Full-stack delivery",
      desc: "Connecting clean UI with practical backend services, APIs, and data flows that scale with the product.",
      Icon: FiCode,
      accent: "#22c55e",
    },
    {
      title: "Continuous growth",
      desc: "Learning fast, refining process, and staying current with tools that genuinely improve product quality.",
      Icon: FiTrendingUp,
      accent: "#f7931e",
    },
  ];

  return (
    <div id={id} className="my-4 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">About Me</h3>
        <p className="text-sm text-slate-500">Khulna, Bangladesh</p>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
        Building useful products with clean code and deliberate design.
      </h1>

      <p className="text-slate-600">
        I&apos;m Md. Mottuqe Brid, a web developer who enjoys turning ideas into
        fast, responsive, and maintainable digital experiences. My work sits at
        the intersection of thoughtful UI, scalable frontend architecture, and
        practical product thinking.
      </p>

      <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Key features">
        {keyFeatures.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <FiCheckCircle className="text-cyan-500" size={14} />
            {feature}
          </li>
        ))}
      </ul>

      <div className="grid gap-4 sm:grid-cols-3">
        {focusAreas.map((area) => (
          <div
            key={area.title}
            className="nm-protrude rounded-2xl p-4 hover:nm-shadow-gray-500"
          >
            <h4 className="mb-1 font-bold text-slate-800">{area.title}</h4>
            <p className="text-sm text-slate-600">{area.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800">My story</h3>
        <p className="text-slate-600">
          My journey into programming started with curiosity and quickly became
          a serious craft. Since then, I&apos;ve focused on building modern web
          applications that feel intuitive for users and remain manageable for
          teams.
        </p>
        <p className="text-slate-600">
          I care about more than shipping screens. I pay attention to structure,
          performance, and the small interface details that shape how a product
          feels in day-to-day use.
        </p>
        <p className="text-slate-600">
          Outside of delivery work, I spend time exploring new tools, sharpening
          fundamentals, and sharing what I learn with the wider developer
          community.
        </p>
      </div>
    </div>
  );
}

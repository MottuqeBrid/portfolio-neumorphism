import { ProjectInstance } from "@/models/Projects.Models";
import Image from "next/image";
import {
  FiCheckCircle,
  FiExternalLink,
  FiFolder,
  FiGithub,
  FiInfo,
} from "react-icons/fi";
import { LinkChip } from "./LinkChip";

export function ProjectCard({
  project,
  onView,
}: {
  project: ProjectInstance;
  onView: (project: ProjectInstance) => void;
}) {
  return (
    <article className="nm-protrude group flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1">
      <div className="nm-dent relative m-3 aspect-video overflow-hidden rounded-2xl bg-slate-200">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sky-700/40">
            <FiFolder size={40} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 pt-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-800">{project.title}</h3>
          {project.isCompleted ? (
            <span className="nm-dent inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-emerald-600">
              <FiCheckCircle size={12} aria-hidden="true" />
              Done
            </span>
          ) : null}
        </div>

        {project.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
            {project.description}
          </p>
        ) : null}

        {project.techStack?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="nm-dent-sm rounded-full px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onView(project)}
            className="nm-protrude-sm inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-sky-700 transition-all duration-200 hover:-translate-y-0.5 active:nm-pressed"
          >
            <FiInfo size={13} aria-hidden="true" />
            View
          </button>
          <LinkChip
            href={project.links?.live}
            label="Live"
            icon={FiExternalLink}
          />
          <LinkChip
            href={project.links?.source}
            label="Source"
            icon={FiGithub}
          />
          <LinkChip
            href={project.links?.githubClient}
            label="Client"
            icon={FiGithub}
          />
          <LinkChip
            href={project.links?.githubServer}
            label="Server"
            icon={FiGithub}
          />
        </div>
      </div>
    </article>
  );
}

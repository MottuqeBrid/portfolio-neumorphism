"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiExternalLink,
  FiGithub,
  FiFolder,
} from "react-icons/fi";
import type { ProjectInstance } from "@/models/Projects.Models";

function LinkChip({
  href,
  label,
  icon: Icon,
}: {
  href?: string;
  label: string;
  icon: typeof FiGithub;
}) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="nm-protrude-sm inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:text-sky-700 active:nm-pressed"
    >
      <Icon size={13} aria-hidden="true" />
      {label}
    </a>
  );
}

function ProjectCard({ project }: { project: ProjectInstance }) {
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

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
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

function ProjectCardSkeleton() {
  return (
    <div className="nm-protrude flex flex-col overflow-hidden rounded-3xl">
      <div className="nm-dent m-3 aspect-video animate-pulse rounded-2xl bg-slate-300/50" />
      <div className="flex flex-col gap-3 p-5 pt-2">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-300/50" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-300/40" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-300/40" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-300/40" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-300/40" />
        </div>
      </div>
    </div>
  );
}

export default function Projects({ id }: { id: string }) {
  const [projects, setProjects] = useState<ProjectInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadProjects = async () => {
      try {
        const res = await fetch("/api/projects?showInUI=true", {
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);

        if (!isActive) {
          return;
        }

        if (!res.ok || !Array.isArray(data)) {
          setError("Unable to load projects right now.");
          return;
        }

        setProjects(data as ProjectInstance[]);
      } catch {
        if (isActive) {
          setError("Network error while loading projects.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section
      id={id}
      className="mt-16 px-4 sm:px-6 lg:px-0"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-3xl space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="nm-dent inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-sky-700">
            Projects
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>
        <h2
          id="projects-heading"
          className="text-3xl font-black leading-[1.15] tracking-tight text-slate-800 sm:text-4xl lg:text-5xl"
        >
          Selected work I&apos;ve designed and built.
        </h2>
        <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          A collection of projects showcasing clean UI, responsive layouts, and
          practical full-stack delivery.
        </p>
      </div>

      <div className="mt-12">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-rose-600">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-slate-500">
            No projects to show yet. Check back soon.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

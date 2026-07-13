"use client";

import { useEffect, useState } from "react";
import type { ProjectInstance } from "@/models/Projects.Models";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { ProjectCardSkeleton } from "./ProjectCardSkeleton";

export default function Projects({ id }: { id: string }) {
  const [projects, setProjects] = useState<ProjectInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] =
    useState<ProjectInstance | null>(null);

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

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

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
              <ProjectCard
                key={project._id}
                project={project}
                onView={setSelectedProject}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProject ? (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      ) : null}
    </section>
  );
}

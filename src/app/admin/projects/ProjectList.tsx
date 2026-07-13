"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FiCheckCircle,
  FiExternalLink,
  FiEyeOff,
  FiGithub,
  FiTrash2,
} from "react-icons/fi";
import type { ProjectInstance } from "./types";

type ProjectListProps = {
  projects: ProjectInstance[];
  isLoading: boolean;
  error: string;
  onDeleted: (id: string) => void;
};

function LinkChip({
  href,
  label,
  icon: Icon,
}: {
  href: string;
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

export default function ProjectList({
  projects,
  isLoading,
  error,
  onDeleted,
}: ProjectListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (id: string) => {
    setDeleteError("");
    setDeletingId(id);

    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setDeleteError(data?.message || "Unable to delete project.");
        return;
      }

      onDeleted(id);
    } catch {
      setDeleteError("Network error while deleting. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-slate-500">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return (
      <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-rose-600">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="nm-dent rounded-3xl p-8 text-center text-sm font-semibold text-slate-500">
        No projects yet. Add your first one using the form.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-slate-800">
          Projects
        </h2>
        <span className="nm-dent rounded-full px-3 py-1 text-xs font-black text-sky-700">
          {projects.length}
        </span>
      </div>

      {deleteError ? (
        <p
          role="alert"
          className="nm-dent rounded-xl px-4 py-3 text-sm font-semibold text-rose-600"
        >
          {deleteError}
        </p>
      ) : null}

      <ul className="flex flex-col gap-4">
        {projects.map((project) => (
          <li
            key={project._id}
            className="nm-protrude flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:p-6"
          >
            <div className="nm-dent relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-slate-200 sm:w-40">
              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="(min-width: 640px) 10rem, 100vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400">
                  No image
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-slate-800">
                    {project.title}
                  </h3>
                  {project.description ? (
                    <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">
                      {project.description}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(project._id)}
                  disabled={deletingId === project._id}
                  aria-label={`Delete ${project.title}`}
                  className="nm-protrude inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-rose-500 transition-all duration-200 outline-none hover:nm-dent active:nm-pressed focus-visible:ring-2 focus-visible:ring-rose-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#e0e5ec] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiTrash2 size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`nm-dent inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    project.isCompleted ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  <FiCheckCircle size={12} aria-hidden="true" />
                  {project.isCompleted ? "Completed" : "In progress"}
                </span>
                {!project.showInUI ? (
                  <span className="nm-dent inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-slate-500">
                    <FiEyeOff size={12} aria-hidden="true" />
                    Hidden
                  </span>
                ) : null}
              </div>

              {project.techStack?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="nm-dent-sm rounded-full px-2.5 py-1 text-xs font-medium text-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-auto flex flex-wrap gap-2">
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
          </li>
        ))}
      </ul>
    </div>
  );
}

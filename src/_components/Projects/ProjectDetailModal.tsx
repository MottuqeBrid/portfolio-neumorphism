import { FiCheckCircle, FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import { LinkChip } from "./LinkChip";
import Image from "next/image";
import { ProjectInstance } from "@/models/Projects.Models";
import { useState } from "react";

export function ProjectDetailModal({
  project,
  onClose,
}: {
  project: ProjectInstance;
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const allImages = [project.thumbnail, ...(project.images ?? [])].filter(
    Boolean,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-white/70 backdrop-blur-md sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="nm-protrude flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl sm:max-w-2xl sm:rounded-3xl">
        <div className="relative flex items-center justify-between border-b border-slate-200/60 px-5 py-4 sm:px-6">
          <h2
            id="detail-modal-title"
            className="truncate pr-4 text-base font-black tracking-tight text-slate-900 sm:text-lg"
          >
            {project.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="nm-protrude inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:text-slate-800 active:nm-pressed"
          >
            <FiX size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-6">
            {allImages.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="nm-dent relative aspect-video overflow-hidden rounded-2xl bg-slate-200">
                  <Image
                    src={allImages[activeImage]}
                    alt={`${project.title} — image ${activeImage + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 36rem"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {allImages.length > 1 ? (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`nm-dent relative h-14 w-20 shrink-0 overflow-hidden rounded-xl transition-all duration-200 sm:h-16 sm:w-24 ${
                          i === activeImage
                            ? "ring-2 ring-sky-500/60"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${i + 1}`}
                          fill
                          sizes="6rem"
                          className="object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`nm-dent inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                  project.isCompleted ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                <FiCheckCircle size={12} aria-hidden="true" />
                {project.isCompleted ? "Completed" : "In progress"}
              </span>
              {project.techStack?.map((tech: string) => (
                <span
                  key={tech}
                  className="nm-dent-sm rounded-full px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.description ? (
              <div>
                <h3 className="mb-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
                  Summary
                </h3>
                <p className="text-sm leading-7 text-slate-700">
                  {project.description}
                </p>
              </div>
            ) : null}

            {project.longDescription ? (
              <div>
                <h3 className="mb-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
                  About this project
                </h3>
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                  {project.longDescription}
                </p>
              </div>
            ) : null}

            {project.keyFeatures?.length ? (
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Key features
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {project.keyFeatures.map((feature: string) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {(project.links?.live ||
              project.links?.source ||
              project.links?.githubClient ||
              project.links?.githubServer) && (
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Links
                </h3>
                <div className="flex flex-wrap gap-2">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

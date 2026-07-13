"use client";

import { useState } from "react";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import type { ProjectInstance } from "./types";

type ProjectsManagerProps = {
  initialProjects: ProjectInstance[];
};

export default function ProjectsManager({
  initialProjects,
}: ProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectInstance[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<ProjectInstance | null>(
    null,
  );

  const handleCreated = (project: ProjectInstance) => {
    setProjects((prev) => [project, ...prev]);
  };

  const handleUpdated = (project: ProjectInstance) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === project._id ? project : p)),
    );
    setEditingProject(null);
  };

  const handleDeleted = (id: string) => {
    setProjects((prev) => prev.filter((project) => project._id !== id));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
      <ProjectForm
        onCreated={handleCreated}
        editingProject={editingProject}
        onUpdated={handleUpdated}
        onCancelEdit={() => setEditingProject(null)}
      />
      <ProjectList
        projects={projects}
        isLoading={false}
        error=""
        onDeleted={handleDeleted}
        onEdit={setEditingProject}
        editingId={editingProject?._id ?? null}
      />
    </div>
  );
}

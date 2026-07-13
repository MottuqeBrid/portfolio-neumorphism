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

  const handleCreated = (project: ProjectInstance) => {
    setProjects((prev) => [project, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setProjects((prev) => prev.filter((project) => project._id !== id));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
      <ProjectForm onCreated={handleCreated} />
      <ProjectList
        projects={projects}
        isLoading={false}
        error=""
        onDeleted={handleDeleted}
      />
    </div>
  );
}

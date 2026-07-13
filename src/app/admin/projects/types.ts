import type { ProjectInstance, ProjectLinks } from "@/models/Projects.Models";

export type { ProjectInstance, ProjectLinks };

export type ProjectFormValues = {
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  techStack: string;
  keyFeatures: string;
  images: string[];
  live: string;
  source: string;
  githubClient: string;
  githubServer: string;
  isCompleted: boolean;
  showInUI: boolean;
};

export const emptyProjectForm: ProjectFormValues = {
  title: "",
  description: "",
  longDescription: "",
  thumbnail: "",
  techStack: "",
  keyFeatures: "",
  images: [],
  live: "",
  source: "",
  githubClient: "",
  githubServer: "",
  isCompleted: false,
  showInUI: true,
};

// Split a comma / newline separated string into a clean string array.
export function splitList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

// Build the JSON payload expected by POST /api/projects from form values.
export function toProjectPayload(values: ProjectFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    longDescription: values.longDescription.trim(),
    thumbnail: values.thumbnail.trim(),
    techStack: splitList(values.techStack),
    keyFeatures: splitList(values.keyFeatures),
    images: values.images,
    links: {
      live: values.live.trim(),
      source: values.source.trim(),
      githubClient: values.githubClient.trim(),
      githubServer: values.githubServer.trim(),
    },
    isCompleted: values.isCompleted,
    showInUI: values.showInUI,
  };
}

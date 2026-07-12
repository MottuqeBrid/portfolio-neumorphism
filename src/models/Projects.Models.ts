import mongoose from "mongoose";

const projectsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    techStack: {
      type: [String],
    },
    keyFeatures: {
      type: [String],
    },
    images: {
      type: [String],
    },
    links: {
      live: {
        type: String,
      },
      source: { type: String },
      githubClient: { type: String },
      githubServer: { type: String },
    },
    isCompleted: {
      type: Boolean,
    },
    showInUI: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export const Projects =
  mongoose.models.Projects || mongoose.model("Projects", projectsSchema);

export type ProjectLinks = {
  live: string;
  source: string;
  githubClient: string;
  githubServer: string;
};

export type ProjectInstance = {
  id: string | undefined;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  techStack: string[];
  keyFeatures: string[];
  createdAt: string;
  updatedAt: string;
  images: string[];
  links: ProjectLinks;
  isCompleted: boolean;
  showInUI?: boolean;
  _id: string;
};

// export type ProjectFormValues = {
//   title: string;
//   description: string;
//   longDescription: string;
//   thumbnail: string;
//   techStack: string;
//   keyFeatures: string;
//   images: string;
//   live: string;
//   source: string;
//   githubClient: string;
//   githubServer: string;
//   isCompleted: boolean;
//   showInUI: boolean;
// };

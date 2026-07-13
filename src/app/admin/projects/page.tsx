import { connectDB } from "@/lib/connectDB";
import { Projects } from "@/models/Projects.Models";
import ProjectsManager from "./ProjectsManager";
import type { ProjectInstance } from "./types";

// Always render fresh data so newly added projects appear on reload.
export const dynamic = "force-dynamic";

async function getProjects(): Promise<ProjectInstance[]> {
  try {
    await connectDB();
    const projects = await Projects.find({}).sort({ createdAt: -1 }).lean();
    // Serialize Mongo documents (ObjectId, Date) into plain JSON for the client.
    return JSON.parse(JSON.stringify(projects)) as ProjectInstance[];
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="w-full space-y-8">
      <div className="w-full space-y-3">
        <span className="nm-dent inline-flex rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-sky-700">
          Projects
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
          Manage your projects
        </h1>
        <p className="text-base leading-7 text-slate-600">
          Add new projects and review everything currently stored. Changes are
          saved to the database instantly.
        </p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  );
}

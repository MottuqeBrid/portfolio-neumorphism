import { connectDB } from "@/lib/connectDB";
import { Projects } from "@/models/Projects.Models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload?.title?.trim()) {
      return NextResponse.json(
        { message: "Project title is required" },
        { status: 400 },
      );
    }

    await connectDB();
    const project = await Projects.create({
      ...payload,
      title: payload.title.trim(),
      description: payload.description?.trim() ?? "",
      longDescription: payload.longDescription?.trim() ?? "",
      thumbnail: payload.thumbnail?.trim() ?? "",
      techStack: payload.techStack ?? [],
      keyFeatures: payload.keyFeatures ?? [],
      images: payload.images ?? [],
      links: {
        live: payload.links?.live?.trim() ?? "",
        source: payload.links?.source?.trim() ?? "",
        githubClient: payload.links?.githubClient?.trim() ?? "",
        githubServer: payload.links?.githubServer?.trim() ?? "",
      },
      isCompleted: Boolean(payload.isCompleted),
      showInUI: Boolean(payload.showInUI),
    });

    return NextResponse.json(
      {
        message: "Project created successfully",
        project,
      },
      { status: 201 },
    );
  } catch (error) {
    // console.error("Failed to create project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showInUI = searchParams.get("showInUI");
    const query: { showInUI?: boolean } = {};

    if (showInUI !== null) {
      query.showInUI = showInUI === "true" ? true : false;
    }

    await connectDB();
    const projects = await Projects.find(query).sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    // console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const payload = await req.json();
    const id = payload?.id || searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 },
      );
    }
    await connectDB();
    const deletedProject = await Projects.findByIdAndDelete(id);
    if (!deletedProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Project deleted successfully", project: deletedProject },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Failed to delete project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await req.json();
    const id = payload?.id;
    if (!id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 },
      );
    }
    await connectDB();
    const updatedProject = await Projects.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updatedProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Failed to update project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

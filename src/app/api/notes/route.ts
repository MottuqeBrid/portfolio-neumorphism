import { connectDB } from "@/lib/connectDB";
import { Note } from "@/models/note.Model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    // console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload?.title?.trim()) {
      return NextResponse.json(
        { message: "Note title is required" },
        { status: 400 },
      );
    }

    if (!payload?.details?.trim()) {
      return NextResponse.json(
        { message: "Note details are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const note = await Note.create({
      title: payload.title.trim(),
      details: payload.details.trim(),
      category: payload.category ?? "text",
      images: Array.isArray(payload.images)
        ? payload.images.map((item: string) => item.trim()).filter(Boolean)
        : [],
      file: {
        url: payload.file?.url?.trim() ?? "",
        filename: payload.file?.filename?.trim() ?? "",
      },
    });

    return NextResponse.json(
      { message: "Note created successfully", note },
      { status: 201 },
    );
  } catch (error) {
    // console.error("Failed to create note:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = await req.json();
    const id = payload?.id;

    if (!id) {
      return NextResponse.json(
        { message: "Note ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Note deleted successfully", note: deletedNote },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Failed to delete note:", error);
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
        { message: "Note ID is required" },
        { status: 400 },
      );
    }

    if (!payload?.title?.trim()) {
      return NextResponse.json(
        { message: "Note title is required" },
        { status: 400 },
      );
    }

    if (!payload?.details?.trim()) {
      return NextResponse.json(
        { message: "Note details are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        title: payload.title.trim(),
        details: payload.details.trim(),
        category: payload.category ?? "text",
        images: Array.isArray(payload.images)
          ? payload.images.map((item: string) => item.trim()).filter(Boolean)
          : [],
        file: {
          url: payload.file?.url?.trim() ?? "",
          filename: payload.file?.filename?.trim() ?? "",
        },
      },
      { new: true },
    );

    if (!updatedNote) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Note updated successfully", note: updatedNote },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Failed to update note:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

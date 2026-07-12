import { connectDB } from "@/lib/connectDB";
import { Email } from "@/models/Email.Model";
import { Note } from "@/models/note.Model";
import { Projects } from "@/models/Projects.Models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const [
      totalProjects,
      completedProjects,
      visibleProjects,
      totalNotes,
      notesWithImages,
      notesWithFiles,
      totalEmails,
      unreadEmails,
      recentProjects,
      recentNotes,
      recentEmails,
    ] = await Promise.all([
      Projects.countDocuments({}),
      Projects.countDocuments({ isCompleted: true }),
      Projects.countDocuments({ showInUI: true }),
      Note.countDocuments({}),
      Note.countDocuments({ "images.0": { $exists: true } }),
      Note.countDocuments({ "file.url": { $exists: true, $ne: "" } }),
      Email.countDocuments({}),
      Email.countDocuments({ isRead: false }),
      Projects.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title isCompleted showInUI createdAt")
        .lean(),
      Note.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title category createdAt")
        .lean(),
      Email.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email subject isRead createdAt")
        .lean(),
    ]);

    return NextResponse.json(
      {
        stats: {
          totalProjects,
          completedProjects,
          visibleProjects,
          totalNotes,
          notesWithImages,
          notesWithFiles,
          totalEmails,
          unreadEmails,
        },
        recent: {
          projects: recentProjects,
          notes: recentNotes,
          emails: recentEmails,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Failed to fetch admin statistics:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

import { connectDB } from "@/lib/connectDB";
import { Resume } from "@/models/resume.Model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const resume = await Resume.findOne({ key: "main" }).sort({
      updatedAt: -1,
    });

    return NextResponse.json({ resume }, { status: 200 });
  } catch (error) {
    // console.error("Failed to fetch resume:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = await req.json();

    if (!payload?.url?.trim()) {
      return NextResponse.json(
        { message: "Resume URL is required" },
        { status: 400 },
      );
    }

    if (!payload?.filename?.trim()) {
      return NextResponse.json(
        { message: "Resume filename is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const resume = await Resume.findOneAndUpdate(
      { key: "main" },
      {
        key: "main",
        url: String(payload.url).trim(),
        filename: String(payload.filename).trim(),
      },
      { new: true, upsert: true },
    );

    return NextResponse.json(
      { message: "Resume updated successfully", resume },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Failed to update resume:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

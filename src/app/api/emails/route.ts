import { connectDB } from "@/lib/connectDB";
import { Email } from "@/models/Email.Model";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const emails = await Email.find({}).sort({ createdAt: -1 });
    return NextResponse.json(emails, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    if (!payload?.name?.trim()) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    if (!payload?.email?.trim()) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    if (!payload?.subject?.trim()) {
      return NextResponse.json(
        { message: "Subject is required" },
        { status: 400 },
      );
    }

    if (!payload?.message?.trim()) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const email = await Email.create({
      name: payload.name.trim(),
      email: payload.email.trim(),
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      isRead: false,
    });

    return NextResponse.json(
      { message: "Email created successfully", email },
      { status: 201 },
    );
  } catch (error) {
    // console.error("Failed to create email:", error);
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
        { message: "Email ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      {
        ...(typeof payload.isRead === "boolean"
          ? { isRead: payload.isRead }
          : {}),
        ...(payload.subject ? { subject: String(payload.subject).trim() } : {}),
        ...(payload.message ? { message: String(payload.message).trim() } : {}),
      },
      { new: true },
    );

    if (!updatedEmail) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Email updated successfully", email: updatedEmail },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Failed to update email:", error);
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
        { message: "Email ID is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const deletedEmail = await Email.findByIdAndDelete(id);

    if (!deletedEmail) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Email deleted successfully", email: deletedEmail },
      { status: 200 },
    );
  } catch (error) {
    // console.error("Failed to delete email:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

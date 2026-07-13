import { connectDB } from "@/lib/connectDB";
import { sendEmail } from "@/lib/email";
import { SendEmail } from "@/models/SendMail.Model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const emails = await SendEmail.find().sort({ createdAt: -1 });
    return NextResponse.json({
      emails,
      message: "Emails fetched successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { from, to, subject, message } = body;
    if (!from || !to || !subject || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    const result = await sendEmail(from, to, message, subject, "MB");
    const messageId = result?.messageId || null;
    const email = await SendEmail.create({
      from,
      to,
      subject,
      message,
      messageId,
    });
    return NextResponse.json({
      message: "Email sent successfully",
      email,
      messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { emailId } = body;
    if (!emailId) {
      return NextResponse.json(
        { message: "Missing emailId field" },
        { status: 400 },
      );
    }
    const email = await SendEmail.findByIdAndUpdate(
      emailId,
      { isDeleted: true },
      { new: true },
    );
    if (!email) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Email deleted successfully",
      email,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { emailId, isRead } = body;
    if (!emailId || typeof isRead !== "boolean") {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }
    const email = await SendEmail.findByIdAndUpdate(
      emailId,
      { isRead },
      { new: true },
    );
    if (!email) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Email updated successfully",
      email,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

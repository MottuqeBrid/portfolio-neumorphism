import imgbbImageUpload from "@/lib/imgbbImageUpload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { message: "An image file is required" },
        { status: 400 },
      );
    }

    const url = await imgbbImageUpload(image);

    return NextResponse.json({ success: true, url }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image upload failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}

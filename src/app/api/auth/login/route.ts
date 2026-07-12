import {
  createAdminToken,
  getAuthCookieConfig,
  isAdminCredentialValid,
} from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const email = String(payload?.email || "").trim();
    const password = String(payload?.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required", success: false },
        { status: 400 },
      );
    }

    const credentialResult = isAdminCredentialValid(email, password);

    if (!credentialResult.valid) {
      if (credentialResult.reason === "missing-config") {
        return NextResponse.json(
          {
            message: "Admin credentials are not configured on server",
            success: false,
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { message: "Invalid email or password", success: false },
        { status: 401 },
      );
    }

    const token = await createAdminToken(email);
    const cookieConfig = getAuthCookieConfig();

    const response = NextResponse.json(
      { message: "Login successful", user: { email }, success: true },
      { status: 200 },
    );

    response.cookies.set(cookieConfig.name, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: cookieConfig.maxAge,
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 },
    );
  }
}

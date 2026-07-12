import { getAuthCookieConfig, verifyAdminToken } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieConfig = getAuthCookieConfig();
  const token = req.cookies.get(cookieConfig.name)?.value;
  const verifyResult = verifyAdminToken(token);

  if (!verifyResult.valid) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { authenticated: true, user: { email: verifyResult.email } },
    { status: 200 },
  );
}

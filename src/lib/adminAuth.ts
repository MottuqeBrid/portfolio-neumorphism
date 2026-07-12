import jwt from "jsonwebtoken";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_TTL_DAYS = 30;

function getSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
}

export async function createAdminToken(email: string) {
  const secret = getSecret();

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  const payload = {
    email,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_DAYS * 24 * 60 * 60,
  };

  const signature = await jwt.sign(payload, secret, { algorithm: "HS256" });

  return signature;
}

export async function verifyAdminToken(token: string | undefined | null) {
  if (!token) {
    return { valid: false, reason: "missing" } as const;
  }

  const secret = getSecret();
  if (!secret) {
    return { valid: false, reason: "missing-secret" } as const;
  }

  try {
    const payload = (await jwt.verify(token, secret)) as {
      email: string;
      role: string;
      exp: number;
    };

    if (payload.role !== "admin") {
      return { valid: false, reason: "role" } as const;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, reason: "expired" } as const;
    }

    return { valid: true, email: payload.email } as const;
  } catch {
    return { valid: false, reason: "parse" } as const;
  }
}

export function getAuthCookieConfig() {
  return {
    name: SESSION_COOKIE_NAME,
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  };
}

export function isAdminCredentialValid(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!adminEmail || !adminPassword) {
    return { valid: false, reason: "missing-config" } as const;
  }

  return {
    valid: email === adminEmail && password === adminPassword,
    reason: "invalid",
  } as const;
}

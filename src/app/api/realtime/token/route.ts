import { getOptionalSession } from "@/lib/getSession";
import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

function encode(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export async function GET() {
  try {
    const session = await getOptionalSession();
    if (!session || (session.user.role !== "STUDENT" && session.user.role !== "TUTOR")) {
      return NextResponse.json({ message: "Sign in to connect to realtime messaging." }, { status: 401 });
    }

    const signingSecret = process.env.SUPABASE_JWT_SECRET;
    if (!signingSecret) {
      return NextResponse.json({ message: "Realtime messaging is not configured." }, { status: 503 });
    }

    const issuedAt = Math.floor(Date.now() / 1_000);
    const expiresAt = issuedAt + 10 * 60;
    const header = encode({ alg: "HS256", typ: "JWT" });
    const payload = encode({
      aud: "authenticated",
      role: "authenticated",
      sub: session.user.id,
      iat: issuedAt,
      exp: expiresAt,
    });
    const unsignedToken = `${header}.${payload}`;
    const signature = createHmac("sha256", signingSecret).update(unsignedToken).digest("base64url");
    const token = `${unsignedToken}.${signature}`;

    return NextResponse.json(
      { token, expiresAt: expiresAt * 1_000 },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("Create realtime token error:", error);
    return NextResponse.json({ message: "Unable to authorize realtime messaging." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // 1. Read the session token from the cookie
    const sessionToken = request.cookies.get("graz_session")?.value;

    // 2. Check whether the session token exists
    if (!sessionToken) {
      return NextResponse.json({ message: "No session found." }, { status: 401 });
    }

    // 3. Hash the session token
    const tokenHash = createHash("sha256").update(sessionToken).digest("hex");

    // 4. Delete the session from the database
    await prisma.session.deleteMany({
      where: { tokenHash },
    });

    // 5. Create the logout response
    const response = NextResponse.json({ message: "Logged out successfully." }, { status: 200 });

    // 6. Clear the session cookie
    response.cookies.set("graz_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);

    return NextResponse.json({ message: "Unable to log out right now." }, { status: 500 });
  }
}

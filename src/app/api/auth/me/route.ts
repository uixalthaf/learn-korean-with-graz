import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Read the session cookie
    const sessionToken = request.cookies.get("graz_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    // 2. Hash the token before looking it up in the database
    const tokenHash = createHash("sha256").update(sessionToken).digest("hex");

    // 3. Find the session and its associated user
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // 4. Reject invalid sessions
    if (!session) {
      const response = NextResponse.json({ message: "Invalid session." }, { status: 401 });

      response.cookies.set("graz_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    // 5. Reject expired sessions
    if (session.expiresAt <= new Date()) {
      await prisma.session.deleteMany({
        where: { tokenHash },
      });

      const response = NextResponse.json({ message: "Session expired." }, { status: 401 });

      response.cookies.set("graz_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    // 6. Return the authenticated user's details
    return NextResponse.json({
      message: "Session restored successfully.",
      user: session.user,
    });
  } catch (error) {
    console.error("Session restoration error:", error);

    return NextResponse.json({ message: "Unable to restore session." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null || !("email" in body) || !("password" in body)) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const { email, password } = body;

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ message: "Invalid input." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      !password ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const sessionToken = randomBytes(32).toString("hex");

    const tokenHash = createHash("sha256").update(sessionToken).digest("hex");

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });
    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("graz_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);

    return NextResponse.json({ message: "Unable to log in right now." }, { status: 500 });
  }
}

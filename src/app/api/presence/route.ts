import { recordUserPresence } from "@/features/messages/services/messages.service";
import { getOptionalSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await getOptionalSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to update presence." }, { status: 401 });
    }

    if (session.user.role !== "STUDENT" && session.user.role !== "TUTOR") {
      return NextResponse.json({ message: "Presence is not available for this account." }, { status: 403 });
    }

    await recordUserPresence(session.user.id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Update presence error:", error);
    return NextResponse.json({ message: "Unable to update presence." }, { status: 500 });
  }
}

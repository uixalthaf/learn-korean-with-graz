import { listConversations } from "@/features/messages/services/messages.service";
import type { MessagingRole } from "@/features/messages/types";
import { getOptionalSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getOptionalSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to view messages." }, { status: 401 });
    }

    if (session.user.role !== "STUDENT" && session.user.role !== "TUTOR") {
      return NextResponse.json({ message: "Messaging is not available for this account." }, { status: 403 });
    }

    const conversations = await listConversations(session.user.id, session.user.role as MessagingRole);
    return NextResponse.json({ role: session.user.role, viewerId: session.user.id, conversations });
  } catch (error) {
    console.error("List conversations error:", error);
    return NextResponse.json({ message: "Unable to load conversations." }, { status: 500 });
  }
}

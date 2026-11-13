import { countUnreadMessages } from "@/features/messages/services/messages.service";
import { getOptionalSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getOptionalSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to view unread messages." }, { status: 401 });
    }
    if (session.user.role !== "STUDENT" && session.user.role !== "TUTOR") {
      return NextResponse.json({ message: "Messaging is not available for this account." }, { status: 403 });
    }

    const unreadCount = await countUnreadMessages(session.user.id, session.user.role);
    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error("Count unread messages error:", error);
    return NextResponse.json({ message: "Unable to load unread message count." }, { status: 500 });
  }
}

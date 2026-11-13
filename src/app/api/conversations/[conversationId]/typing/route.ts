import { updateConversationTyping } from "@/features/messages/services/messages.service";
import { getOptionalSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ conversationId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await getOptionalSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to update typing status." }, { status: 401 });
    }

    const role = session.user.role;
    if (role !== "STUDENT" && role !== "TUTOR") {
      return NextResponse.json({ message: "Typing status is not available for this account." }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Send a valid typing status." }, { status: 400 });
    }

    if (typeof body !== "object" || body === null || !("isTyping" in body) || typeof body.isTyping !== "boolean") {
      return NextResponse.json({ message: "Typing status must be true or false." }, { status: 400 });
    }

    const { conversationId } = await context.params;
    const updated = await updateConversationTyping(session.user.id, role, conversationId, body.isTyping);
    if (!updated) {
      return NextResponse.json({ message: "Conversation not found." }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Update typing status error:", error);
    return NextResponse.json({ message: "Unable to update typing status." }, { status: 500 });
  }
}

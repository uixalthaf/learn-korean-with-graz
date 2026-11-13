import {
  createConversationMessage,
  listConversationMessages,
} from "@/features/messages/services/messages.service";
import { getOptionalSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ conversationId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getOptionalSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to view messages." }, { status: 401 });
    }

    const { conversationId } = await context.params;
    const messages = await listConversationMessages(session.user.id, conversationId);
    if (!messages) {
      return NextResponse.json({ message: "Conversation not found." }, { status: 404 });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("List conversation messages error:", error);
    return NextResponse.json({ message: "Unable to load messages." }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await getOptionalSession();
    if (!session) {
      return NextResponse.json({ message: "Sign in to send a message." }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Send a valid message." }, { status: 400 });
    }

    if (typeof body !== "object" || body === null || !("body" in body) || typeof body.body !== "string") {
      return NextResponse.json({ message: "Message text is required." }, { status: 400 });
    }

    const messageBody = body.body.trim();
    if (!messageBody) {
      return NextResponse.json({ message: "Message text cannot be empty." }, { status: 400 });
    }
    if (messageBody.length > 5000) {
      return NextResponse.json({ message: "Messages must be 5,000 characters or fewer." }, { status: 413 });
    }

    const { conversationId } = await context.params;
    const message = await createConversationMessage(session.user.id, conversationId, messageBody);
    if (!message) {
      return NextResponse.json({ message: "Conversation not found." }, { status: 404 });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Create conversation message error:", error);
    return NextResponse.json({ message: "Unable to send this message." }, { status: 500 });
  }
}

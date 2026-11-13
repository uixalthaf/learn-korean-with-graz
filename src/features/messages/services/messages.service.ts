import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type {
  ConversationMessage,
  ConversationSummary,
  MessagingRole,
} from "../types";

const ONLINE_WINDOW_MS = 75_000;
const MESSAGE_HISTORY_LIMIT = 50;

export async function listConversations(userId: string, role: MessagingRole) {
  if (role === "STUDENT") {
    const conversation = await getOrCreateStudentConversation(userId);
    return conversation ? mapConversations(userId, role, [conversation]) : [];
  }

  await ensureTutorStudentConversations(userId);

  const conversations = await prisma.conversation.findMany({
    where: { tutorId: userId },
    include: conversationInclude,
    orderBy: { updatedAt: "desc" },
  });

  return mapConversations(userId, role, conversations);
}

async function ensureTutorStudentConversations(tutorId: string) {
  const primaryTutor = await prisma.user.findFirst({
    where: { role: "TUTOR" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  const studentConditions: Prisma.UserWhereInput[] = [
    { classEnrollments: { some: { classSession: { tutorId } } } },
  ];

  if (primaryTutor?.id === tutorId) {
    studentConditions.push({ classEnrollments: { none: {} } });
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT", OR: studentConditions },
    select: { id: true },
  });

  if (students.length === 0) return;

  await prisma.conversation.createMany({
    data: students.map(({ id: studentId }) => ({ studentId, tutorId })),
    skipDuplicates: true,
  });
}

export async function listConversationMessages(userId: string, conversationId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ studentId: userId }, { tutorId: userId }],
    },
    select: { id: true, studentId: true, tutorTypingAt: true, studentTypingAt: true },
  });

  if (!conversation) return null;

  const unreadCount = await prisma.message.count({
    where: { conversationId, senderId: { not: userId }, readAt: null },
  });

  if (unreadCount > 0) {
    await prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: MESSAGE_HISTORY_LIMIT,
    select: {
      id: true,
      conversationId: true,
      senderId: true,
      body: true,
      createdAt: true,
      readAt: true,
    },
  });

  const peerTypingAt = userId === conversation.studentId
    ? conversation.tutorTypingAt
    : conversation.studentTypingAt;

  return {
    messages: messages.reverse().map(mapMessage),
    peerIsTyping: peerTypingAt !== null && Date.now() - peerTypingAt.getTime() < 4_000,
  };
}

export async function updateConversationTyping(
  userId: string,
  role: MessagingRole,
  conversationId: string,
  isTyping: boolean,
) {
  const timestamp = isTyping ? new Date() : null;
  const updatedRows = role === "STUDENT"
    ? await prisma.$executeRaw`UPDATE "Conversation" SET "studentTypingAt" = ${timestamp} WHERE "id" = ${conversationId} AND "studentId" = ${userId}`
    : await prisma.$executeRaw`UPDATE "Conversation" SET "tutorTypingAt" = ${timestamp} WHERE "id" = ${conversationId} AND "tutorId" = ${userId}`;

  return updatedRows === 1;
}

export async function createConversationMessage(
  userId: string,
  conversationId: string,
  body: string,
) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ studentId: userId }, { tutorId: userId }],
    },
    select: { id: true },
  });

  if (!conversation) return null;

  const message = await prisma.$transaction(async (transaction) => {
    const created = await transaction.message.create({
      data: { conversationId, senderId: userId, body },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        body: true,
        createdAt: true,
        readAt: true,
      },
    });

    await transaction.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: created.createdAt },
    });

    return created;
  });

  return mapMessage(message);
}

export async function recordUserPresence(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { lastSeenAt: new Date() } });
}

export async function countUnreadMessages(userId: string, role: MessagingRole) {
  return prisma.message.count({
    where: {
      readAt: null,
      senderId: { not: userId },
      conversation: role === "TUTOR" ? { tutorId: userId } : { studentId: userId },
    },
  });
}

async function getOrCreateStudentConversation(studentId: string) {
  const latestEnrollment = await prisma.classEnrollment.findFirst({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    select: { classSession: { select: { tutorId: true } } },
  });

  const tutor = latestEnrollment
    ? { id: latestEnrollment.classSession.tutorId }
    : await prisma.user.findFirst({
        where: { role: "TUTOR" },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });

  if (!tutor) return null;

  await prisma.conversation.upsert({
    where: { studentId_tutorId: { studentId, tutorId: tutor.id } },
    create: { studentId, tutorId: tutor.id },
    update: {},
    select: { id: true },
  });

  return prisma.conversation.findUnique({
    where: { studentId_tutorId: { studentId, tutorId: tutor.id } },
    include: conversationInclude,
  });
}

const conversationInclude = {
  student: { select: { id: true, name: true, email: true, role: true, lastSeenAt: true } },
  tutor: { select: { id: true, name: true, email: true, role: true, lastSeenAt: true } },
  messages: {
    take: 1,
    orderBy: { createdAt: "desc" as const },
    select: {
      id: true,
      conversationId: true,
      senderId: true,
      body: true,
      createdAt: true,
      readAt: true,
    },
  },
} satisfies Prisma.ConversationInclude;

type ConversationRecord = Prisma.ConversationGetPayload<{ include: typeof conversationInclude }>;

async function mapConversations(
  userId: string,
  role: MessagingRole,
  conversations: ConversationRecord[],
): Promise<ConversationSummary[]> {
  if (conversations.length === 0) return [];

  const unreadCounts = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      conversationId: { in: conversations.map(({ id }) => id) },
      senderId: { not: userId },
      readAt: null,
    },
    _count: { _all: true },
  });
  const unreadByConversation = new Map(
    unreadCounts.map(({ conversationId, _count }) => [conversationId, _count._all]),
  );
  const now = Date.now();

  return conversations.map((conversation) => {
    const peer = role === "STUDENT" ? conversation.tutor : conversation.student;
    return {
      id: conversation.id,
      peer: {
        id: peer.id,
        name: peer.name,
        email: peer.email,
        role: peer.role as MessagingRole,
        isOnline: peer.lastSeenAt !== null && now - peer.lastSeenAt.getTime() < ONLINE_WINDOW_MS,
      },
      lastMessage: conversation.messages[0] ? mapMessage(conversation.messages[0]) : null,
      unreadCount: unreadByConversation.get(conversation.id) ?? 0,
      updatedAt: conversation.updatedAt.toISOString(),
    };
  });
}

function mapMessage(message: {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: Date;
  readAt: Date | null;
}): ConversationMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
    readAt: message.readAt?.toISOString() ?? null,
  };
}

ALTER TABLE "User"
ADD COLUMN "lastSeenAt" TIMESTAMPTZ(3);

CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "studentId" UUID NOT NULL,
    "tutorId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" UUID NOT NULL,
    "body" TEXT NOT NULL,
    "readAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Conversation_studentId_tutorId_key"
ON "Conversation"("studentId", "tutorId");

CREATE INDEX "Conversation_tutorId_updatedAt_idx"
ON "Conversation"("tutorId", "updatedAt");

CREATE INDEX "Message_conversationId_createdAt_idx"
ON "Message"("conversationId", "createdAt");

CREATE INDEX "Message_conversationId_senderId_readAt_idx"
ON "Message"("conversationId", "senderId", "readAt");

ALTER TABLE "Conversation"
ADD CONSTRAINT "Conversation_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation"
ADD CONSTRAINT "Conversation_tutorId_fkey"
FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message"
ADD CONSTRAINT "Message_conversationId_fkey"
FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Message"
ADD CONSTRAINT "Message_senderId_fkey"
FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

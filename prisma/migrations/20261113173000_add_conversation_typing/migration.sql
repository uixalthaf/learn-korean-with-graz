ALTER TABLE "Conversation"
ADD COLUMN "studentTypingAt" TIMESTAMPTZ(3),
ADD COLUMN "tutorTypingAt" TIMESTAMPTZ(3);

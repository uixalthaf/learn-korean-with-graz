CREATE TYPE "ClassStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'COMPLETED');

CREATE TABLE "ClassSession" (
  "id" TEXT NOT NULL,
  "title" VARCHAR(160) NOT NULL,
  "startsAt" TIMESTAMPTZ(3) NOT NULL,
  "timeZone" VARCHAR(64) NOT NULL DEFAULT 'UTC',
  "durationMinutes" INTEGER NOT NULL,
  "notes" TEXT,
  "meetingUrl" TEXT,
  "calendarEventId" VARCHAR(255),
  "status" "ClassStatus" NOT NULL DEFAULT 'SCHEDULED',
  "tutorId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "ClassSession_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ClassSession_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ClassEnrollment" (
  "id" TEXT NOT NULL,
  "classSessionId" TEXT NOT NULL,
  "studentId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ClassEnrollment_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ClassEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ClassSession_tutorId_startsAt_idx" ON "ClassSession"("tutorId", "startsAt");
CREATE INDEX "ClassSession_status_startsAt_idx" ON "ClassSession"("status", "startsAt");
CREATE UNIQUE INDEX "ClassEnrollment_classSessionId_studentId_key" ON "ClassEnrollment"("classSessionId", "studentId");
CREATE INDEX "ClassEnrollment_studentId_classSessionId_idx" ON "ClassEnrollment"("studentId", "classSessionId");

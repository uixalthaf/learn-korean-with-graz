import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const getOptionalSession = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("graz_session")?.value;

  if (!sessionToken) {
    return null;
  }

  const tokenHash = createHash("sha256").update(sessionToken).digest("hex");

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    select: {
      expiresAt: true,
      user: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return session;
};

export const getSession = async () => {
  const session = await getOptionalSession();

  if (!session) {
    redirect("/auth/login");
  }

  return session;
};

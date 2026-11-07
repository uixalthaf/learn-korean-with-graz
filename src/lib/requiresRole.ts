import { getSession } from "./getSession";

type Role = "TUTOR" | "STUDENT";

export const requireRole = async (requiredRole: Role) => {
  const session = await getSession();

  const authorized = session.user.role === requiredRole;

  return {
    session,
    authorized,
    dashboardHref: session.user.role === "TUTOR" ? "/dashboard/tutor" : "/dashboard/student",
  };
};

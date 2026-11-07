import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";

export default async function DashboardRedirect() {
  const session = await getSession();

  if (session.user.role === "TUTOR") {
    redirect("/dashboard/tutor");
  }

  if (session.user.role === "STUDENT") {
    redirect("/dashboard/student");
  }

  redirect("/home");
}

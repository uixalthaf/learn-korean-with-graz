import { redirect } from "next/navigation";

import Hero from "@/features/landing/components/Hero";
import Navbar from "@/features/landing/components/Navbar";
import { getOptionalSession } from "@/lib/getSession";

export default async function Home() {
  const session = await getOptionalSession();

  if (session) {
    if (session.user.role === "TUTOR") {
      redirect("/dashboard/tutor");
    }

    if (session.user.role === "STUDENT") {
      redirect("/dashboard/student");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col justify-center bg-background px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
    </main>
  );
}

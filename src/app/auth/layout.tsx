import { TUTOR_NAME } from "@/config/tutorInfo";
import sidebarVector from "@/assets/images/sidebar_vector_illustration.png";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className="min-h-screen grid md:grid-cols-2"
      style={{
        backgroundImage: `url(${sidebarVector.src})`,
        backgroundSize: "40% auto",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0% 100%",
      }}
    >
      {/* Left panel — Branding */}
      <section className="hidden md:flex flex-col justify-center p-12 border-r-1 border-border">
        <h2 className="mt-6 text-3xl font-semibold">Learn Korean with {TUTOR_NAME}</h2>

        <p className="mt-4">Your journey to Korean fluency starts here.</p>
      </section>

      {/* Right panel — Login or Signup */}
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}

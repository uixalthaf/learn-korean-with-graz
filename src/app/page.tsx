import Hero from "@/features/landing/components/Hero";
import Navbar from "@/features/landing/components/Navbar";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col justify-center bg-background px-4 sm:px-6 lg:px-8">
      <Navbar />
      <Hero />
    </main>
  );
}

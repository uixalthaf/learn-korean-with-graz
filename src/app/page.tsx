"use client"
import { Button } from "@/components/ui/Button/Button";
import ButtonDemo from "@/components/ui/Button/ButtonDemo";
import Hero from "@/features/landing/components/Hero";
import Navbar from "@/features/landing/components/Navbar";


export default function Home() {
  return (
    <main className="justify-center bg-background flex flex-col w-[60%] mx-auto">
      <Navbar/>
      <Hero/>
    </main>
  );
}

import koreanStudy from "@/assets/images/korean_study.png";
import { Button } from "@/components/ui/Button/Button";
import { TUTOR_NAME } from "@/config/tutorInfo";
import { BookOpen, Leaf, MessagesSquare, MoveRight } from "lucide-react";
import Image from "next/image";
import FeatureStrip from "./FeatureStrip";
import WhyLearnKorean from "./WhyLearnKorean";
import TutorIntro from "./TutorIntro";
import Footer from "./Footer";
import Courses from "./Courses";

function Hero() {
  return (
    <section className="mt-2">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between lg:gap-12">
        <div className="mt-10 flex min-w-0 flex-1 flex-col gap-5 md:mt-16">
          <span className="text-xs bg-accent-background! p-2 rounded-xl w-fit">
            YOUR KOREAN LANGUAGE JOURNEY STARTS HERE.
          </span>
          <h2>
            A new lnguage. <br />A whole new world.
          </h2>
          <p>
            Learn Korean from Hangul to real conversations with structured lessons and personalized
            guidance from Graz.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm">
              Start Learning &ensp; <MoveRight width={18} />
            </Button>
            <Button variant="secondary">Meet Your Tutor</Button>
          </div>
          <div className="flex gap-4 mt-5 flex-wrap">
            <div className="flex gap-3 items-center">
              <BookOpen />
              <div className="flex flex-col">
                <span className="text-accent-foreground font-bold">Beginner to Advance</span>
                <span className="text-xs">Structured Lessons</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <MessagesSquare />
              <div className="flex flex-col">
                <span className="text-accent-foreground font-bold">Live Online classes</span>
                <span className="text-xs">Learn at your pace</span>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Leaf />
              <div className="flex flex-col">
                <span className="text-accent-foreground font-bold">Personal Guidance</span>
                <span className="text-xs">From {TUTOR_NAME}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-[280px] w-full shrink-0 overflow-hidden sm:h-[360px] md:h-[360px] md:w-[42%] lg:h-[500px] lg:w-[48%]">
          <svg className="absolute h-0 w-0" aria-hidden="true">
            <defs>
              <clipPath id="hero-curve" clipPathUnits="objectBoundingBox">
                <path d="M 0.2 0 H 1 V 1 H 0.2 C 0.05 1 0.05 0.7 0.2 0.5 C 0.35 0.3 0.05 0 0.2 0 Z" />
              </clipPath>
            </defs>
          </svg>

          <Image
            src={koreanStudy}
            alt="A cozy Korean study desk"
            fill
            className="[clip-path:url(#hero-curve)] object-cover"
          />
        </div>
      </div>

      <FeatureStrip />
      <WhyLearnKorean />
      <Courses />
      <TutorIntro />
      <Footer />
    </section>
  );
}

export default Hero;

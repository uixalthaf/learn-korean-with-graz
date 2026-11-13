import React from "react";
import { TUTOR_NAME } from "@/config/tutorInfo";
import { Calendar, ChartSpline, LanguagesIcon, MessagesSquare } from "lucide-react";
const FeatureStrip = () => {
  return (
    <div
      id="how-it-works"
      className="scroll-mt-24 mt-10 grid w-full grid-cols-1 gap-5 rounded-2xl bg-[#eee6d8] p-5 sm:grid-cols-2 sm:gap-6 sm:p-7 lg:grid-cols-4"
    >
      <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
        <LanguagesIcon width={28} height={28} className="shrink-0 text-primary" aria-hidden="true" />
        <span className="text-sm font-bold text-heading">Learn Hangul</span>
        <p className="max-w-[18rem] text-sm leading-5 text-muted">Start with the basics and build a strong foundation.</p>
      </div>
      <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
        <MessagesSquare width={28} height={28} className="shrink-0 text-primary" aria-hidden="true" />
        <span className="text-sm font-bold text-heading">Real Conversations</span>
        <p className="max-w-[18rem] text-sm leading-5 text-muted">Use Korean in everyday situations.</p>
      </div>
      <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
        <Calendar width={28} height={28} className="shrink-0 text-primary" aria-hidden="true" />
        <span className="text-sm font-bold text-heading">Live 1:1 or small group</span>
        <p className="max-w-[18rem] text-sm leading-5 text-muted">Interactive lessons with {TUTOR_NAME}.</p>
      </div>
      <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
        <ChartSpline width={28} height={28} className="shrink-0 text-primary" aria-hidden="true" />
        <span className="text-sm font-bold text-heading">Progress with confidence</span>
        <p className="max-w-[18rem] text-sm leading-5 text-muted">Practical, supportive, and structured.</p>
      </div>
    </div>
  );
};

export default FeatureStrip;

import { Button } from "@/components/ui/Button/Button";
import { TUTOR_NAME } from "@/config/tutorInfo";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import hanokRoof from "@/assets/images/hanok_roof.png";

const WhyLearnKorean = () => {
  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
      <div className="flex min-w-0 flex-col gap-4 md:flex-1">
        <span className="uppercase">WHY LEARN KOREAN WITH {TUTOR_NAME}?</span>
        <h3>More than just a language.</h3>

        <p>
          안녕하세요 Learning Korean opens the door to a new culture, meaningful connections, and
          exciting opportunities. Whether you're drawn to K-dramas, K-pop, Korean traditions, or
          simply want to learn a new language, Graz will guide you with structured lessons and
          personalized support every step of the way.
        </p>
        <Button variant="primary" className="w-fit">
          Explore Courses <ArrowRight size={16} />
        </Button>
      </div>
      <div className="w-full md:w-[42%]">
        <Image src={hanokRoof} alt="hanok roof" className="w-full rounded-xl object-cover" />
      </div>
    </div>
  );
};

export default WhyLearnKorean;

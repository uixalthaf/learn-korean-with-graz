import { Button } from "@/components/ui/Button/Button";
import { TUTOR_NAME } from "@/config/tutorInfo";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import hanokRoof from "@/assets/images/hanok_roof.png";

const WhyLearnKorean = () => {
  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="flex flex-col gap-4">
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
      <div>
        <Image src={hanokRoof} alt="hanok roof" />
      </div>
    </div>
  );
};

export default WhyLearnKorean;

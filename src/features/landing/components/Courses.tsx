import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card/Card";
import Image from "next/image";
import koreanForBeginners from "@/assets/images/korean_for_beginners.png";
import conversationalKorean from "@/assets/images/conversational_korean.png";
import koreanCulture from "@/assets/images/korean_culture.png";
import { ArrowRight } from "lucide-react";

const Courses = () => {
  const coursesInfo = [
    {
      courseName: "Korean For Beginners",
      courseDesc:
        "Start your Korean journey with Hangul, essential vocabulary, and simple grammar. Build a strong foundation at your own pace.",
      courseImage: koreanForBeginners,
    },
    {
      courseName: "Conversational Korean",
      courseDesc:
        "Speak Korean with confidence through practical conversations, everyday expressions, and interactive speaking practice.",
      courseImage: conversationalKorean,
    },
    {
      courseName: "Korean Culture & More",
      courseDesc:
        "Explore Korean traditions, food, travel, K-pop, and K-dramas while discovering the culture behind the language.",
      courseImage: koreanCulture,
    },
  ];
  return (
    <div className="mt-8">
      <span className="uppercase">Our Courses</span>
      <h3>Structured Lessons for your Goals</h3>
      <div className="flex justify-between gap-4 mt-6 flex-wrap">
        {coursesInfo.map((course, index) => (
          <Card className="flex flex-col flex-1" key={index}>
            <CardBody className="p-0">
              <Image
                src={course.courseImage}
                alt=""
                className="max-h-[150px] min-h-[150px] w-full rounded-t-xl object-cover"
              />
            </CardBody>
            <CardFooter className="flex justify-between items-center p-4 gap-2">
              <div className="flex flex-col gap-2">
                <h4>{course.courseName}</h4>
                <p>{course.courseDesc}</p>
              </div>
              <div className="rounded-full border border-gray cursor-pointer">
                <ArrowRight />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;

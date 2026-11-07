import { Play } from "lucide-react";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card/Card";

import koreanBookCat from "@/assets/images/korean_book_cat.png";
import { Button } from "@/components/ui/Button/Button";
const ContinueCard = ({ title = "Continue Learning" }: { title?: string }) => {
  return (
    <Card
      className="bg-primary text-white h-44 w-80"
      style={{
        backgroundImage: `url(${koreanBookCat.src})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: " cover",
      }}
    >
      <CardHeader>
        <CardTitle className="text-lg!">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <Button variant="primary" size="sm" className="mt-4">
          Continue
          <Play className="ml-2 h-4 w-4" />
        </Button>
      </CardBody>
    </Card>
  );
};

export default ContinueCard;

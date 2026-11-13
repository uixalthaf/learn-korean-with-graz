import tutorDashboardData from "@/features/dashboard/data/demoDashboardData";
import { Button } from "@/components/ui/Button/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card/Card";
import { Calendar, InfoIcon, Video } from "lucide-react";

const GroupSessionsSection = () => {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex gap-2">
          <Calendar />
          Today&apos;s Group Sessions
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          {tutorDashboardData.groupSessions.map((session) => (
            <div
              className="flex gap-4 justify-between items-center border-b border-stone-200 last:border-b-0 pb-4"
              key={session.id}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm p-4 text-center bg-accent-background rounded-lg flex justify-center font-bold">
                  {session.timeLabel}
                </div>
                <span className="font-semibold">{session.course}</span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">{session.studentCount} students</span>
                <span className="text-sm text-stone-500">{session.level}</span>
              </div> */}
              <div className="flex flex-col gap-2">
                <Button className="" variant="primary" size="sm">
                  <Video className="mr-2" /> Join Class
                </Button>
                <Button className="" variant="secondary" size="sm">
                  <InfoIcon className="mr-2" size={18} /> View Details
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default GroupSessionsSection;

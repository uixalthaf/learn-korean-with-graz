import React from "react";
import AppSidebar from "@/components/ui/layout/AppSidebar";
import AppHeader from "@/components/ui/layout/AppHeader";
import AppBody from "@/components/ui/layout/AppBody";

const TutorLayout = () => {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col w-full">
        <AppHeader />
        <AppBody />
      </div>
    </div>
  );
};

export default TutorLayout;

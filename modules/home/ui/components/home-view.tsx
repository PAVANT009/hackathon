import HomeRecent from "@/modules/home/ui/components/home-recent";
import QuickStart from "@/modules/home/ui/components/quick-start";
import React from "react";



export default function HomeView() {
  return (
    <div className="flex h-full w-full min-w-0 flex-col p-4 md:p-6 gap-4">
      <QuickStart/>
      <HomeRecent/>
    </div>
  );
}

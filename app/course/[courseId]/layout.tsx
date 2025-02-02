import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { CourseSideBar } from "./_components/CourseSideBar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <CourseSideBar/>
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}

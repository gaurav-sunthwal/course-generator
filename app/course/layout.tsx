import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { CourseSideBar } from "./[courseId]/[chapterId]/_components/CourseSideBar";
import Header from "../_components/Header";
import { Box, HStack } from "@chakra-ui/react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <CourseSideBar />
        <main className="w-full">
          <HStack w="100%">
            <SidebarTrigger />
            <Box w="100%">
              <Box w="100%">
                <Header params="course" />
              </Box>
             
            </Box>
          </HStack>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}

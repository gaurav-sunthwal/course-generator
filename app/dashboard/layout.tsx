import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import Header from "../_components/Header";
import { HStack } from "@chakra-ui/react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <HStack w={"100%"}>
          <SidebarTrigger />
          <div className="w-full">
            <Header params="dashboard" />
          </div>
        </HStack>
        {children}
      </main>
    </SidebarProvider>
  );
}

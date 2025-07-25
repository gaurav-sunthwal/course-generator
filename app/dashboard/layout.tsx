import { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import Header from "../_components/Header";

export const metadata: Metadata = {
  title: {
    template: "%s | Course Generator Dashboard",
    default: "Dashboard - Course Generator",
  },
  description:
    "Manage your courses, explore content, and upgrade your learning experience with our AI-powered course generator.",
  keywords: [
    "dashboard",
    "course management",
    "learning platform",
    "AI courses",
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex w-full">
          <SidebarTrigger />
          <div className="w-full">
            <Header params="dashboard" />
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}

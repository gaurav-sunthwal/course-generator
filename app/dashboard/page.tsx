import React from "react";
import DashboardContent from "./dashboard-content";
import { Heading, HStack } from "@chakra-ui/react";
import Header from "../_components/Header";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import Link from "next/link";

interface Metadata {
  title: string;
  description: string;
}
export const metadata: Metadata = {
  title: "Dashboard | CourseCrafter AI",
  description: "Create and manage your AI-powered courses",
};
export default function page() {
  return (
    <div className="">
      <Header params="dashboard" />
      <HStack justifyContent={"space-evenly"} className="p-4">
        {/* <Heading className="text-center text-3xl font-bold">Dashboard</Heading> */}
        <Link href={"/create"}>
          <Button className="ml-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </Link>
      </HStack>
    </div>
  );
}

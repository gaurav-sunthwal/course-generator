"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { courseDetails } from "@/api/utlis/schema";
import { db } from "@/api/utlis/db";
import { eq } from "drizzle-orm";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Box, Spinner } from "@chakra-ui/react";

export function CourseSideBar() {
  const { courseId , chapterId } = useParams();

  const [title, setTitle] = useState<
    {
      id: number;
      title: string;
      description: string;
      estimatedReadingTime: string;
      content: string;
      codeExamples: string;
      importantNotes: string;
      chapterId: string;
      courseId: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      const fetchTitle = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await db
            .select()
            .from(courseDetails)
            .where(eq(courseDetails.courseId, courseId as string));
          setTitle(data);
        } catch (err) {
          setError("Failed to fetch course data");
          console.error("Error fetching course data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchTitle();
    }
  }, [courseId]);
  
  return (
    <Sidebar>
      <SidebarContent className="p-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-gray-700">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading && (
                <Box className="flex justify-center my-4">
                  <Spinner size="md" color="blue.500" />
                </Box>
              )}
              {error && <Box className="text-red-500 p-2">{error}</Box>}
              {!loading && !error && title.length === 0 && (
                <SidebarMenuItem className="text-gray-500">
                  No chapters found
                </SidebarMenuItem>
              )}
              {title.map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={`/course/${item.courseId}/${item.chapterId}`}
                    className="no-underline hover:text-blue-500"
                  >
                    <SidebarMenuItem className={item.chapterId === chapterId ? "bg-blue-100 shadow-sm rounded-lg p-2 text-black" : `hover:bg-blue-100 hover:shadow-sm hover:rounded-lg p-2`} >
                      {item.title}
                    </SidebarMenuItem>
                  </Link>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

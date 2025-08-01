"use client";
import { db } from "@/app/api/utlis/db";
import { courseDetails } from "@/app/api/utlis/schema";
import { Button } from "@/components/ui/button";
import { HStack } from "@chakra-ui/react";
import { eq } from "drizzle-orm";
import { StepBack, StepForward } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Footer() {
  const { courseId, chapterId } = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    // Fetch all chapters for this course
    const fetchChapters = async () => {
      try {
        const data = await db
          .select()
          .from(courseDetails)
          .where(eq(courseDetails.courseId, courseId as string));

        if (data.length > 0) {
          // Extract all chapter IDs in order
          const chapterIds = data.map((chapter) => chapter.chapterId);
          setChapters(chapterIds);

          // Find current chapter index
          const index = chapterIds.findIndex((id) => id === chapterId);
          setCurrentIndex(index);
        } else {
          console.error("Course not found");
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    if (courseId) {
      fetchChapters();
    }
  }, [courseId, chapterId]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevChapterId = chapters[currentIndex - 1];
      router.push(`/course/${courseId}/${prevChapterId}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) {
      const nextChapterId = chapters[currentIndex + 1];
      router.push(`/course/${courseId}/${nextChapterId}`);
    }
  };

  return (
    <div className="w-full z-20">
      <HStack justifyContent={"space-around"} w={"100%"} gap={5}>
        <Button
          variant={"outline"}
          onClick={handlePrevious}
          disabled={currentIndex <= 0}
        >
          <StepBack className="mr-2" /> Previous Page
        </Button>
        <div className="hidden lg:block">
          © 2025 Brisky Web. All rights reserved. Created by{" "}
          <Link href="https://gaurav-sunthwal.vercel.app">Gaurav Sunthwal</Link>
        </div>
        <Button
          variant={"outline"}
          onClick={handleNext}
          disabled={currentIndex >= chapters.length - 1}
        >
          Next Page <StepForward className="ml-2" />
        </Button>
      </HStack>
    </div>
  );
}

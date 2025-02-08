"use client";
import { db } from "@/api/utlis/db";
import { courseDetails } from "@/api/utlis/schema";
import { eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const { courseId } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Fetch the data from the database
    const fetchData = async () => {
      try {
        const data = await db
          .select()
          .from(courseDetails)
          .where(eq(courseDetails.courseId, courseId as string))
          .limit(1); // Limit to 1 result for the specific courseId

        if (data.length > 0) {
          // If the courseId matches, get the first chapterId from the fetched data
          const firstChapterId = data[0].chapterId;

          // Redirect to the first chapter page
          router.push(`/course/${courseId}/${firstChapterId}`);
        } else {
          console.error("Course not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call fetchData
    fetchData();
    console.log("Fetching data");
  }, [courseId, router]);

  return <div>Loading...</div>;
}

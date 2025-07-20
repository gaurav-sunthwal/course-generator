import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { db } from "@/api/utlis/db";
import { courseDetails } from "@/api/utlis/schema";
import { eq } from "drizzle-orm";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params;

  try {
    const courseData = await db
      .select()
      .from(courseDetails)
      .where(eq(courseDetails.courseId, courseId))
      .limit(1);

    if (courseData.length === 0) {
      return {
        title: "Course Not Found",
        description: "The requested course could not be found.",
      };
    }

    const course = courseData[0];

    return {
      title: `${course.title || "Course"} - CourseCrafter AI`,
      description:
        course.description ||
        "Explore this comprehensive course created with AI assistance.",
      keywords: [
        "online course",
        "learning",
        "education",
        "AI-generated content",
      ],
      openGraph: {
        title: `${course.title || "Course"} - CourseCrafter AI`,
        description:
          course.description ||
          "Explore this comprehensive course created with AI assistance.",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${course.title || "Course"} - CourseCrafter AI`,
        description:
          course.description ||
          "Explore this comprehensive course created with AI assistance.",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Course - CourseCrafter AI",
      description:
        "Explore this comprehensive course created with AI assistance.",
    };
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;

  try {
    const data = await db
      .select()
      .from(courseDetails)
      .where(eq(courseDetails.courseId, courseId))
      .limit(1);

    if (data.length === 0) {
      notFound();
    }

    // If the courseId matches, get the first chapterId from the fetched data
    const firstChapterId = data[0].chapterId;

    // Redirect to the first chapter page
    redirect(`/course/${courseId}/${firstChapterId}`);
  } catch (error) {
    const data = await db
      .select()
      .from(courseDetails)
      .where(eq(courseDetails.courseId, courseId))
      .limit(1);

    if (data.length === 0) {
      notFound();
    }
    const firstChapterId = data[0].chapterId;
    redirect(`/course/${courseId}/${firstChapterId}`);
    console.error("Error fetching course data:", error);
    notFound();
  }
}

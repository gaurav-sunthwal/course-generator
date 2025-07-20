import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/api/utlis/db";
import { coursesTable } from "@/api/utlis/schema";
import StructuredData from "./StructuredData";
import OutlineEditor from "./OutlineEditor";

interface Chapter {
  id: string;
  title: string;
  description: string;
  chapterTitle: string;
  chapterDescription: string;
}

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId } = await params;

  try {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.courseId, courseId))
      .limit(1);

    if (result.length === 0) {
      return {
        title: "Course Not Found | CourseCrafter AI",
        description: "The requested course could not be found.",
      };
    }

    const course = result[0];
    const title = course.title || "Untitled Course";
    const description =
      course.description || "Course outline and content management.";

    return {
      title: `${title} - Course Outline | CourseCrafter AI`,
      description: `Edit and manage the outline for "${title}". ${description}`,
      keywords: [
        "course outline",
        "course creation",
        "AI course generator",
        "online learning",
        "educational content",
        title.toLowerCase(),
        course.category?.toLowerCase() || "education",
      ],
      openGraph: {
        title: `${title} - Course Outline`,
        description: `Edit and manage the outline for "${title}". ${description}`,
        type: "website",
        url: `/create/${courseId}/Outline`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} - Course Outline`,
        description: `Edit and manage the outline for "${title}". ${description}`,
      },
      robots: {
        index: false, // Don't index course creation pages
        follow: true,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Course Outline | CourseCrafter AI",
      description: "Edit and manage your course outline.",
    };
  }
}

// Server component to fetch data
export default async function OutlinePage({ params }: PageProps) {
  const { courseId } = await params;

  try {
    const result = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.courseId, courseId))
      .limit(1);

    if (result.length === 0) {
      notFound();
    }

    const course = result[0];
    const title = course.title || "";
    const description = course.description || "";

    const parsedChapters =
      typeof course.chapters === "string"
        ? JSON.parse(course.chapters)?.chapters || []
        : course.chapters || [];

    const chapters: Chapter[] = Array.isArray(parsedChapters)
      ? parsedChapters
      : [];

    return (
      <>
        <StructuredData
          title={title}
          description={description}
          courseId={courseId}
          category={course.category}
          createdBy={course.createdBy}
        />
        <OutlineEditor
          courseId={courseId}
          initialTitle={title}
          initialDescription={description}
          initialChapters={chapters}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching course data:", error);
    notFound();
  }
}

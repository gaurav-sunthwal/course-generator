import { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/api/utlis/db";
import { courseDetails, coursesTable } from "@/api/utlis/schema";
import ChapterStructuredData from "./ChapterStructuredData";
import ChapterViewer from "./ChapterViewer";

interface CodeExample {
  language: string;
  code: string;
}

interface ChapterData {
  id: string;
  title: string;
  description: string;
  estimatedReadingTime: string;
  content: string;
  codeExamples: CodeExample[];
  importantNotes: string;
  courseId: string;
}

interface PageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { courseId, chapterId } = await params;

  try {
    // Get chapter data
    const chapterResult = await db
      .select()
      .from(courseDetails)
      .where(eq(courseDetails.chapterId, chapterId))
      .limit(1);

    if (chapterResult.length === 0) {
      return {
        title: "Chapter Not Found | CourseCrafter AI",
        description: "The requested chapter could not be found.",
      };
    }

    const chapter = chapterResult[0];
    const title = chapter.title || "Untitled Chapter";
    const description =
      chapter.description || "Chapter content and learning materials.";

    // Get course data for context
    const courseResult = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.courseId, courseId))
      .limit(1);

    const courseTitle =
      courseResult.length > 0 ? courseResult[0].title : "Course";

    return {
      title: `${title} - ${courseTitle} | CourseCrafter AI`,
      description: `${description} Part of the ${courseTitle} course.`,
      keywords: [
        "online learning",
        "course chapter",
        "educational content",
        title.toLowerCase(),
        courseTitle.toLowerCase(),
        "tutorial",
        "learning materials",
      ],
      openGraph: {
        title: `${title} - ${courseTitle}`,
        description: `${description} Part of the ${courseTitle} course.`,
        type: "article",
        url: `/course/${courseId}/${chapterId}`,
        images: [
          {
            url: "https://kzmnsmni730q5bqyk3m6.lite.vusercontent.net/placeholder.svg?height=400&width=600",
            width: 600,
            height: 400,
            alt: `${title} chapter preview`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} - ${courseTitle}`,
        description: `${description} Part of the ${courseTitle} course.`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: `/course/${courseId}/${chapterId}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Chapter | CourseCrafter AI",
      description: "Course chapter content and learning materials.",
    };
  }
}

// Server component to fetch data
export default async function ChapterPage({ params }: PageProps) {
  const { courseId, chapterId } = await params;

  try {
    // Get chapter data
    const chapterResult = await db
      .select()
      .from(courseDetails)
      .where(eq(courseDetails.chapterId, chapterId))
      .limit(1);

    if (chapterResult.length === 0) {
      notFound();
    }

    const chapter = chapterResult[0];

    // Parse the data
    const chapterData: ChapterData = {
      id: chapter.id.toString(),
      title: chapter.title,
      description: chapter.description,
      estimatedReadingTime: chapter.estimatedReadingTime,
      content: chapter.content,
      codeExamples: JSON.parse(chapter.codeExamples) as CodeExample[],
      importantNotes: JSON.parse(chapter.importantNotes),
      courseId: chapter.courseId,
    };

    // Get course data for context
    const courseResult = await db
      .select()
      .from(coursesTable)
      .where(eq(coursesTable.courseId, courseId))
      .limit(1);

    const course = courseResult.length > 0 ? courseResult[0] : null;

    return (
      <>
        <ChapterStructuredData chapterData={chapterData} courseData={course} />
        <ChapterViewer chapterData={chapterData} courseData={course} />
      </>
    );
  } catch (error) {
    console.error("Error fetching chapter data:", error);
    notFound();
  }
}

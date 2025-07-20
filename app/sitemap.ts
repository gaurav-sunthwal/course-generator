import { MetadataRoute } from "next";
import { db } from "@/api/utlis/db";
import { coursesTable, courseDetails } from "@/api/utlis/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://coursecrafter.ai";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/create`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/dashboard/explore`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  try {
    // Get all courses
    const courses = await db.select().from(coursesTable);

    const coursePages = courses.map((course) => ({
      url: `${baseUrl}/course/${course.courseId}`,
      lastModified: new Date(course.updatedAt || course.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Get all chapters
    const chapters = await db.select().from(courseDetails);

    const chapterPages = chapters.map((chapter) => ({
      url: `${baseUrl}/course/${chapter.courseId}/${chapter.chapterId}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...coursePages, ...chapterPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}

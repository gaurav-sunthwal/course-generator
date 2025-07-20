import { Metadata } from "next";
import { db } from "@/api/utlis/db";
import { coursesTable } from "@/api/utlis/schema";
import { ExploreClient } from "./_components/ExploreClient";

export const metadata: Metadata = {
  title: "Explore Courses - Course Generator",
  description:
    "Discover and explore courses created by our community. Find the perfect learning content for your needs.",
  keywords: [
    "explore courses",
    "course discovery",
    "learning content",
    "AI courses",
    "course library",
  ],
  openGraph: {
    title: "Explore Courses - Course Generator",
    description: "Discover and explore courses created by our community.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Courses - Course Generator",
    description: "Discover and explore courses created by our community.",
  },
};

interface Course {
  courseId: string;
  title: string;
  createdBy: string;
  description: string;
}

export default async function ExplorePage() {
  let courses: Course[] = [];

  try {
    const result = await db.select().from(coursesTable);
    courses = result.map((course) => ({
      courseId: course.courseId,
      title: course.title,
      createdBy: course.createdBy,
      description: course.description,
    }));
  } catch (error) {
    console.error("Error fetching course details:", error);
  }

  return <ExploreClient initialCourses={courses} />;
}

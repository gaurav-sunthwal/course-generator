import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/api/utlis/db";
import { coursesTable } from "@/api/utlis/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DashboardClient } from "./_components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard - Course Generator",
  description:
    "Manage and create your courses with our AI-powered course generator. View, edit, and organize your learning content.",
  keywords: [
    "dashboard",
    "course management",
    "AI courses",
    "learning platform",
    "course generator",
  ],
  openGraph: {
    title: "Dashboard - Course Generator",
    description:
      "Manage and create your courses with our AI-powered course generator.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard - Course Generator",
    description:
      "Manage and create your courses with our AI-powered course generator.",
  },
};

interface Course {
  courseId: string;
  title: string;
  createdBy: string;
  description: string;
}

interface UserData {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  imageUrl: string;
}

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;

  let courses: Course[] = [];

  if (userEmail) {
    try {
      const result = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.createdBy, userEmail));

      courses = result.map((course) => ({
        courseId: course.courseId,
        title: course.title,
        createdBy: course.createdBy,
        description: course.description,
      }));
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }

  // Create a serializable user object
  const userData: UserData = {
    id: user.id,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: userEmail || null,
    imageUrl: user.imageUrl,
  };

  return <DashboardClient initialCourses={courses} user={userData} />;
}

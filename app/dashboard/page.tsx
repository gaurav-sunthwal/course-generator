import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
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
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/db?createdBy=${encodeURIComponent(userEmail)}`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      courses = (data?.data?.courses?.records || []).map((course: Course) => ({
        courseId: course.courseId,
        title: course.title,
        createdBy: course.createdBy,
        description: course.description,
      }));
    } catch (error) {
      console.error("Error fetching course details from API:", error);
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

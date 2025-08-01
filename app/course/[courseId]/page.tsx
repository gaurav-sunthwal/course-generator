import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

// Helper function to get base URL
function getBaseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
  }
  return 'http://localhost:3000';
}

// Helper function to fetch course data
async function fetchCourseData(courseId: string) {
  try {
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/db?courseId=${encodeURIComponent(courseId)}`;
    
    console.log(`Fetching course data from: ${apiUrl}`);
    
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: "no-store",
      // Add timeout
      signal: AbortSignal.timeout(10000),
    });

    console.log(`API Response status: ${res.status}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
    }

    // Check content type
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await res.text();
      console.log("Non-JSON response received:", textResponse.substring(0, 200));
      throw new Error(`Expected JSON response but got ${contentType}`);
    }

    const data = await res.json();
    console.log("Fetched course data:", data);
    
    return data;
  } catch (error) {
    console.error("Error in fetchCourseData:", error);
    throw error;
  }
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { courseId } = await params;

  try {
    const data = await fetchCourseData(courseId);
    const courseData = data?.data?.courseDetails?.records || [];

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

  console.log(`CoursePage: Processing courseId = ${courseId}`);

  try {
    const data = await fetchCourseData(courseId);
    const courseData = data?.data?.courseDetails?.records || [];

    console.log(`Found ${courseData.length} course records`);

    if (courseData.length === 0) {
      console.log("No course data found, calling notFound()");
      notFound();
    }

    const course = courseData[0];
    console.log("Course data:", course);

    // Check if chapterId exists and is valid
    if (!course.chapterId) {
      console.error("No chapterId found in course data:", course);
      notFound();
    }

    const firstChapterId = course.chapterId;
    const redirectUrl = `/course/${courseId}/${firstChapterId}`;
    
    console.log(`Redirecting to: ${redirectUrl}`);
    
    // The redirect will throw NEXT_REDIRECT error - this is expected behavior
    redirect(redirectUrl);

  } catch (error) {
    // Don't log NEXT_REDIRECT as an error - it's expected
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error; // Re-throw to let Next.js handle it
    }
    
    console.error("Error fetching course data:", error);
    // notFound();
  }
}
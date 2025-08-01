import { Metadata } from "next";
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

// Helper function to get the base URL
function getBaseUrl() {
  // In production, use the environment variable or default
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
  }
  // In development, always use localhost
  return 'http://localhost:3000';
}

export default async function ExplorePage() {
  let courses: Course[] = [];
  let error: string | null = null;

  try {
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/db`;
    
    console.log("Attempting to fetch from:", apiUrl);

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers if needed
      },
      cache: "no-store",
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    console.log("Response status:", res.status);
    console.log("Response headers:", Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
    }

    // Check content type before parsing
    const contentType = res.headers.get('content-type');
    console.log("Response content-type:", contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await res.text();
      console.log("Non-JSON response received:", textResponse.substring(0, 200));
      throw new Error(`Expected JSON response but got ${contentType}. Response: ${textResponse.substring(0, 100)}...`);
    }

    const data = await res.json();
    console.log("Fetched course details from API:", data);

    // More robust data extraction with better error handling
    if (data && data.data && data.data.courses && Array.isArray(data.data.courses.records)) {
      courses = data.data.courses.records.map((course: {
        courseId?: string;
        title?: string;
        createdBy?: string;
        description?: string;
      }) => ({
        courseId: course.courseId || '',
        title: course.title || 'Untitled Course',
        createdBy: course.createdBy || 'Unknown',
        description: course.description || 'No description available',
      }));
    } else if (data && Array.isArray(data)) {
      // Handle case where data is directly an array
      courses = data.map((course: {
        courseId?: string;
        title?: string;
        createdBy?: string;
        description?: string;
        id?: string;
        author?: string;
      }) => ({
        courseId: course.courseId || course.id || '',
        title: course.title || 'Untitled Course',
        createdBy: course.createdBy || course.author || 'Unknown',
        description: course.description || 'No description available',
      }));
    } else {
      console.warn("Unexpected data structure:", data);
      error = "Unexpected data structure received from API";
    }

    console.log("Processed courses:", courses);

  } catch (fetchError) {
    const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
    console.error("Error fetching course details from API:", errorMessage);
    error = errorMessage;
    
    // You might want to show a fallback or retry mechanism
    courses = [];
  }

  // Pass both courses and error state to client component
  return <ExploreClient initialCourses={courses} error={error} />;
}
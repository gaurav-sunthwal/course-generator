import { NextResponse } from "next/server";
import { db } from "../utlis/db";
import { coursesTable, courseDetails } from "../utlis/schema";
import { eq, like, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get filter parameters
    const courseId = searchParams.get("courseId");
    const category = searchParams.get("category");
    const createdBy = searchParams.get("createdBy");
    const chapterId = searchParams.get("chapterId");
    const title = searchParams.get("title");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined;

    // Build filters for courses
    const courseFilters = [];
    if (courseId) courseFilters.push(eq(coursesTable.courseId, courseId));
    if (category) courseFilters.push(eq(coursesTable.category, category));
    if (createdBy) courseFilters.push(eq(coursesTable.createdBy, createdBy));
    if (title) courseFilters.push(like(coursesTable.title, `%${title}%`));

    // Build filters for course details
    const detailFilters = [];
    if (courseId) detailFilters.push(eq(courseDetails.courseId, courseId));
    if (chapterId) detailFilters.push(eq(courseDetails.chapterId, chapterId));
    if (title) detailFilters.push(like(courseDetails.title, `%${title}%`));

    // Fetch filtered courses
    const allCourses =
      courseFilters.length > 0
        ? await db
            .select()
            .from(coursesTable)
            .where(and(...courseFilters))
        : await db.select().from(coursesTable);

    // Fetch filtered course details
    const allCourseDetails =
      detailFilters.length > 0
        ? await db
            .select()
            .from(courseDetails)
            .where(and(...detailFilters))
        : await db.select().from(courseDetails);

    return new NextResponse(
      JSON.stringify({
        status: "Success",
        message: "Filtered database data retrieved successfully",
        filters: {
          courseId,
          category,
          createdBy,
          chapterId,
          title,
          limit,
          offset,
        },
        data: {
          courses: {
            count: allCourses.length,
            records: allCourses,
          },
          courseDetails: {
            count: allCourseDetails.length,
            records: allCourseDetails,
          },
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new NextResponse(
      JSON.stringify({
        status: "Error",
        message: "Failed to fetch database data",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/api/utlis/db";
import { courseDetails, coursesTable } from "@/api/utlis/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = params;
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Verify the course belongs to the user
    const course = await db
      .select()
      .from(coursesTable)
      .where(
        and(
          eq(coursesTable.courseId, courseId),
          eq(coursesTable.createdBy, userEmail)
        )
      );

    if (!course || course.length === 0) {
      return NextResponse.json(
        { error: "Course not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete course details first (foreign key constraint)
    await db.delete(courseDetails).where(eq(courseDetails.chapterId, courseId));

    // Delete the course
    await db.delete(coursesTable).where(eq(coursesTable.courseId, courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

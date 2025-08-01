import { NextResponse } from "next/server";
import { db } from "../utlis/db";
import { coursesTable, courseDetails } from "../utlis/schema";
import { eq, like, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

// Helper function to safely get query parameter
function getQueryParam(searchParams, key) {
  return searchParams.get(key);
}

// Helper function to safely parse integer query parameter
function getIntQueryParam(searchParams, key) {
  const value = searchParams.get(key);
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

// GET Operation - Fetch data with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const courseId = getQueryParam(searchParams, "courseId");
    const category = getQueryParam(searchParams, "category");
    const createdBy = getQueryParam(searchParams, "createdBy");
    const chapterId = getQueryParam(searchParams, "chapterId");
    const title = getQueryParam(searchParams, "title");
    const limit = getIntQueryParam(searchParams, "limit");
    const offset = getIntQueryParam(searchParams, "offset");

    const courseFilters = [];
    if (courseId) courseFilters.push(eq(coursesTable.courseId, courseId));
    if (category) courseFilters.push(eq(coursesTable.category, category));
    if (createdBy) courseFilters.push(eq(coursesTable.createdBy, createdBy));
    if (title) courseFilters.push(like(coursesTable.title, `%${title}%`));

    const detailFilters = [];
    if (courseId) detailFilters.push(eq(courseDetails.courseId, courseId));
    if (chapterId) detailFilters.push(eq(courseDetails.chapterId, chapterId));
    if (title) detailFilters.push(like(courseDetails.title, `%${title}%`));

    // Build courses query conditionally
    let coursesQueryBuilder = db.select().from(coursesTable);
    
    if (courseFilters.length > 0) {
      coursesQueryBuilder = coursesQueryBuilder.where(and(...courseFilters));
    }
    if (limit !== undefined) {
      coursesQueryBuilder = coursesQueryBuilder.limit(limit);
    }
    if (offset !== undefined) {
      coursesQueryBuilder = coursesQueryBuilder.offset(offset);
    }
    
    const allCourses = await coursesQueryBuilder;

    // Build course details query conditionally
    let detailsQueryBuilder = db.select().from(courseDetails);
    
    if (detailFilters.length > 0) {
      detailsQueryBuilder = detailsQueryBuilder.where(and(...detailFilters));
    }
    if (limit !== undefined) {
      detailsQueryBuilder = detailsQueryBuilder.limit(limit);
    }
    if (offset !== undefined) {
      detailsQueryBuilder = detailsQueryBuilder.offset(offset);
    }
    
    const allCourseDetails = await detailsQueryBuilder;

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Database GET error:", error);
    return NextResponse.json(
      {
        status: "Error",
        message: "Failed to fetch database data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST Operation - Create new courses or course details
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        {
          status: "Error",
          message: "Missing required fields: type and data",
        },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "course": {
        const courseData = data;
        const { title, description, category, createdBy, chapters } = courseData;

        if (!title || !description || !category || !createdBy) {
          return NextResponse.json(
            {
              status: "Error",
              message: "Missing required course fields: title, description, category, createdBy",
            },
            { status: 400 }
          );
        }

        // Generate shorter courseId if needed
        const generatedCourseId = courseData.courseId || uuidv4().substring(0, 36);
        
        result = await db
          .insert(coursesTable)
          .values({
            courseId: generatedCourseId,
            title: title.substring(0, 255), // Limit title length
            description: description.substring(0, 1000), // Limit description length
            category: category.substring(0, 100), // Limit category length
            createdBy: createdBy.substring(0, 255), // Limit createdBy length
            chapters: chapters || "[]",
            createdAt: moment().format("DD-MM-YYYY"),
            updatedAt: moment().format("DD-MM-YYYY"),
          })
          .returning();

        return NextResponse.json({
          status: "Success",
          message: "Course created successfully",
          data: result[0],
        });
      }

      case "courseDetail": {
        const detailData = data;
        const { courseId, chapterId } = detailData;

        if (!courseId || !chapterId) {
          return NextResponse.json(
            {
              status: "Error",
              message: "Missing required course detail fields: courseId, chapterId",
            },
            { status: 400 }
          );
        }

        result = await db
          .insert(courseDetails)
          .values({
            id: detailData.id || uuidv4().substring(0, 36),
            courseId: detailData.courseId,
            chapterId: detailData.chapterId,
            title: (detailData.title || "").substring(0, 255),
            description: (detailData.description || "").substring(0, 1000),
            estimatedReadingTime: (detailData.estimatedReadingTime || "").substring(0, 50),
            content: detailData.content || "",
            codeExamples: detailData.codeExamples || "",
            importantNotes: detailData.importantNotes || "",
            createdAt: moment().format("DD-MM-YYYY"),
            updatedAt: moment().format("DD-MM-YYYY"),
          })
          .returning();

        return NextResponse.json({
          status: "Success",
          message: "Course detail created successfully",
          data: result[0],
        });
      }

      case "bulk": {
        const bulkData = data;
        const { courses, courseDetails: details } = bulkData;
        const results = {};

        if (courses && Array.isArray(courses)) {
          const courseResults = await Promise.all(
            courses.map(async (course) => {
              const insertResult = await db
                .insert(coursesTable)
                .values({
                  courseId: course.courseId || uuidv4().substring(0, 36),
                  title: course.title.substring(0, 255),
                  description: course.description.substring(0, 1000),
                  category: course.category.substring(0, 100),
                  createdBy: course.createdBy.substring(0, 255),
                  chapters: course.chapters ?? "[]",
                  createdAt: moment().format("DD-MM-YYYY"),
                  updatedAt: moment().format("DD-MM-YYYY"),
                })
                .returning();
              return insertResult[0];
            })
          );
          results.courses = courseResults;
        }

        if (details && Array.isArray(details)) {
          const detailResults = await Promise.all(
            details.map(async (detail) => {
              const insertResult = await db
                .insert(courseDetails)
                .values({
                  id: detail.id || uuidv4().substring(0, 36),
                  courseId: detail.courseId,
                  chapterId: detail.chapterId,
                  title: (detail.title || "").substring(0, 255),
                  description: (detail.description || "").substring(0, 1000),
                  estimatedReadingTime: (detail.estimatedReadingTime || "").substring(0, 50),
                  content: detail.content || "",
                  codeExamples: detail.codeExamples || "",
                  importantNotes: detail.importantNotes || "",
                  createdAt: moment().format("DD-MM-YYYY"),
                  updatedAt: moment().format("DD-MM-YYYY"),
                })
                .returning();
              return insertResult[0];
            })
          );
          results.courseDetails = detailResults;
        }

        return NextResponse.json({
          status: "Success",
          message: "Bulk operation completed successfully",
          data: results,
        });
      }

      default:
        return NextResponse.json(
          {
            status: "Error",
            message: "Invalid type. Use 'course', 'courseDetail', or 'bulk'",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Database POST error:", error);
    return NextResponse.json(
      {
        status: "Error",
        message: "Failed to create database record",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT Operation - Update existing records
export async function PUT(request) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    if (!type || !id || !data) {
      return NextResponse.json(
        {
          status: "Error",
          message: "Missing required fields: type, id, and data",
        },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "course":
        result = await db
          .update(coursesTable)
          .set({
            ...data,
            updatedAt: moment().format("DD-MM-YYYY"),
          })
          .where(eq(coursesTable.courseId, id))
          .returning();

        if (result.length === 0) {
          return NextResponse.json(
            {
              status: "Error",
              message: "Course not found",
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          status: "Success",
          message: "Course updated successfully",
          data: result[0],
        });

      case "courseDetail":
        result = await db
          .update(courseDetails)
          .set({
            ...data,
            updatedAt: moment().format("DD-MM-YYYY"),
          })
          .where(eq(courseDetails.id, id))
          .returning();

        if (result.length === 0) {
          return NextResponse.json(
            {
              status: "Error",
              message: "Course detail not found",
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          status: "Success",
          message: "Course detail updated successfully",
          data: result[0],
        });

      default:
        return NextResponse.json(
          {
            status: "Error",
            message: "Invalid type. Use 'course' or 'courseDetail'",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Database PUT error:", error);
    return NextResponse.json(
      {
        status: "Error",
        message: "Failed to update database record",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE Operation - Delete records
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = getQueryParam(searchParams, "type");
    const id = getQueryParam(searchParams, "id");

    if (!type || !id) {
      return NextResponse.json(
        {
          status: "Error",
          message: "Missing required parameters: type and id",
        },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "course":
        result = await db
          .delete(coursesTable)
          .where(eq(coursesTable.courseId, id))
          .returning();

        if (result.length === 0) {
          return NextResponse.json(
            {
              status: "Error",
              message: "Course not found",
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          status: "Success",
          message: "Course deleted successfully",
          data: result[0],
        });

      case "courseDetail":
        result = await db
          .delete(courseDetails)
          .where(eq(courseDetails.id, id))
          .returning();

        if (result.length === 0) {
          return NextResponse.json(
            {
              status: "Error",
              message: "Course detail not found",
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          status: "Success",
          message: "Course detail deleted successfully",
          data: result[0],
        });

      default:
        return NextResponse.json(
          {
            status: "Error",
            message: "Invalid type. Use 'course' or 'courseDetail'",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Database DELETE error:", error);
    return NextResponse.json(
      {
        status: "Error",
        message: "Failed to delete database record",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
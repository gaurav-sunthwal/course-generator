// lib/dbClient.ts
// Client-side utility for interacting with the database API

interface ApiResponse<T = unknown> {
  status: string;
  message: string;
  data?: T;
  error?: string;
  filters?: unknown;
}

interface CourseData {
  courseId?: string;
  title: string;
  description: string;
  category: string;
  chapters?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CourseDetailData {
  id?: string;
  courseId: string;
  chapterId: string;
  title?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FetchParams {
  courseId?: string;
  category?: string;
  createdBy?: string;
  chapterId?: string;
  title?: string;
  limit?: number;
  offset?: number;
}

class DatabaseClient {
  private baseUrl = '/api/db';

  // GET Operations
  async fetchData(params: FetchParams = {}): Promise<ApiResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const url = `${this.baseUrl}?${searchParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCourse(courseId: string): Promise<ApiResponse> {
    return this.fetchData({ courseId });
  }

  async getCoursesByCategory(category: string): Promise<ApiResponse> {
    return this.fetchData({ category });
  }

  async getCoursesByUser(createdBy: string): Promise<ApiResponse> {
    return this.fetchData({ createdBy });
  }

  async searchCourses(title: string): Promise<ApiResponse> {
    return this.fetchData({ title });
  }

  async getCourseDetails(courseId: string, chapterId?: string): Promise<ApiResponse> {
    return this.fetchData({ courseId, chapterId });
  }

  // POST Operations
  async createCourse(courseData: CourseData): Promise<ApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'course',
          data: courseData,
        }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createCourseDetail(detailData: CourseDetailData): Promise<ApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'courseDetail',
          data: detailData,
        }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create course detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async bulkCreate(data: { courses?: CourseData[]; courseDetails?: CourseDetailData[] }): Promise<ApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'bulk',
          data,
        }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to bulk create: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // PUT Operations
  async updateCourse(courseId: string, updateData: Partial<CourseData>): Promise<ApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'course',
          id: courseId,
          data: updateData,
        }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateCourseDetail(detailId: string, updateData: Partial<CourseDetailData>): Promise<ApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'courseDetail',
          id: detailId,
          data: updateData,
        }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update course detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // DELETE Operations
  async deleteCourse(courseId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?type=course&id=${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to delete course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteCourseDetail(detailId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}?type=courseDetail&id=${detailId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to delete course detail: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const dbClient = new DatabaseClient();

// Export types for use in other files
export type { ApiResponse, CourseData, CourseDetailData, FetchParams };
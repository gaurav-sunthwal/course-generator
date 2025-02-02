"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Delete, Edit, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utlis/db";
import { coursesTable } from "@/utlis/schema";
import { eq } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Course {
  courseId: string;
  title: string;
  createdBy: string;
  description: string;
}

export default function Page() {
  const { user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const userId = user?.emailAddresses[0]?.emailAddress;

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const result = userId
        ? await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.createdBy, userId))
        : [];

      setCourses(result || []);
      setFilteredCourses(result || []);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await db.delete(coursesTable).where(eq(coursesTable.courseId, courseId));
        await fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };


  return (
    <div className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Welcome, {user?.fullName}
        </h1>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
          <Input
            className="w-full md:w-64"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Link href="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.courseId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <h2 className="text-xl font-semibold mb-2">
                  {course.title || "Untitled Course"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Created by: {course.createdBy}
                </p>
                <p className="text-base flex-grow">
                  {course.description || "No description available."}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link href={`/create/${course.courseId}/Outline`}>
                    <Button variant="outline" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDelete(course.courseId)}
                  >
                    <Delete className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  <Link
                    href={`/create/${course.courseId}/Outline`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" /> View
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-600">
          {searchQuery ? "No matching courses found." : "No courses found."}
        </p>
      )}
    </div>
  );
}

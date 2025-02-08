"use client";

import { db } from "@/api/utlis/db";
import { coursesTable } from "@/api/utlis/schema";
import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Course {
  courseId: string;
  title: string;
  createdBy: string;
  description: string;
}

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const result = (await db.select().from(coursesTable)) || [];
      setCourses(result);
      setFilteredCourses(result); // Set initial filtered courses to all courses
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    // Filter courses based on search query
    if (searchQuery) {
      setFilteredCourses(
        courses.filter((course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  return (
    <div className="p-4">
      <div className="flex justify-center mb-6 items-center">
        <input
          type="text"
          placeholder="Search for courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 lg:w-1/2 sm:w-full rounded-lg"
        />
        <Button className="h-[40px] ml-3 items-center" variant={"ghost"}>
          <Search />
        </Button>
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
                  <Link href={`/course/${course.courseId}/`} className="flex-1">
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

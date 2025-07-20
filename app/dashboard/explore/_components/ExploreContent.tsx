"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SearchCoursesExplore } from "./SearchCoursesExplore";
import { Course } from "../../types";

interface ExploreContentProps {
  initialCourses: Course[];
}

export function ExploreContent({ initialCourses }: ExploreContentProps) {
  const [filteredCourses, setFilteredCourses] =
    useState<Course[]>(initialCourses);

  const handleSearchChange = (query: string) => {
    const filtered = initialCourses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <div className="p-4">
      <div className="flex justify-center mb-6 items-center">
        <SearchCoursesExplore onSearchChange={handleSearchChange} />
        <Button className="h-[40px] ml-3 items-center" variant={"ghost"}>
          <Search />
        </Button>
      </div>

      {filteredCourses.length > 0 ? (
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
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">
              No courses available
            </h2>
            <p className="text-gray-600 mb-6">
              Be the first to create a course and share it with the community.
            </p>
            <Link href="/create">
              <Button size="lg">Create Your First Course</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

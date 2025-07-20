"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Delete, Edit, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

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

interface DashboardClientProps {
  initialCourses: Course[];
  user: UserData;
}

export function DashboardClient({
  initialCourses,
  user,
}: DashboardClientProps) {
  const [filteredCourses, setFilteredCourses] =
    useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = initialCourses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/delete`, {
        method: "POST",
      });

      if (response.ok) {
        // Refresh the page to update the course list
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error deleting course: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course. Please try again.");
    }
  };

  return (
    <div className="w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Welcome, {user.fullName || "User"}
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
                  <Link
                    href={`/create/${course.courseId}/Outline`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
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
            <h2 className="text-2xl font-semibold mb-4">No courses yet</h2>
            <p className="text-gray-600 mb-6">
              Start creating your first course to get started with your learning
              journey.
            </p>
            <Link href="/create">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Course
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

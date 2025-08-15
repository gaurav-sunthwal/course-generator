"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Delete, Edit, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import ApiKeyModal from "./API_KeyModal";

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
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const router = useRouter();

  // Check for existing API key and show modal if needed
  useEffect(() => {
    const existingApiKey = localStorage.getItem("apiKey");
    
    if (existingApiKey) {
      setApiKey(existingApiKey);
      console.log("API key found in localStorage");
      return;
    }

    // Check if the modal has already been shown in this session
    const hasModalBeenShown = sessionStorage.getItem("apiKeyModalShown");

    if (!hasModalBeenShown) {
      // Set a timer to show the modal after 3 seconds
      const timer = setTimeout(() => {
        setShowModal(true);
        // Mark that the modal has been shown in this session
        localStorage.setItem("apiKeyModalShown", "true");
      }, 1000);

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = initialCourses.filter((course) =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleDelete = async (courseId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(courseId);

    try {
      // Fixed: Use DELETE method with proper query parameters
      const response = await fetch(`/api/db?type=course&id=${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Add API key to headers if available
          ...(apiKey && { "Authorization": `Bearer ${apiKey}` }),
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update the local state immediately for better UX
        const updatedCourses = initialCourses.filter(
          (course) => course.courseId !== courseId
        );
        setFilteredCourses(
          updatedCourses.filter((course) =>
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );

        alert("Course deleted successfully!");

        // Also refresh the page to ensure data consistency
        router.refresh();
      } else {
        alert(
          `Error deleting course: ${
            data.message || data.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(
        "Error deleting course. Please check your connection and try again."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitApiKey = (submittedApiKey: string) => {
    try {
      // Store API key in localStorage
      localStorage.setItem("apiKey", submittedApiKey);
      setApiKey(submittedApiKey);
      
      console.log("API key saved successfully");
      
      // Optional: You can also send to your backend
      // fetch('/api/save-api-key', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ apiKey: submittedApiKey })
      // });
      
      setShowModal(false);
    } catch (error) {
      console.error("Error saving API key:", error);
      alert("Failed to save API key. Please try again.");
    }
  };

  // Function to clear API key (for testing/logout)
  const clearApiKey = () => {
    localStorage.removeItem("apiKey");
    sessionStorage.removeItem("apiKeyModalShown");
    setApiKey("");
    setShowModal(true);
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
          {/* Debug button to clear API key - remove in production */}
          {apiKey && (
            <Button variant="outline" onClick={clearApiKey} size="sm">
              Clear API Key
            </Button>
          )}
        </div>
      </div>

      {/* API Key Status Indicator */}
      {apiKey && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ API Key configured (ends with: ***{apiKey.slice(-4)})
          </p>
        </div>
      )}

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
                    disabled={isDeleting === course.courseId}
                  >
                    {isDeleting === course.courseId ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Delete className="mr-2 h-4 w-4" /> Delete
                      </>
                    )}
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

      {/* API Key Modal - moved outside conditional render */}
      <ApiKeyModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitApiKey}
      />
    </div>
  );
}
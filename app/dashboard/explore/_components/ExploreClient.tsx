"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Course {
  courseId: string;
  title: string;
  createdBy: string;
  description: string;
}

interface ExploreClientProps {
  initialCourses: Course[];
  error?: string | null;
}

const ITEMS_PER_PAGE = 9;

export function ExploreClient({ initialCourses, error }: ExploreClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return initialCourses;
    
    return initialCourses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialCourses, searchQuery]);

  // Get courses for current page
  const displayedCourses = useMemo(() => {
    return filteredCourses.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredCourses, currentPage]);

  // Check if there are more courses to load
  const hasMoreCourses = displayedCourses.length < filteredCourses.length;
  const totalCourses = filteredCourses.length;
  const remainingCourses = totalCourses - displayedCourses.length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    
    // Simulate loading delay (remove this in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentPage(prev => prev + 1);
    setIsLoadingMore(false);
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">
              Error Loading Courses
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search Section */}
      <div className="flex justify-center mb-6 items-center">
        <div className="relative lg:w-1/2 sm:w-full">
          <input
            type="text"
            placeholder="Search courses by title, description, or creator..."
            value={searchQuery}
            onChange={handleSearch}
            className="border p-2 w-full rounded-lg pr-10"
          />
          {searchQuery && (
            <button
              onClick={handleReset}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <Button className="h-[40px] ml-3 items-center" variant={"ghost"}>
          <Search />
        </Button>
      </div>

      {/* Results Info */}
      {searchQuery && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            {totalCourses === 0 
              ? `No courses found for "${searchQuery}"`
              : `Found ${totalCourses} course${totalCourses !== 1 ? 's' : ''} for "${searchQuery}"`
            }
          </p>
        </div>
      )}

      {displayedCourses.length > 0 ? (
        <>
          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course, index) => (
              <motion.div
                key={course.courseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index % ITEMS_PER_PAGE) * 0.05 }}
              >
                <Card className="rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {course.title || "Untitled Course"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Created by: <span className="font-medium">{course.createdBy}</span>
                  </p>
                  <p className="text-base flex-grow line-clamp-3">
                    {course.description || "No description available."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Link href={`/course/${course.courseId}/`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" /> View Course
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More Section */}
          {hasMoreCourses && (
            <div className="text-center mt-8">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {displayedCourses.length} of {totalCourses} courses
                  {remainingCourses > 0 && (
                    <span className="ml-1">
                      ({remainingCourses} more available)
                    </span>
                  )}
                </p>
              </div>
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                size="lg"
                variant="outline"
                className="min-w-[150px]"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load More (${Math.min(remainingCourses, ITEMS_PER_PAGE)})`
                )}
              </Button>
            </div>
          )}

          {/* End of Results */}
          {!hasMoreCourses && displayedCourses.length > ITEMS_PER_PAGE && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                {`You've reached the end! Showing all ${displayedCourses.length} courses.`}
              </p>
            </div>
          )}
        </>
      ) : (
        /* No Courses State */
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            {searchQuery ? (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  No courses found
                </h2>
                <p className="text-gray-600 mb-6">
                  No courses match your search {searchQuery}. Try different keywords or browse all courses.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleReset} variant="outline">
                    Clear Search
                  </Button>
                  <Link href="/create">
                    <Button>Create Course</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  No courses available
                </h2>
                <p className="text-gray-600 mb-6">
                  Be the first to create a course and share it with the community.
                </p>
                <Link href="/create">
                  <Button size="lg">Create Your First Course</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
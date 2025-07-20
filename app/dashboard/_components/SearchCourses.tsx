"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface SearchCoursesProps {
  initialCourses: any[];
  onSearchChange: (query: string) => void;
}

export function SearchCourses({
  initialCourses,
  onSearchChange,
}: SearchCoursesProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    onSearchChange(searchQuery);
  }, [searchQuery, onSearchChange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Input
      className="w-full md:w-64"
      placeholder="Search courses..."
      value={searchQuery}
      onChange={handleSearch}
    />
  );
}

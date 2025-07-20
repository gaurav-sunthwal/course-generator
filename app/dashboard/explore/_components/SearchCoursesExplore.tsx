"use client";

import { useState, useEffect } from "react";

interface SearchCoursesExploreProps {
  onSearchChange: (query: string) => void;
}

export function SearchCoursesExplore({
  onSearchChange,
}: SearchCoursesExploreProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    onSearchChange(searchQuery);
  }, [searchQuery, onSearchChange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search for courses..."
      value={searchQuery}
      onChange={handleSearch}
      className="border p-2 lg:w-1/2 sm:w-full rounded-lg"
    />
  );
}

"use client";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const { courseId: rawCourseId } = useParams();
  return (
    <div>
      <h1>{rawCourseId}</h1>
    </div>
  );
}

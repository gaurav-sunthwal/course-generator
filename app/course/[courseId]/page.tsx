"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Sample course data (replace with your actual data)
const courseData = [
  {
    id: "chapter-1",
    title: "Chapter 1: Introduction",
    content: "This is the content for Chapter 1...",
  },
  {
    id: "chapter-2",
    title: "Chapter 2: Getting Started",
    content: "This is the content for Chapter 2...",
  },
  {
    id: "chapter-3",
    title: "Chapter 3: Advanced Topics",
    content: "This is the content for Chapter 3...",
  },
  {
    id: "chapter-4",
    title: "Chapter 4: Advanced Topics",
    content: "This is the content for Chapter 4...",
  },
]

export default function Page() {
  const { courseId: rawCourseId } = useParams()
  const [currentChapter, setCurrentChapter] = useState<string | null>(null)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      setCurrentChapter(hash)
    }

    handleHashChange() // Set initial chapter based on URL hash
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  const selectedChapter = courseData.find((chapter) => chapter.id === currentChapter)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course: {rawCourseId}</h1>
      {selectedChapter ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">{selectedChapter.title}</h2>
          <p>{selectedChapter.content}</p>
        </div>
      ) : (
        <p>Please select a chapter from the sidebar.</p>
      )}
    </div>
  )
}


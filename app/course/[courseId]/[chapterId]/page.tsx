'use client';

import { eq } from "drizzle-orm";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BookOpen, Clock, Code,  Lightbulb } from 'lucide-react';
import { db } from "@/utlis/db";
import { courseDetails } from "@/utlis/schema";

export default function ChapterPage() {
  const { chapterId } = useParams()
  const [chapterData, setChapterData] = useState<{
    id: string
    title: string
    description: string
    estimatedReadingTime: string
    content: string
    codeExamples: string
    importantNotes: string
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await db
        .select()
        .from(courseDetails)
        .where(eq(courseDetails.chapterId, chapterId as string))
        .limit(1)
      if (data.length > 0) {
        setChapterData({
          ...data[0],
          id: data[0].id.toString(),
        })
      }
    }
    fetchData()
  }, [chapterId])

  if (!chapterData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{chapterData.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{chapterData.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          <span>Estimated reading time: {chapterData.estimatedReadingTime}</span>
        </div>
      </header>

      <main className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            Chapter Content
          </h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: chapterData.content }} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Code className="mr-2 h-6 w-6" />
            Code Examples
          </h2>
          <pre className=" p-4 rounded-lg overflow-x-auto">
            <code>{chapterData.codeExamples}</code>
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Lightbulb className="mr-2 h-6 w-6" />
            Important Notes
          </h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: chapterData.importantNotes }} />
        </section>
      </main>
    </div>
  )
}


"use client";

import { eq } from "drizzle-orm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, BookOpen, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/utlis/db";
import { courseDetails } from "@/utlis/schema";

interface ChapterData {
  id: string;
  title: string;
  description: string;
  estimatedReadingTime: string;
  content: string;
  codeExamples: { code: string }[];
  importantNotes: string;
}

export default function ChapterPage() {
  const { chapterId } = useParams();
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await db
        .select()
        .from(courseDetails)
        .where(eq(courseDetails.chapterId, chapterId as string))
        .limit(1);
      if (data.length > 0) {
        setChapterData({
          ...data[0],
          id: data[0].id.toString(),
          codeExamples: JSON.parse(data[0].codeExamples),
          importantNotes: JSON.parse(data[0].importantNotes),
        });
      }
    };
    fetchData();
  }, [chapterId]);

  if (!chapterData) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <motion.div
        className="max-w-4xl mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header className="mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold mb-2">{chapterData.title}</h1>
          <p className="text-xl text-gray-600 mb-4">
            {chapterData.description}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            <span>
              Estimated reading time: {chapterData.estimatedReadingTime}
            </span>
          </div>
        </motion.header>

        <motion.main className="space-y-12" variants={containerVariants}>
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Chapter Content
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: chapterData.content }}
            />
          </motion.section>
          {chapterData.codeExamples.map((example, index) => (
  <motion.div
    key={`${example.code}-${index}`}
    className="mb-6"
    variants={itemVariants}
  >
    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-black">
      <code>{example.code.split("\n").map((line, i) => (
        <div key={i}>
          {line}
          <br />
        </div>
      ))}</code>
    </pre>
  </motion.div>
))}


          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Lightbulb className="mr-2 h-6 w-6" />
              Important Notes
            </h2>
            <motion.div
              className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-black"
              variants={itemVariants}
            >
              <p>{chapterData.importantNotes}</p>
            </motion.div>
          </motion.section>
        </motion.main>
      </motion.div>
    </>
  );
}

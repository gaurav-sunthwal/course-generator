"use client";

import { Clock, BookOpen, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/app/_components/Footer";

interface CodeExample {
  language: string;
  code: string;
}

interface ChapterData {
  id: string;
  title: string;
  description: string;
  estimatedReadingTime: string;
  content: string;
  codeExamples: CodeExample[];
  importantNotes: string;
  courseId: string;
}

interface CourseData {
  courseId: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
}

interface ChapterViewerProps {
  chapterData: ChapterData;
  courseData: CourseData | null;
}

export default function ChapterViewer({
  chapterData,
  courseData,
}: ChapterViewerProps) {
  // Animation configurations
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
    <motion.div
      className="max-w-4xl mx-auto px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Chapter Header Section */}
      <motion.header className="mb-8" variants={itemVariants}>
        <h1 className="text-4xl font-bold mb-2">{chapterData.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{chapterData.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          <span>
            Estimated reading time: {chapterData.estimatedReadingTime}
          </span>
        </div>
        {courseData && (
          <div className="mt-2 text-sm text-gray-500">
            Course: {courseData.title}
          </div>
        )}
      </motion.header>

      <motion.main className="space-y-12" variants={containerVariants}>
        {/* Main Content Section */}
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

        {/* Code Examples Section */}
        {chapterData.codeExamples?.length > 0 ? (
          <motion.section variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <BookOpen className="mr-2 h-6 w-6" />
              Code Examples
            </h2>

            {chapterData.codeExamples.map((example, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-gray-100 rounded-lg text-black"
              >
                {/* Show loading skeleton while code is being parsed */}
                {!example.code ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ) : (
                  <>
                    {/* Code Block with Fallback */}
                    <pre className="whitespace-pre-wrap">
                      <code
                        className={`language-${
                          example.language || "plaintext"
                        }`}
                      >
                        {example.code || "// Code example not available"}
                      </code>
                    </pre>

                    {/* Language Indicator with Fallback */}
                    <div className="mt-2 text-sm text-gray-500">
                      Language: {example.language || "Not specified"}
                    </div>
                  </>
                )}
              </div>
            ))}
          </motion.section>
        ) : null}

        {/* Important Notes Section */}
        <motion.section variants={itemVariants}>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Lightbulb className="mr-2 h-6 w-6" />
            Important Notes
          </h2>
          <motion.div
            className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-black"
            variants={itemVariants}
          >
            {chapterData.importantNotes}
          </motion.div>
        </motion.section>
      </motion.main>

      <div className="fixed bottom-3">
        <Footer />
      </div>
    </motion.div>
  );
}

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

interface ChapterStructuredDataProps {
  chapterData: ChapterData;
  courseData: CourseData | null;
}

export default function ChapterStructuredData({
  chapterData,
  courseData,
}: ChapterStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: chapterData.title,
    description: chapterData.description,
    articleBody: chapterData.content,
    url: `/course/${chapterData.courseId}/${chapterData.id}`,
    author: {
      "@type": "Organization",
      name: courseData?.createdBy || "CourseCrafter AI",
    },
    publisher: {
      "@type": "Organization",
      name: "CourseCrafter AI",
      url: "https://coursecrafter.ai",
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/course/${chapterData.courseId}/${chapterData.id}`,
    },
    isPartOf: courseData
      ? {
          "@type": "Course",
          name: courseData.title,
          description: courseData.description,
          url: `/course/${courseData.courseId}`,
          provider: {
            "@type": "Organization",
            name: "CourseCrafter AI",
            url: "https://coursecrafter.ai",
          },
        }
      : undefined,
    timeRequired: chapterData.estimatedReadingTime,
    educationalLevel: "beginner",
    inLanguage: "en-US",
    keywords: [
      chapterData.title.toLowerCase(),
      courseData?.title.toLowerCase() || "course",
      courseData?.category.toLowerCase() || "education",
      "online learning",
      "tutorial",
      "educational content",
    ],
    about: [
      {
        "@type": "Thing",
        name: courseData?.category || "Education",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

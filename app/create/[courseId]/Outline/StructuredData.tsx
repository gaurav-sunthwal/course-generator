interface StructuredDataProps {
  title: string;
  description: string;
  courseId: string;
  category?: string;
  createdBy?: string;
}

export default function StructuredData({
  title,
  description,
  courseId,
  category,
  createdBy,
}: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description: description,
    url: `/create/${courseId}/Outline`,
    provider: {
      "@type": "Organization",
      name: "CourseCrafter AI",
      url: "https://coursecrafter.ai",
    },
    courseMode: "online",
    educationalLevel: "beginner",
    inLanguage: "en-US",
    isAccessibleForFree: false,
    teaches: description,
    about: category || "Education",
    author: createdBy || "CourseCrafter AI",
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Wand2, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/app/api/utlis/db";
import { courseDetails, coursesTable } from "@/app/api/utlis/schema";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { chatSession } from "@/app/api/utlis/gamini";

interface Chapter {
  id: string;
  title: string;
  description: string;
  chapterTitle: string;
  chapterDescription: string;
}

interface OutlineEditorProps {
  courseId: string;
  initialTitle: string;
  initialDescription: string;
  initialChapters: Chapter[];
}

export default function OutlineEditor({
  courseId,
  initialTitle,
  initialDescription,
  initialChapters,
}: OutlineEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const updateTitleDescription = async () => {
    try {
      await db
        .update(coursesTable)
        .set({ title, description })
        .where(eq(coursesTable.courseId, courseId));
      setIsEditing(false);
      toast.success("Title and description updated successfully");
    } catch (error) {
      console.error("Error updating title/description:", error);
      toast.error("Failed to update title and description");
    }
  };

  const updateChapters = async (updatedChapters: Chapter[]) => {
    try {
      await db
        .update(coursesTable)
        .set({ chapters: JSON.stringify({ chapters: updatedChapters }) })
        .where(eq(coursesTable.courseId, courseId));
    } catch (error) {
      console.error("Error updating chapters:", error);
      toast.error("Failed to update chapters");
    }
  };

  const handleChapterChange = async (index: number, newDescription: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      description: newDescription,
    };
    setChapters(updatedChapters);
    await updateChapters(updatedChapters);
  };

  const simulateAISuggestion = async () => {
    try {
      const props = `
       Act as an expert SEO copywriter and course marketer. Your task is to analyze the provided course title and description and rewrite them to be more effective.

The new title should be short and compelling. The new description should be concise (10-30 words) and focus on student benefits and outcomes.

---

**USER'S CURRENT VERSION:**
* **Title:** "${title}"
* **Description:** "${description}"

**ESSENTIAL CONTEXT:**
* **Main Course Topic:** [e.g., "Python Programming", "Facebook Ads", "Watercolor Painting"]
* **Target Audience:** [e.g., "Absolute Beginners", "Marketing Professionals", "Hobbyists"]

---

**INSTRUCTIONS:**
Based on the context, provide the single best rewritten version in the following JSON format. Do not provide alternatives or explanations.

{
  "title": "...",
  "description": "..."
}
      `;
      const result = await chatSession.sendMessage(props);
      const mockJSONResp = JSON.parse(
        result.response.text().replace("```json", "").replace("```", "")
      );
      console.log(props);
      console.log(mockJSONResp);

      setDescription(mockJSONResp.description);
      setTitle(mockJSONResp.title);
      toast.success("AI suggestions applied successfully");
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast.error("Failed to get AI suggestions");
    }
  };

  const handalSubmit = async () => {
    setIsSubmitting(true);
    toast.loading("Generating course content...", { id: "generating" });

    try {
      const props = `

      Generate a structured JSON output that includes comprehensive details for each chapter of a course, tutorial, or documentation.
      
      For each chapter, provide the following details:
      
      1. **title:** The name of the chapter.  
      2. **description:** A brief summary of what the chapter covers.  
      3. **estimatedReadingTime:** The approximate time required to read and understand the content.  
      4. **content** :  each and every of this chapter (min 10 words per chapter)
      5. **codeExamples** (if applicable): Any source code related to the chapter, properly formatted and with language name in JSON form {language : ,  code :  }.
      6. **importantNotes:** Key takeaways, warnings, or additional insights.  
      
      Below is the structured JSON based on the provided chapters:  
      
      ${chapters.map((chapter) => {
        return `{
          "title": "${chapter.title}",
          "description": "${chapter.description}",
        }`;
      })}
      
      **Output:** Ensure that the output is in valid **JSON** format.

      output json format should be 
      {
     
    "courseTitle": "...",
    "description": "...",

      "chapters": [
      {
        "title": "...",
        "description": "..."
      },
      ]

   }
      `;

      console.log(props);
      const result = await chatSession.sendMessage(props);
      const mockJSONResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      console.log(props);
      console.log(mockJSONResp);
      console.log(JSON.parse(mockJSONResp));

      const parsedData =
        typeof mockJSONResp === "string"
          ? JSON.parse(mockJSONResp)
          : mockJSONResp;

      if (parsedData?.chapters?.length > 0) {
        // Use map to ensure unique chapter insertion
        for (const chapter of parsedData.chapters) {
          const chapterId = uuidv4();
          await db.insert(courseDetails).values({
            title: chapter.title || chapter.chapterTitle,
            description: chapter.description || chapter.chapterDescription,
            estimatedReadingTime: chapter.estimatedReadingTime,
            content: chapter.content,
            codeExamples: JSON.stringify(chapter.codeExamples || []),
            importantNotes: JSON.stringify(chapter.importantNotes || []),
            chapterId: chapterId,
            courseId: courseId,
          });

          console.log(`Inserted chapter with ID: ${chapterId}`);
        }
        toast.dismiss("generating");
        toast.success("Course added successfully");
        router.push(`/course/${courseId}`);
        setIsSubmitting(false);
      } else {
        console.error("Error: No chapters found in response data");
        setIsSubmitting(false);
        toast.dismiss("generating");
        toast.error("Error: No chapters found");
      }
    } catch (error) {
      console.error("Database insertion error:", error);
      setIsSubmitting(false);
      toast.dismiss("generating");
      toast.error("Database insertion error");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <div className="lg:w-2/3 p-6 overflow-y-auto">
        <div className="mb-8 bg-card rounded-lg p-6 shadow-md">
          {isEditing ? (
            <>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold mb-4"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <div className="flex gap-2">
                <Button onClick={updateTitleDescription} className="w-full">
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={simulateAISuggestion}
                  className="w-full"
                >
                  <Wand2 className="mr-2 h-4 w-4" /> AI Suggest
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              <p className="mb-4 text-muted-foreground">{description}</p>
              <Button onClick={() => setIsEditing(true)} className="lg:w-[30%]">
                <Edit className="mr-2 h-4 w-4" /> Edit Title & Description
              </Button>
            </>
          )}
        </div>

        <div className="mb-8 bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
          <Accordion type="single" collapsible className="w-full">
            {chapters.map((chapter, index) => (
              <AccordionItem key={index} value={`chapter-${index}`}>
                <AccordionTrigger>
                  <p>{chapter.title || chapter.chapterTitle} </p>
                </AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    value={chapter.description || chapter.chapterDescription}
                    onChange={(e) => handleChapterChange(index, e.target.value)}
                    className="mt-2"
                    placeholder="Enter chapter description"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="lg:w-1/3 p-6 ">
        <div className="mb-6">
          <Image
            src="https://kzmnsmni730q5bqyk3m6.lite.vusercontent.net/placeholder.svg?height=400&width=600"
            alt="Book cover placeholder"
            width={400}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <Button
          onClick={handalSubmit}
          disabled={isSubmitting}
          className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Continue!!"
          )}
        </Button>
      </div>
    </div>
  );
}

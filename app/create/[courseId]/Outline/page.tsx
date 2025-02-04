"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Wand2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/utlis/db";
import { courseDetails, coursesTable } from "@/utlis/schema";
import { chatSession } from "@/utlis/gamini";
import { v4 as uuidv4 } from "uuid";

interface Chapter {
  id: string;
  title: string;
  description: string;
}

export default function OutlinePage() {
  const { courseId: rawCourseId } = useParams();
  const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!courseId) return;

        const result = await db
          .select()
          .from(coursesTable)
          .where(eq(coursesTable.courseId, courseId))
          .limit(1);

        if (result.length > 0) {
          const course = result[0];
          setTitle(course.title || "");
          setDescription(course.description || "");

          const parsedChapters =
            typeof course.chapters === "string"
              ? JSON.parse(course.chapters)?.chapters || []
              : course.chapters || [];
          setChapters(Array.isArray(parsedChapters) ? parsedChapters : []);

          const parsedTags =
            typeof course.tags === "string"
              ? JSON.parse(course.tags)
              : course.tags || [];
          setTags(Array.isArray(parsedTags) ? parsedTags : []);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const updateTitleDescription = async () => {
    try {
      await db
        .update(coursesTable)
        .set({ title, description })
        .where(eq(coursesTable.courseId, courseId!));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating title/description:", error);
    }
  };

  const updateChapters = async (updatedChapters: Chapter[]) => {
    try {
      await db
        .update(coursesTable)
        .set({ chapters: JSON.stringify({ chapters: updatedChapters }) })
        .where(eq(coursesTable.courseId, courseId!));
    } catch (error) {
      console.error("Error updating chapters:", error);
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

  const addTag = async () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      setNewTag("");
      try {
        await db
          .update(coursesTable)
          .set({ tags: JSON.stringify(updatedTags) })
          .where(eq(coursesTable.courseId, courseId!));
      } catch (error) {
        console.error("Error adding tag:", error);
      }
    }
  };

  const simulateAISuggestion = () => {
    alert("AI Suggestion: Consider adding more conflict in middle chapters.");
  };
  const router = useRouter();
  const handalSubmit = async () => {
    const props = `
    
  Generate a structured JSON output that includes comprehensive details for each chapter of a course, tutorial, or documentation.

For each chapter, provide the following details:

Title: The name of the chapter.
Description: A brief summary of what the chapter covers.
Estimated Reading Time: The approximate time required to read and understand the content.
Content :  each and every of this chapter (only one word )
Code Examples (if applicable): Any source code related to the chapter, properly formatted.
Important Notes: Key takeaways, warnings, or additional insights.

  ${chapters.map((chapters, index) => {
    return `{
      "title ${index}": "${chapters.title}",
      "description of chapter ${index}": "${chapters.description}"
    }`;
  })}


  **output** : make sure that output must be in JSON format
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

    try {
      const parsedData =
        typeof mockJSONResp === "string"
          ? JSON.parse(mockJSONResp)
          : mockJSONResp;

      if (parsedData?.chapters?.length > 0) {
        // Use map to ensure unique chapter insertion
        for (const chapter of parsedData.chapters) {
          const chapterId = uuidv4();
          await db.insert(courseDetails).values({
            title: chapter.title,
            description: chapter.description,
            estimatedReadingTime: chapter.estimatedReadingTime,
            content: chapter.content,
            codeExamples: JSON.stringify(chapter.codeExamples || []),
            importantNotes: JSON.stringify(chapter.importantNotes || []),
            chapterId: chapterId,
            courseId: courseId!,
          });

          console.log(`Inserted chapter with ID: ${chapterId}`);
        }
        router.push(`/course/${courseId}`);
      } else {
        console.error("Error: No chapters found in response data");
      }
    } catch (error) {
      console.error("Database insertion error:", error);
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
                  <p>{chapter.title}</p>
                </AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    value={chapter.description}
                    onChange={(e) => handleChapterChange(index, e.target.value)}
                    className="mt-2"
                    placeholder="Enter chapter description"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a new tag"
              className="flex-grow"
              onKeyDown={(e) => e.key === "Enter" && addTag()}
            />
            <Button onClick={addTag}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Tag
            </Button>
          </div>
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
          className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          Continue!!
        </Button>
      </div>
    </div>
  );
}

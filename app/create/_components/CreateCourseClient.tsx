// Updated CreateCourseClient component using the new database API
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { chatSession } from "@/app/api/utlis/gamini";
import { dbClient } from "@/lib/dbClient"; // Import our database client

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  image: z.instanceof(File).nullable(),
  aiAssist: z.boolean(),
});

interface CourseSuggestion {
  title: string;
  description: string;
  category: string;
  image: null;
}

interface UserData {
  id: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  imageUrl: string;
}

interface CreateCourseClientProps {
  courseSuggestions: CourseSuggestion[];
  user: UserData;
}

export function CreateCourseClient({
  courseSuggestions,
  user,
}: CreateCourseClientProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, setValue, formState, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      image: null,
      aiAssist: true,
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setValue("image", acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsCreating(true);
    setError(null);
    setPreview(null);

    try {
      // Generate AI content
      const props = `
      Generate a highly detailed and comprehensive course tutorial with the following requirements:
      
      **Title:** "${data.title}"  
      **Description:** "${data.description}"  
      **Category:** "${data.category}"  
      **Language:** "English"  
    
      give 10 chapters with there basic information for my outline page so just want title and description 

      **Output Format:** Provide the course tutorial in JSON format ,  "courseTitle" , "description".
    
      Ensure that this is a top-quality, research-driven, and impactful course that can serve both beginners and experts.

      dont give any **Note:**  eveything should be in JSON format
    `;

      console.log("Generating AI content...");
      const result = await chatSession.sendMessage(props);
      const mockJSONResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      console.log("AI Response:", mockJSONResp);

      if (!mockJSONResp) {
        throw new Error("Failed to generate course content with AI");
      }

      // Validate JSON
      try {
        JSON.parse(mockJSONResp);
      } catch {
        throw new Error("Invalid JSON response from AI");
      }

      // Create course using our database API
      console.log("Creating course in database...");
      const courseResponse = await dbClient.createCourse({
        courseId: uuidv4(),
        title: data.title,
        description: data.description,
        category: data.category,
        chapters: mockJSONResp,
        createdBy: user.emailAddress || "unknown@example.com",
      });

      if (courseResponse.status === "Success") {
        console.log("Course created successfully:", courseResponse.data);
        
        // Navigate to the outline page
        const courseData = courseResponse.data as { courseId: string };
        const courseId = courseData.courseId;
        router.push(`create/${courseId}/Outline`);
      } else {
        throw new Error(courseResponse.message || "Failed to create course");
      }

    } catch (error) {
      console.error("Error creating course:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      
      // Reset form on error
      reset();
    } finally {
      setIsCreating(false);
    }
  };

  const handleSuggestionClick = (course: CourseSuggestion) => {
    setValue("title", course.title);
    setValue("description", course.description);
    setValue("category", course.category.toLowerCase().replace(/\s+/g, '-'));
  };

  const clearError = () => setError(null);

  return (
    <div className="">
      <div className="mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Let AI help you craft an amazing learning experience
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="mb-2">
                  Course Title
                </Label>
                <Input
                  id="title"
                  placeholder="Master Python Programming from Zero to Hero"
                  {...register("title")}
                  className="h-12 text-lg"
                  disabled={isCreating}
                />
                {formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {formState.errors.title.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="block mb-2">
                  Course Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course..."
                  {...register("description")}
                  rows={7}
                  disabled={isCreating}
                />
                {formState.errors.description && (
                  <p className="text-sm text-red-500">
                    {formState.errors.description.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Course Category</Label>
                <Select 
                  onValueChange={(value) => setValue("category", value)}
                  disabled={isCreating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="artificial-intelligence">Artificial Intelligence</SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                    <SelectItem value="iot-embedded-systems">IoT & Embedded Systems</SelectItem>
                  </SelectContent>
                </Select>
                {formState.errors.category && (
                  <p className="text-sm text-red-500">
                    {formState.errors.category.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Course Image</Label>
                <Card
                  {...getRootProps()}
                  className={`cursor-pointer hover:border-primary mt-3 ${
                    isCreating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <CardContent className="flex flex-col items-center justify-center p-5">
                    {preview ? (
                      <Image
                        width={500}
                        height={200}
                        src={preview}
                        alt="Preview"
                        className="lg:h-[400px] lg:w-[600px] object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <ImageIcon className="lg:h-[240px] lg:w-[600px] text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                          Drag & drop or click to upload
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <input {...getInputProps()} className="hidden" disabled={isCreating} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => reset()}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating || formState.isSubmitting}
            >
              {isCreating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isCreating ? "Creating Course..." : "Create Course with AI"}
            </Button>
          </div>
        </form>

        {/* Course Suggestions */}
        <div className="">
          <h2 className="text-2xl font-semibold mb-4">Course Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courseSuggestions.map((course, index) => {
              return (
                <Card
                  onClick={() => !isCreating && handleSuggestionClick(course)}
                  key={index}
                  className={`flex flex-col gap-4 w-full h-[300px] justify-around p-5 transition-all ${
                    isCreating 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-4">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {course.category}
                    </span>
                    {!isCreating && (
                      <span className="text-xs text-blue-600">
                        Click to use
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">What happens next?</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
            <li>AI will generate comprehensive course content</li>
            <li>Course will be saved to your database</li>
            <li>{"You'll be redirected to the course outline page"}</li>
            <li>You can then customize chapters and content</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
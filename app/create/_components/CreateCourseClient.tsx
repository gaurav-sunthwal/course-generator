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
import { db } from "@/app/api/utlis/db";
import { coursesTable } from "@/app/api/utlis/schema";
import moment from "moment";
import { useRouter } from "next/navigation";
import { chatSession } from "@/app/api/utlis/gamini";

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
    console.log("Form Data:", data.title);
    setPreview(null);

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

    try {
      const result = await chatSession.sendMessage(props);
      const mockJSONResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");

      console.log(props);
      console.log(mockJSONResp);
      console.log(JSON.parse(mockJSONResp));

      if (mockJSONResp) {
        const resp = await db
          .insert(coursesTable)
          .values({
            courseId: uuidv4() || "",
            title: data.title,
            description: data.description,
            category: data.category,
            chapters: mockJSONResp,
            createdBy: user.emailAddress || "unknown@example.com",
            createdAt: moment().format("DD-MM-yyyy"),
            updatedAt: moment().format("DD-MM-yyyy"),
          })
          .returning({ courseId: coursesTable.courseId });

        if (resp) {
          router.push(`create/${resp[0]?.courseId}/Outline`);
        }
      } else {
        console.log("error to get respo");
        reset();
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Let AI help you craft an amazing learning experience
          </p>
        </div>

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
                />
                {formState.errors.description && (
                  <p className="text-sm text-red-500">
                    {formState.errors.description.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Course Category</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Course Image</Label>
                <Card
                  {...getRootProps()}
                  className="cursor-pointer hover:border-primary mt-3"
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
                <input {...getInputProps()} className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => reset()}>
              Cancel
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Course {"with AI"}
            </Button>
          </div>
        </form>

        <div className="">
          <h1>Course Suggestions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {courseSuggestions.map((course, index) => {
              return (
                <Card
                  onClick={() => {
                    setValue("title", course.title);
                    setValue("description", course.description);
                    setValue("category", course.category);
                  }}
                  key={index}
                  className="flex flex-col gap-4 w-full h-[300px] justify-around p-5 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <p className="text-muted-foreground">{course.description}</p>
                  <div className="flex gap-4"></div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

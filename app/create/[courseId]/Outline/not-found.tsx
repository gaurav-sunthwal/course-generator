import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Course Not Found | CourseCrafter AI",
  description:
    "The requested course could not be found. Create a new course or browse existing ones.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {`The course you're looking for doesn't exist or may have been
            removed.`}
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/create">
            <Button className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Create New Course
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Clock, BookOpen, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Chapter Header Section */}
      <div className="mb-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-2 h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="space-y-12">
        {/* Main Content Section */}
        <section>
          <div className="flex items-center mb-4">
            <BookOpen className="mr-2 h-6 w-6" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </section>

        {/* Code Examples Section */}
        <section>
          <div className="flex items-center mb-4">
            <BookOpen className="mr-2 h-6 w-6" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="p-4 bg-gray-100 rounded-lg">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </section>

        {/* Important Notes Section */}
        <section>
          <div className="flex items-center mb-4">
            <Lightbulb className="mr-2 h-6 w-6" />
            <Skeleton className="h-8 w-44" />
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </section>
      </div>
    </div>
  );
}

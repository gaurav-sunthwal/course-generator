import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ReplaceIcon as Customize,
  Zap,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Header from "./_components/Header";

export default function Home() {
  return (
    <div className="dark:bg-gradient-to-r from-slate-900 to-slate-700 ">
      <Header params="landing" />

      <main className="container mx-auto p-4">
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold mb-6">
            Create Courses with AI in One Click
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-200 mb-8">
            Transform your ideas into fully customizable courses effortlessly
          </p>
          <Link href={"/dashboard"}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Get Started
            </Button>
          </Link>
        </section>

        <section id="features" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-blue-600" />}
              title="AI-Powered Creation"
              description="Generate course content instantly with advanced AI technology"
            />
            <FeatureCard
              icon={<Customize className="h-8 w-8 text-blue-600" />}
              title="Fully Customizable"
              description="Tailor every aspect of your course to fit your unique needs"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-blue-600" />}
              title="Time-Saving"
              description="Create comprehensive courses in a fraction of the time"
            />
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-2xl mx-auto">
            <ol className="relative border-l border-gray-200">
              <TimelineItem number={1} title="Input Basic Info">
                Provide the topic, target audience, and learning objectives for
                your course.
              </TimelineItem>
              <TimelineItem number={2} title="AI Generation">
                Our AI analyzes your input and generates a comprehensive course
                structure and content.
              </TimelineItem>
              <TimelineItem number={3} title="Customize">
                Review and refine the generated content, adding your personal
                touch and expertise.
              </TimelineItem>
              <TimelineItem number={4} title="Publish">
                Finalize your course and make it available to your learners.
              </TimelineItem>
            </ol>
          </div>
        </section>

        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Revolutionize Your Course Creation?
          </h2>
          <div className="max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="mb-4"
            />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Get Early Access
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2023 CourseCrafter AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        {icon}
        <CardTitle className="mt-4 text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

interface TimelineItemProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

function TimelineItem({ number, title, children }: TimelineItemProps) {
  return (
    <li className="mb-10 ml-6">
      <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:text-black">
        {number}
      </span>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-base text-gray-500">{children}</p>
    </li>
  );
}

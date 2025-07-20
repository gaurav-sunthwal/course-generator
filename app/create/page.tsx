import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateCourseClient } from "./_components/CreateCourseClient";

export const metadata: Metadata = {
  title: "Create Course - CourseCrafter AI",
  description:
    "Create professional courses with AI assistance. Generate comprehensive course content, structure, and materials for any subject or skill level.",
  keywords: [
    "create course",
    "course creation",
    "AI course builder",
    "online course creation",
    "educational content creation",
    "course development",
    "learning material creation",
  ],
  openGraph: {
    title: "Create Course - CourseCrafter AI",
    description:
      "Create professional courses with AI assistance. Generate comprehensive course content for any subject.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create Course - CourseCrafter AI",
    description: "Create professional courses with AI assistance.",
  },
};

// Course suggestions data
const courseSuggestions = [
  {
    title: "Master Python Programming from Zero to Hero",
    description:
      "This course is designed to take you from complete beginner to advanced Python programmer. You'll gain hands-on experience with coding challenges, projects, and real-world applications of Python.",
    category: "Programming",
    image: null,
  },
  {
    title: "Data Science and Machine Learning Bootcamp",
    description:
      "This course is designed to take you from complete beginner to advanced Python programmer. You'll gain hands-on experience with coding challenges, projects, and real-world applications of Python.",
    category: "Data Science",
    image: null,
  },
  {
    title: "Full-Stack Web Development Bootcamp",
    description:
      "Learn to build modern web applications using HTML, CSS, JavaScript, React, Node.js, and databases. This hands-on course covers front-end and back-end development with real-world projects.",
    category: "Web Development",
    image: null,
  },
  {
    title: "Artificial Intelligence and Deep Learning",
    description:
      "Master the fundamentals of AI, deep learning, and neural networks using Python, TensorFlow, and PyTorch. This course includes hands-on projects and real-world AI applications.",
    category: "Artificial Intelligence",
    image: null,
  },
  {
    title: "Cybersecurity and Ethical Hacking",
    description:
      "Gain expertise in cybersecurity concepts, penetration testing, and ethical hacking techniques. Learn to secure networks, prevent cyber threats, and use industry-standard tools.",
    category: "Cybersecurity",
    image: null,
  },
  {
    title: "Blockchain and Cryptocurrency Development",
    description:
      "Explore blockchain technology, smart contracts, and cryptocurrency development. Learn how to build decentralized applications (DApps) using Solidity and Ethereum.",
    category: "Blockchain",
    image: null,
  },
  {
    title: "Cloud Computing with AWS and DevOps",
    description:
      "Learn the fundamentals of cloud computing, AWS services, and DevOps practices. This course covers CI/CD pipelines, containerization, and infrastructure automation.",
    category: "Cloud Computing",
    image: null,
  },
  {
    title: "Internet of Things (IoT) and Embedded Systems",
    description:
      "Learn how to design and build IoT applications using Arduino, Raspberry Pi, and cloud integration. This course covers sensor programming, real-time data processing, and IoT security.",
    category: "IoT & Embedded Systems",
    image: null,
  },
];

export default async function CreatePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userData = {
    id: user.id,
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddresses[0]?.emailAddress || null,
    imageUrl: user.imageUrl,
  };

  return (
    <CreateCourseClient courseSuggestions={courseSuggestions} user={userData} />
  );
}

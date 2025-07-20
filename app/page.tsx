import { Metadata } from "next";
import CourseCrafterLanding from "./_components/HomeClient";

export const metadata: Metadata = {
  title: "AI-Powered Course Generator | Create Custom Courses Effortlessly",
  description:
    "Transform any topic into comprehensive, engaging courses with our AI-powered platform. From programming and data science to marketing, cooking, or quantum physics - create professional courses instantly.",
  keywords: [
    "AI course generator",
    "course creation",
    "online learning",
    "educational technology",
    "AI-powered education",
    "course builder",
    "learning platform",
    "professional courses",
    "educational content",
    "teaching tools",
  ],
  authors: [{ name: "CourseCrafter AI" }],
  creator: "CourseCrafter AI",
  publisher: "CourseCrafter AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://coursecrafter.ai"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI-Powered Course Generator | Create Custom Courses Effortlessly",
    description:
      "Transform any topic into comprehensive, engaging courses with our AI-powered platform. From programming and data science to marketing, cooking, or quantum physics - create professional courses instantly.",
    url: "/",
    siteName: "CourseCrafter AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CourseCrafter AI - AI-Powered Course Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered Course Generator | Create Custom Courses Effortlessly",
    description:
      "Transform any topic into comprehensive, engaging courses with our AI-powered platform.",
    images: ["/og-image.jpg"],
    creator: "@coursecrafterai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "brnrAvH6YNLyRPlnUkA-3zemJp4es-Q9WvGhuEnt-no",
  },
};

// Content configuration moved to server component for better SEO
// const CONTENT_CONFIG = {
//   branding: {
//     name: "CourseCrafter AI",
//     tagline: "AI-Powered Course Generation",
//   },

//   hero: {
//     badge: "Transform Any Topic Into Professional Courses",
//     title: {
//       main: "Create",
//       highlight: "Masterful Courses",
//       subtitle: "on Any Subject",
//     },
//     description:
//       "Transform any topic into a comprehensive, engaging course with our AI-powered platform. From programming and data science to marketing, cooking, or quantum physics - create professional courses instantly.",
//     buttons: {
//       primary: { text: "Start Creating Now", route: "/create" },
//       secondary: { text: "Explore Courses", route: "/dashboard/explore" },
//     },
//   },

//   stats: [
//     { number: "50K+", label: "Courses Created" },
//     { number: "2M+", label: "Students Reached" },
//     { number: "500+", label: "Topics Covered" },
//     { number: "15min", label: "Avg Creation Time" },
//   ],

//   features: [
//     {
//       icon: "Brain",
//       title: "Universal AI Generation",
//       description:
//         "Advanced machine learning creates comprehensive course structures for any subject - from technical skills to creative arts, languages to business strategy.",
//       color: "from-purple-400 to-pink-400",
//     },
//     {
//       icon: "Target",
//       title: "Adaptive Learning Paths",
//       description:
//         "Courses automatically adjust to different skill levels, learning styles, and objectives. Perfect for beginners to experts in any field.",
//       color: "from-blue-400 to-cyan-400",
//     },
//     {
//       icon: "Clock",
//       title: "10x Faster Creation",
//       description:
//         "Generate months of structured content in minutes. Whether it's Python programming, digital marketing, or cooking masterclasses.",
//       color: "from-green-400 to-emerald-400",
//     },
//   ],

//   process: [
//     {
//       number: "01",
//       title: "Define Your Topic",
//       description:
//         "Simply describe what you want to teach - any subject, skill level, or learning objective",
//       icon: "Lightbulb",
//     },
//     {
//       number: "02",
//       title: "AI Magic Happens",
//       description:
//         "Our neural networks analyze your topic and generate comprehensive course structures with lessons, activities, and assessments",
//       icon: "Sparkles",
//     },
//     {
//       number: "03",
//       title: "Customize & Polish",
//       description:
//         "Review, edit, and add your personal expertise to the generated content. Make it uniquely yours",
//       icon: "Star",
//     },
//     {
//       number: "04",
//       title: "Launch & Impact",
//       description:
//         "Deploy your course and start transforming lives with knowledge in any field",
//       icon: "Target",
//     },
//   ],

//   courseExamples: [
//     {
//       title: "Master Python Programming",
//       category: "Programming",
//       description: "From zero to advanced Python development",
//       lessons: 25,
//       duration: "40 hours",
//       level: "Beginner to Advanced",
//     },
//     {
//       title: "Digital Marketing Mastery",
//       category: "Business",
//       description: "Complete guide to modern marketing strategies",
//       lessons: 18,
//       duration: "25 hours",
//       level: "Intermediate",
//     },
//     {
//       title: "Data Science Bootcamp",
//       category: "Data Science",
//       description: "Machine learning and analytics fundamentals",
//       lessons: 30,
//       duration: "50 hours",
//       level: "Beginner",
//     },
//   ],

//   navigation: [
//     { name: "Features", href: "#features" },
//     { name: "How it Works", href: "#how-it-works" },
//     { name: "Examples", href: "#examples" },
//     { name: "Pricing", href: "#pricing" },
//   ],

//   cta: {
//     title: "Ready to Transform",
//     highlight: "Any Subject Into Courses?",
//     description:
//       "Join thousands of educators, trainers, and entrepreneurs who are revolutionizing learning with AI-powered course creation across every imaginable topic.",
//     benefits: [
//       "Works with any subject",
//       "No technical skills required",
//       "Free to get started",
//     ],
//   },

//   footer: {
//     sections: [
//       {
//         title: "Product",
//         items: ["Features", "Course Templates", "API Access", "Integrations"],
//       },
//       {
//         title: "Use Cases",
//         items: [
//           "Corporate Training",
//           "Online Education",
//           "Personal Development",
//           "Skill Building",
//         ],
//       },
//       {
//         title: "Support",
//         items: ["Help Center", "Community", "Contact", "Documentation"],
//       },
//     ],
//   },
// };

export default function HomePage() {
  return <CourseCrafterLanding/>;
}

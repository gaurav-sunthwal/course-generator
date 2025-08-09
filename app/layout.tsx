import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | CourseCrafter AI",
    default: "AI-Powered Course Generator | Create Custom Courses Effortlessly",
  },
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
    "e-learning",
    "digital education",
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
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "CourseCrafter AI",
    title: "AI-Powered Course Generator | Create Custom Courses Effortlessly",
    description:
      "Transform any topic into comprehensive, engaging courses with our AI-powered platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CourseCrafter AI - AI-Powered Course Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@coursecrafterai",
    creator: "@coursecrafterai",
    title: "AI-Powered Course Generator | Create Custom Courses Effortlessly",
    description:
      "Transform any topic into comprehensive, engaging courses with our AI-powered platform.",
    images: ["/og-image.jpg"],
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
    google: "ksoicZtrelkr_iM1l2MnWJDbjCLZ6_2Mom7VKvCxO8U",
  },
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="google-site-verification"
            content="ksoicZtrelkr_iM1l2MnWJDbjCLZ6_2Mom7VKvCxO8U"
          />
          {/* Security Headers */}
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="X-Frame-Options" content="DENY" />
          <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
          <meta
            httpEquiv="Referrer-Policy"
            content="strict-origin-when-cross-origin"
          />
          <meta
            httpEquiv="Permissions-Policy"
            content="camera=(), microphone=(), geolocation=()"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Provider>
            <Toaster />
            {children}
            <Analytics />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}

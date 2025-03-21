import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-Powered Course Generator | Create Custom Courses Effortlessly",
  description:
    "Discover Gaurav Sunthwal's AI-powered course generation platform. Generate complete, tailored courses with advanced AI technology for educators, students, and professionals. Simplify learning with innovative solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="google-site-verification"
            content="brnrAvH6YNLyRPlnUkA-3zemJp4es-Q9WvGhuEnt-no"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Provider>
            <Toaster />
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}

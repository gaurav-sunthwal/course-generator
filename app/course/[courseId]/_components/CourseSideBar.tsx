"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SignOutButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Sample course data (replace with your actual data)
const courseData = [
  {
    id: "chapter-1",
    title: "Chapter 1: Introduction",
    content: "This is the content for Chapter 1...",
  },
  {
    id: "chapter-2",
    title: "Chapter 2: Getting Started",
    content: "This is the content for Chapter 2...",
  },
  {
    id: "chapter-3",
    title: "Chapter 3: Advanced Topics",
    content: "This is the content for Chapter 3...",
  },
  {
    id: "chapter-4",
    title: "Chapter 4: Advanced Topics",
    content: "This is the content for Chapter 4...",
  },
]

export function CourseSideBar() {
  const [currentChapter, setCurrentChapter] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.substring(1) // Remove #
        setCurrentChapter(hash)
      }
    }

    handleRouteChange() // Call initially to set the current chapter

    window.addEventListener("hashchange", handleRouteChange)

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleRouteChange)
    }
  }, []) // Runs when the component mounts

  const handleChapterSelect = (chapterId: string) => {
    setCurrentChapter(chapterId)
    router.push(`#${chapterId}`)
  }

  return (
    <Sidebar>
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-xl dark:text-white text-black">
            Course Chapters
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {courseData.map((chapter) => (
                <SidebarMenuItem key={chapter.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentChapter === chapter.id}
                    onClick={() => handleChapterSelect(chapter.id)}
                  >
                    <a href={`#${chapter.id}`} className="font-bold">
                      <span>{chapter.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton>
          <SidebarMenuButton>Sign Out</SidebarMenuButton>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  )
}


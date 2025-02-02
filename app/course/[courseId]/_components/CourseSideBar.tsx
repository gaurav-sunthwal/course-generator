"use client";

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
} from "@/components/ui/sidebar";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// Menu items.
const items = [
  {
    title: "chapter 1",
    url: "#chapter-1",
  },
  {
    title: "chapter 1",
    url: "#chapter-2",
  },
];

export function CourseSideBar() {
    
    const [currentChapter, setCurrentChapter] = useState<string | null>(null);
  
    useEffect(() => {
      const handleRouteChange = () => {
        if (typeof window !== "undefined") {
          const hash = window.location.hash.substring(1); // Remove #
          setCurrentChapter(hash);
        }
      };

      handleRouteChange(); // Call initially to set the current chapter

      window.addEventListener('hashchange', handleRouteChange);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('hashchange', handleRouteChange);
      };
    }, []); // Runs when the component mounts
  
  return (
    <Sidebar>
      <SidebarContent className="mt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-xl dark:text-white  text-black">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-bold">
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <p onClick={()=>{console.log(currentChapter)}}>code</p>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton>
          <SidebarMenuButton>
            
          </SidebarMenuButton>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
}

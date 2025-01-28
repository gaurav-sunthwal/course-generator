import { Compass, Home, LogOut, Users } from "lucide-react";

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
import {  SignOutButton } from "@clerk/nextjs";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Explore",
    url: "/dashboard/explore",
    icon: Compass,
  },

  {
    title: "Upgrade",
    url: "/dashboard/upgrade",
    icon: Users,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
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
                      <item.icon />
                      <span>{item.title}</span>
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
          <SidebarMenuButton>
            <LogOut />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
}

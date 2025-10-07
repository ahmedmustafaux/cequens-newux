import * as React from "react"
// Image component replaced with img tag for Vite
import { getAppName } from "@/lib/config"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconMessage,
  IconPhoneCall,
  IconSearch,
  IconSettings,
  IconUsers,
  IconTemplate,
  IconRobot,
  IconComponents,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: IconMessage,
    },
    {
      title: "Campaigns",
      url: "/campaigns",
      icon: IconPhoneCall,
      items: [
        {
          title: "Templates",
          url: "/campaigns/templates",
          icon: IconTemplate,
        },
        {
          title: "Settings",
          url: "/campaigns/settings",
          icon: IconSettings,
        },
        {
          title: "AI Bots",
          url: "/campaigns/ai-bots",
          icon: IconRobot,
        },
      ],
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: IconUsers,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}
export function AppSidebar({ ...props }: AppSidebarProps) {
  const { user } = useAuth()
  
  // Create user data for NavUser component
  const userData = {
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    avatar: "", // Use empty string to trigger Avatar fallback with initials
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
       
                <img
                  src="/Logo.svg" 
                  alt={getAppName()} 
                  className="ml-1 py-2 w-25 h-auto"
                />
      
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}

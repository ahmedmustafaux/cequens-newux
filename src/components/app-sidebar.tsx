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
  IconBrandWhatsapp,
  IconMail,
  IconBrandInstagram,
  IconBrandApple,
  IconDeviceMobile,
  IconBrandMessenger,
  IconWorld,
  IconBrandTelegram,
  IconPlus,
  IconBulb,
  IconTags,
  IconUserPlus,
  IconSection,
  IconInbox,
  IconBrandCampaignmonitor,
  IconBrain,
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
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Campaigns",
      url: "/campaigns",
      icon: IconBrandCampaignmonitor,
      items: [
        {
          title: "Create New Campaign",
          url: "/campaigns/create",
          icon: IconPlus,
        },
        {
          title: "Automation",
          url: "/campaigns/automation",
          icon: IconBulb,
        },
        {
          title: "Settings",
          url: "/campaigns/settings",
          icon: IconSettings,
        },
      ],
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: IconInbox,
      items: [
        {
          title: "Requests",
          url: "/inbox/requests",
          icon: IconMessage,
        },
        {
          title: "Settings",
          url: "/inbox/settings",
          icon: IconSettings,
        },
      ],
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: IconUsers,
      items: [
        {
          title: "Create New Contact",
          url: "/contacts/create",
          icon: IconUserPlus,
        },
        {
          title: "Segments",
          url: "/contacts/segments",
          icon: IconSection,
        },
        {
          title: "Tags & Attributes",
          url: "/contacts/tags",
          icon: IconTags,
        },
      ],
    },
    {
      title: "Automation Hub",
      url: "/automation",
      icon: IconRobot,
      items: [
        {
          title: "Journey Builder",
          url: "/automation/journey",
          icon: IconComponents,
        },
        {
          title: "Templates",
          url: "/automation/templates",
          icon: IconTemplate,
        },
        {
          title: "Automation / CEQ Bots",
          url: "/automation/bots",
          icon: IconBrain,
        },
      ],
    },
    {
      title: "Channels",
      url: "/channels",
      icon: IconWorld,
      items: [
        {
          title: "SMS",
          url: "/channels/sms",
          icon: IconDeviceMobile,
        },
        {
          title: "WhatsApp",
          url: "/channels/whatsapp",
          icon: IconBrandWhatsapp,
        },
        {
          title: "Messenger",
          url: "/channels/messenger",
          icon: IconBrandMessenger,
        },
        {
          title: "Instagram",
          url: "/channels/instagram",
          icon: IconBrandInstagram,
        },
        {
          title: "Apple Messages",
          url: "/channels/apple",
          icon: IconBrandApple,
        },
        {
          title: "Email",
          url: "/channels/email",
          icon: IconMail,
        },
        {
          title: "Call",
          url: "/channels/call",
          icon: IconPhoneCall,
        },
        {
          title: "Push Notifications",
          url: "/channels/push",
          icon: IconDeviceMobile,
        },
        {
          title: "RCS",
          url: "/channels/rcs",
          icon: IconBrandTelegram,
        },
      ],
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

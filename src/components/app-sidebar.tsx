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
  IconPlus,
  IconBulb,
  IconTags,
  IconUserPlus,
  IconSection,
  IconInbox,
  IconBrandCampaignmonitor,
  IconBrain,
  IconApi,
  IconCreditCard,
  IconUserCircle,
  IconList,
  IconFileDescription,
  IconBell,
  IconUser,
  IconFileExport,
  IconPuzzle,
  IconAdjustments,
  IconLifebuoy,
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
      title: "Audience",
      url: "/contacts",
      icon: IconUsers,
      items: [
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
          title: "Bot Studio",
          url: "/automation/bots",
          icon: IconBrain,
        },
      ],
    },
    {
      title: "Channels",
      url: "/channels",
      icon: IconWorld,
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
      title: "Developer Hub",
      url: "/developer-apis",
      icon: IconApi,
      items: [
        {
          title: "API Docs",
          url: "/developer-apis/docs",
        },
        {
          title: "SMS API",
          url: "/developer-apis/sms",
        },
        {
          title: "Voice API",
          url: "/developer-apis/voice",
        },
        {
          title: "WhatsApp Business API",
          url: "/developer-apis/whatsapp",
        },
        {
          title: "Push Notification API",
          url: "/developer-apis/push",
        },
        {
          title: "OTP API",
          url: "/developer-apis/otp",
        },
        {
          title: "Bot APIs",
          url: "/developer-apis/bots",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
      items: [
        {
          title: "Account Settings",
          url: "/settings/profile",
        },
        {
          title: "Team Management",
          url: "/settings/organization",
        },
        {
          title: "Audience Export",
          url: "/settings/contacts-export",
        },
        {
          title: "Integrations",
          url: "/settings/plugins",
        },
        {
          title: "System Preferences",
          url: "/settings/preferences",
        },
      ],
    },
    {
      title: "Billing",
      url: "/billing",
      icon: IconCreditCard,
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

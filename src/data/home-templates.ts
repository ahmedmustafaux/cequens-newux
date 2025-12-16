// Template/workflow data for the home page
// These templates match user onboarding data (industry, goals, channels)

export interface AppIcon {
  name: string
  iconType: "emoji" | "text" | "svg" | "component"
  icon: string
  color?: string
  bgColor?: string
}

export interface WorkflowTemplate {
  id: string
  title: string
  description: string
  apps: AppIcon[]
  isAIPowered: boolean
  categories: string[] // "ai-workflow", "most-popular"
  industries?: string[] // industry IDs that this template is relevant for
  goals?: string[] // goal IDs that match user goals
  channels?: string[] // channel IDs used in this template
  readTime?: string
}

// App icon helpers
export function getAppIcon(name: string): AppIcon {
  const icons: Record<string, AppIcon> = {
    facebook: {
      name: "Facebook",
      iconType: "text",
      icon: "f",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    "google-sheets": {
      name: "Google Sheets",
      iconType: "emoji",
      icon: "📊",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    gmail: {
      name: "Gmail",
      iconType: "text",
      icon: "M",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    },
    "microsoft-teams": {
      name: "Microsoft Teams",
      iconType: "text",
      icon: "T",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    whatsapp: {
      name: "WhatsApp",
      iconType: "svg",
      icon: "/icons/WhatsApp.svg",
      bgColor: "bg-white dark:bg-gray-900"
    },
    sms: {
      name: "SMS",
      iconType: "component",
      icon: "ChatText",
      bgColor: "bg-muted"
    },
    email: {
      name: "Email",
      iconType: "component",
      icon: "EnvelopeSimple",
      bgColor: "bg-muted"
    },
    "chatgpt": {
      name: "ChatGPT",
      iconType: "emoji",
      icon: "🤖",
      bgColor: "bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20"
    },
    "google-ai-studio": {
      name: "Google AI Studio",
      iconType: "emoji",
      icon: "⭐",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    }
  }
  return icons[name] || { name, iconType: "text", icon: "?", bgColor: "bg-muted" }
}

// Template data
export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "fb-leads-sheets",
    title: "Capture New Leads from Facebook, Analyze Their Details, and Log Them into Google Sheets",
    description: "Automatically capture leads from Facebook, extract their information using AI, and organize everything in Google Sheets.",
    apps: [getAppIcon("facebook"), getAppIcon("google-sheets")],
    isAIPowered: true,
    categories: ["ai-workflow", "most-popular"],
    industries: ["ecommerce", "retail"],
    goals: ["goal-4"], // Lead generation
    channels: ["channel-5"] // Messenger
  },
  {
    id: "sheets-chatgpt-insights",
    title: "Receive automatic updates in Google Sheets with ChatGPT insights",
    description: "Get AI-powered insights and analysis automatically added to your Google Sheets from ChatGPT.",
    apps: [getAppIcon("google-sheets"), getAppIcon("chatgpt")],
    isAIPowered: true,
    categories: ["ai-workflow"],
    industries: ["ecommerce", "technology", "finance"],
    goals: ["goal-8"], // Analytics & reporting
    channels: ["channel-3"] // Email
  },
  {
    id: "gmail-ai-replies",
    title: "Instantly Respond to New Emails with AI-Powered Replies and Google AI Studio",
    description: "Automatically generate intelligent email responses using AI to improve customer service efficiency.",
    apps: [getAppIcon("gmail"), getAppIcon("google-ai-studio")],
    isAIPowered: true,
    categories: ["ai-workflow"],
    industries: ["technology", "ecommerce"],
    goals: ["goal-3"], // Support automation
    channels: ["channel-3"] // Email
  },
  {
    id: "whatsapp-order-confirmation",
    title: "Send Order Confirmations via WhatsApp Automatically",
    description: "Automatically send order confirmation messages to customers via WhatsApp when they place an order.",
    apps: [getAppIcon("whatsapp")],
    isAIPowered: false,
    categories: ["most-popular"],
    industries: ["ecommerce", "retail"],
    goals: ["goal-1", "goal-2"], // Customer engagement, Marketing campaigns
    channels: ["channel-2"] // WhatsApp
  },
  {
    id: "sms-appointment-reminder",
    title: "Automated SMS Appointment Reminders",
    description: "Send automated SMS reminders to customers 24 hours before their scheduled appointments.",
    apps: [getAppIcon("sms")],
    isAIPowered: false,
    categories: ["most-popular"],
    industries: ["healthcare", "education"],
    goals: ["goal-1"], // Customer engagement
    channels: ["channel-1"] // SMS
  },
  {
    id: "multi-channel-campaign",
    title: "Multi-Channel Marketing Campaign Automation",
    description: "Run coordinated campaigns across WhatsApp, SMS, and Email with personalized messaging.",
    apps: [getAppIcon("whatsapp"), getAppIcon("sms"), getAppIcon("email")],
    isAIPowered: false,
    categories: ["most-popular"],
    industries: ["ecommerce", "retail", "finance"],
    goals: ["goal-2", "goal-9"], // Marketing campaigns, Multi-channel messaging
    channels: ["channel-2", "channel-1", "channel-3"]
  },
  {
    id: "ai-customer-support",
    title: "AI-Powered Customer Support Automation",
    description: "Automatically handle customer inquiries using AI, escalating complex issues to human agents when needed.",
    apps: [getAppIcon("chatgpt"), getAppIcon("whatsapp")],
    isAIPowered: true,
    categories: ["ai-workflow"],
    industries: ["ecommerce", "technology", "retail"],
    goals: ["goal-3"], // Support automation
    channels: ["channel-2", "channel-5"] // WhatsApp, Messenger
  },
  {
    id: "abandoned-cart-recovery",
    title: "Automated Abandoned Cart Recovery via WhatsApp",
    description: "Send personalized reminders to customers who abandoned their shopping cart, increasing conversion rates.",
    apps: [getAppIcon("whatsapp")],
    isAIPowered: false,
    categories: ["most-popular"],
    industries: ["ecommerce"],
    goals: ["goal-2", "goal-4"], // Marketing campaigns, Lead generation
    channels: ["channel-2"] // WhatsApp
  }
]

// Featured content/articles data
export interface FeaturedContent {
  id: string
  title: string
  description: string
  readTime: string
  apps: string[] // App names for visual generation
  cta: {
    label: string
    href?: string
  }
}

// Featured content items
export const featuredContent: FeaturedContent[] = [
  {
    id: "sheets-automation",
    title: "6 Google Sheets automation ideas to organize your work",
    description: "Want AI and automation to improve your spreadsheet workflows? Get ideas and templates for connecting the king of sheets to the rest of your tech stack.",
    readTime: "4 min",
    apps: ["google-sheets", "facebook", "microsoft-teams", "gmail"],
    cta: {
      label: "Read the post"
    }
  }
]

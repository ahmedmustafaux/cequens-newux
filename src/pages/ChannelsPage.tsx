import * as React from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { 
  pageVariants, 
  smoothTransition
} from "@/lib/transitions"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardSkeleton,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Phone, 
  Mail, 
  Smartphone,
  Send,
  Bell,
  Settings,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react"

// Channel type definition
interface Channel {
  id: string
  name: string
  description: string
  icon?: React.ElementType
  iconUrl?: string
  status: "active" | "available" | "coming-soon"
  category: "recommended" | "other"
  color: string
  features?: string[]
}

// Channels data
const channels: Channel[] = [
  {
    id: "messenger",
    name: "Messenger",
    description: "Give proactive help, self-service, and personal assistance via chat on your website.",
    iconUrl: "/icons/Messenger.png",
    status: "available",
    category: "recommended",
    color: "",
    features: ["Real-time chat", "Automated responses", "Rich media support"]
  },
  {
    id: "email",
    name: "Email",
    description: "Respond to customer queries and start conversations with email.",
    icon: Mail,
    status: "available",
    category: "recommended",
    color: "",
    features: ["Bulk campaigns", "Templates", "Analytics"]
  },
  {
    id: "phone",
    name: "Phone",
    description: "Initiate phone calls, video calls and screen sharing to quickly help your customers.",
    icon: Phone,
    status: "available",
    category: "recommended",
    color: "",
    features: ["Voice calls", "Video calls", "Call recording"]
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Respond to WhatsApp messages and interact with customers directly from your inbox.",
    iconUrl: "/icons/WhatsApp.svg",
    status: "available",
    category: "other",
    color: "",
    features: ["Business API", "Templates", "Media sharing"]
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Respond to Instagram messages and interact with customers directly from your inbox.",
    iconUrl: "/icons/Instagram.svg",
    status: "available",
    category: "other",
    color: "",
    features: ["Direct messages", "Story replies", "Comments"]
  },
  {
    id: "sms",
    name: "SMS",
    description: "Send text messages to customers for notifications and marketing campaigns.",
    icon: Smartphone,
    status: "available",
    category: "other",
    color: "",
    features: ["Bulk SMS", "Two-way messaging", "Delivery reports"]
  },
  {
    id: "rcs",
    name: "RCS",
    description: "Rich Communication Services for enhanced messaging with media and interactive elements.",
    icon: Send,
    status: "available",
    category: "other",
    color: "",
    features: ["Rich media", "Interactive buttons", "Read receipts"]
  },
  {
    id: "push",
    name: "Push Notifications",
    description: "Send push notifications to mobile and web app users for instant engagement.",
    icon: Bell,
    status: "available",
    category: "other",
    color: "",
    features: ["Mobile push", "Web push", "Segmentation"]
  },
]

export default function ChannelsPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [activeChannels, setActiveChannels] = React.useState<string[]>([])

  // Simulate initial data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Simulate some active channels
      setActiveChannels(["messenger", "email"])
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  const handleChannelAction = (channelId: string, isActive: boolean) => {
    if (isActive) {
      // Navigate to channel settings
      console.log(`Configure ${channelId}`)
    } else {
      // Activate channel
      setActiveChannels(prev => [...prev, channelId])
      console.log(`Activate ${channelId}`)
    }
  }

  const getStatusBadge = (channel: Channel) => {
    const isActive = activeChannels.includes(channel.id)
    
    if (isActive) {
      return (
        <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100">
          Active
        </Badge>
      )
    }
    
    return (
      <Badge variant="outline" className="border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100">
        Inactive
      </Badge>
    )
  }

  const renderChannelIcon = (channel: Channel) => {
    if (channel.iconUrl) {
      return (
        <div className="p-2.5 rounded-lg bg-gray-100 border border-border">
          <img 
            src={channel.iconUrl} 
            alt={channel.name}
            className="w-6 h-6 object-contain"
          />
        </div>
      )
    }
    
    if (channel.icon) {
      const Icon = channel.icon
      return (
        <div className="p-2.5 rounded-lg bg-gray-100 border border-border">
          <Icon className="w-6 h-6 text-foreground" />
        </div>
      )
    }
    
    return null
  }

  return (
    <PageWrapper isLoading={isLoading}>
      <PageHeader
        title="Channels"
        description="Configure and manage your communication channels"
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="space-y-6">
          <div>
            <div className="h-5 w-28 bg-muted rounded mb-3 animate-pulse" />
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div>
            <div className="h-5 w-28 bg-muted rounded mb-3 animate-pulse" />
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-6"
        >
          {/* Active Channels Section */}
          {activeChannels.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">Active Channels</p>
              <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
                {channels
                  .filter((channel) => activeChannels.includes(channel.id))
                  .map((channel) => {
                    return (
                      <Card 
                        key={channel.id} 
                        className="h-full hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleChannelAction(channel.id, true)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start gap-2.5">
                            {renderChannelIcon(channel)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <CardTitle className="text-base">{channel.name}</CardTitle>
                                {getStatusBadge(channel)}
                              </div>
                              <CardDescription className="line-clamp-1 text-xs">
                                {channel.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        {channel.features && (
                          <CardContent>
                            <div className="space-y-1">
                              {channel.features.slice(0, 2).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <div className="w-1 h-1 rounded-full bg-primary" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
              </div>
            </div>
          )}

          {/* All Channels Section */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">All Channels</p>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {channels
                .filter((channel) => !activeChannels.includes(channel.id))
                .map((channel) => {
                  return (
                    <Card 
                      key={channel.id} 
                      className="h-full hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleChannelAction(channel.id, false)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-2.5">
                          {renderChannelIcon(channel)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <CardTitle className="text-base">{channel.name}</CardTitle>
                              {getStatusBadge(channel)}
                            </div>
                            <CardDescription className="line-clamp-1 text-xs">
                              {channel.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      {channel.features && (
                        <CardContent>
                          <div className="space-y-1">
                            {channel.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )
                })}
            </div>
          </div>
        </motion.div>
      )}
    </PageWrapper>
  )
}
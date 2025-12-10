import * as React from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, MessageSquare, Mail, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { smoothTransition } from "@/lib/transitions"

// Channel icon mapping
const channelIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  "channel-1": { icon: <MessageSquare className="w-3.5 h-3.5 text-primary" />, label: "SMS" },
  "channel-2": { icon: <img src="/icons/WhatsApp.svg" alt="WhatsApp" className="w-3.5 h-3.5" />, label: "WhatsApp" },
  "channel-3": { icon: <Mail className="w-3.5 h-3.5 text-primary" />, label: "Email" },
  "channel-4": { icon: <Phone className="w-3.5 h-3.5 text-primary" />, label: "Voice" },
  "channel-5": { icon: <img src="/icons/Messenger.png" alt="Messenger" className="w-3.5 h-3.5" />, label: "Messenger" },
}

// Industry template interface
export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  useCases: string[];
  channels: string[];
  goals: string[];
  teamSize: string;
  industry: string;
}

// Predefined industry templates
export const industryTemplates: IndustryTemplate[] = [
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Online retail and marketplace businesses",
    icon: "🛒",
    useCases: [
      "Order confirmations & shipping updates",
      "Abandoned cart recovery",
      "Product recommendations",
      "Customer support automation"
    ],
    channels: ["channel-1", "channel-2", "channel-3"], // SMS, WhatsApp, Email
    goals: ["goal-1", "goal-2", "goal-4"], // Customer engagement, Marketing campaigns, Lead generation
    teamSize: "team-3", // 6-20 people
    industry: "industry-1" // E-commerce
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical facilities and health services",
    icon: "🏥",
    useCases: [
      "Appointment reminders",
      "Test results notifications",
      "Health tips & wellness programs",
      "Emergency alerts"
    ],
    channels: ["channel-1", "channel-2", "channel-4"], // SMS, WhatsApp, Voice
    goals: ["goal-1", "goal-5"], // Customer engagement, Internal communications
    teamSize: "team-4", // 21-100 people
    industry: "industry-2" // Healthcare
  },
  {
    id: "finance",
    name: "Finance & Banking",
    description: "Financial institutions and fintech",
    icon: "💰",
    useCases: [
      "Transaction alerts",
      "Account security notifications",
      "Payment reminders",
      "Financial advice & updates"
    ],
    channels: ["channel-1", "channel-2", "channel-3", "channel-4"], // SMS, WhatsApp, Email, Voice
    goals: ["goal-1", "goal-5"], // Customer engagement, Internal communications
    teamSize: "team-5", // 100+ people
    industry: "industry-3" // Finance
  },
  {
    id: "education",
    name: "Education",
    description: "Schools, universities, and e-learning platforms",
    icon: "🎓",
    useCases: [
      "Class schedules & updates",
      "Assignment reminders",
      "Parent-teacher communication",
      "Event notifications"
    ],
    channels: ["channel-1", "channel-2", "channel-3", "channel-5"], // SMS, WhatsApp, Email, Messenger
    goals: ["goal-1", "goal-5"], // Customer engagement, Internal communications
    teamSize: "team-3", // 6-20 people
    industry: "industry-4" // Education
  },
  {
    id: "retail",
    name: "Retail",
    description: "Physical stores and retail chains",
    icon: "🏪",
    useCases: [
      "Promotional campaigns",
      "Loyalty program updates",
      "In-store pickup notifications",
      "Customer feedback collection"
    ],
    channels: ["channel-1", "channel-2", "channel-3"], // SMS, WhatsApp, Email
    goals: ["goal-1", "goal-2", "goal-4"], // Customer engagement, Marketing campaigns, Lead generation
    teamSize: "team-3", // 6-20 people
    industry: "industry-6" // Retail
  },
  {
    id: "technology",
    name: "Technology & SaaS",
    description: "Software companies and tech startups",
    icon: "💻",
    useCases: [
      "Product updates & releases",
      "User onboarding sequences",
      "Technical support tickets",
      "Feature announcements"
    ],
    channels: ["channel-2", "channel-3", "channel-5"], // WhatsApp, Email, Messenger
    goals: ["goal-1", "goal-2", "goal-3"], // Customer engagement, Marketing campaigns, Support automation
    teamSize: "team-2", // 2-5 people
    industry: "industry-5" // Technology
  }
];

interface OnboardingTemplateSelectionProps {
  onTemplateSelect: (template: IndustryTemplate) => void;
  onStartFromScratch: () => void;
}

export function OnboardingTemplateSelection({ 
  onTemplateSelect, 
  onStartFromScratch 
}: OnboardingTemplateSelectionProps) {
  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-24">
      <Card className="w-full max-w-5xl shadow-lg bg-card rounded-2xl overflow-hidden fixed top-16 z-10">
        <CardContent className="p-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={smoothTransition}
            className="space-y-6"
          >
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">Welcome to Cequens!</h1>
              <p className="text-sm text-muted-foreground">
                Choose a template that matches your industry or start from scratch to customize everything.
              </p>
            </div>

            {/* Industry Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {industryTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => onTemplateSelect(template)}
                  className="p-4 rounded-lg border border-border hover:border-border-primary cursor-pointer transition-all bg-card group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl">{template.icon}</div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {template.description}
                      </p>
                    </div>

                    {/* Channels */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border">
                      {template.channels.map((channelId) => {
                        const channel = channelIcons[channelId]
                        return channel ? (
                          <div
                            key={channelId}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
                            title={channel.label}
                          >
                            {channel.icon}
                            <span className="hidden sm:inline">{channel.label}</span>
                          </div>
                        ) : null
                      })}
                    </div>

                    <div className="space-y-1 pt-1">
                      <p className="text-xs font-medium text-foreground">Use cases:</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {template.useCases.slice(0, 2).map((useCase, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="w-3 h-3 mr-1 mt-0.5 text-primary flex-shrink-0" />
                            <span className="line-clamp-1">{useCase}</span>
                          </li>
                        ))}
                        {template.useCases.length > 2 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <li className="text-primary font-medium text-xs pl-4 cursor-help">
                                  +{template.useCases.length - 2} more
                                </li>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="space-y-1">
                                  {template.useCases.slice(2).map((useCase, idx) => (
                                    <div key={idx} className="flex items-start text-xs">
                                      <Check className="w-3 h-3 mr-1 mt-0.5 text-primary flex-shrink-0" />
                                      <span>{useCase}</span>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Start from Scratch Card */}
            <div
              onClick={onStartFromScratch}
              className="p-4 rounded-lg border border-dashed border-border hover:border-primary cursor-pointer transition-all bg-card group"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                    Your industry not listed?
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Answer a few questions to help us create a personalized experience for you
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
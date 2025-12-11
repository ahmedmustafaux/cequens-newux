import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Check, 
  ChevronDown, 
  ChevronRight, 
  MessageSquare, 
  Users, 
  Send,
  Settings,
  Sparkles,
  Minimize2,
  Maximize2,
  Lock,
  Code,
  Briefcase,
  BookOpen,
  Terminal,
  Key,
  Webhook,
  FileCode
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { smoothTransition } from "@/lib/transitions"
import { cn } from "@/lib/utils"
import { Alert } from "./ui/alert"
import { hasActiveChannels } from "@/lib/channel-utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Define setup step interface
interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  action?: {
    label: string
    href: string
  }
}

// Define setup section interface
interface SetupSection {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
  steps: SetupStep[]
  illustration?: React.ReactNode
}

// Persona type
export type Persona = "business" | "api"

// Props interface
interface GettingStartedGuideProps {
  industry?: string
  channels?: string[]
  goals?: string[]
  persona?: Persona
  onDismiss?: () => void
  inline?: boolean // If true, renders inline instead of fixed position
}

export function GettingStartedGuide({ 
  industry = "ecommerce",
  channels = [],
  goals = [],
  persona = "business",
  onDismiss,
  inline = false
}: GettingStartedGuideProps) {
  // LocalStorage keys - persona-specific
  const STORAGE_KEY_COMPLETED = `cequens-setup-guide-completed-steps-${persona}`
  const STORAGE_KEY_MINIMIZED = `cequens-setup-guide-minimized-${persona}`
  const STORAGE_KEY_EXPANDED = `cequens-setup-guide-expanded-section-${persona}`

  // Initialize state from localStorage
  // In inline mode, default to first section expanded
  const [expandedSection, setExpandedSection] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPANDED)
      return saved ? saved : "section-1" // Default to first section
    } catch {
      return "section-1"
    }
  })

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        const savedSteps = new Set<string>(parsed)
        // Automatically mark step-1-1 as completed if any channel is active (only for business persona)
        if (persona === "business" && hasActiveChannels()) {
          savedSteps.add("step-1-1")
        }
        return savedSteps
      } else {
        const steps = new Set<string>()
        // Automatically mark step-1-1 as completed if any channel is active (only for business persona)
        if (persona === "business" && hasActiveChannels()) {
          steps.add("step-1-1")
        }
        return steps
      }
    } catch {
      const steps = new Set<string>()
      // Automatically mark step-1-1 as completed if any channel is active (only for business persona)
      if (persona === "business" && hasActiveChannels()) {
        steps.add("step-1-1")
      }
      return steps
    }
  })

  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MINIMIZED)
      return saved === 'true'
    } catch {
      return false
    }
  })

  // Save completed steps to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(Array.from(completedSteps)))
    } catch (error) {
      console.error('Failed to save completed steps:', error)
    }
  }, [completedSteps, persona])

  // Listen for active channels changes and update step-1-1 completion (only for business persona)
  useEffect(() => {
    if (persona !== "business") return

    const handleActiveChannelsChange = () => {
      const hasActive = hasActiveChannels()
      setCompletedSteps(prev => {
        const newSet = new Set(prev)
        if (hasActive) {
          newSet.add("step-1-1")
        } else {
          newSet.delete("step-1-1")
        }
        return newSet
      })
    }

    window.addEventListener('activeChannelsChanged', handleActiveChannelsChange)
    // Check on mount as well
    handleActiveChannelsChange()
    
    return () => {
      window.removeEventListener('activeChannelsChanged', handleActiveChannelsChange)
    }
  }, [persona])

  // Save minimized state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MINIMIZED, String(isMinimized))
    } catch (error) {
      console.error('Failed to save minimized state:', error)
    }
  }, [isMinimized, persona])

  // Save expanded section to localStorage whenever it changes
  useEffect(() => {
    try {
      if (expandedSection) {
        localStorage.setItem(STORAGE_KEY_EXPANDED, expandedSection)
      } else {
        localStorage.removeItem(STORAGE_KEY_EXPANDED)
      }
    } catch (error) {
      console.error('Failed to save expanded section:', error)
    }
  }, [expandedSection, persona])

  // Reset expanded section when persona changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPANDED)
      setExpandedSection(saved ? saved : "section-1")
    } catch {
      setExpandedSection("section-1")
    }
  }, [persona])

  // Reset completed steps when persona changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        const savedSteps = new Set<string>(parsed)
        // Only auto-mark step-1-1 for business persona
        if (persona === "business" && hasActiveChannels()) {
          savedSteps.add("step-1-1")
        }
        setCompletedSteps(savedSteps)
      } else {
        const steps = new Set<string>()
        if (persona === "business" && hasActiveChannels()) {
          steps.add("step-1-1")
        }
        setCompletedSteps(steps)
      }
    } catch {
      const steps = new Set<string>()
      if (persona === "business" && hasActiveChannels()) {
        steps.add("step-1-1")
      }
      setCompletedSteps(steps)
    }
  }, [persona])

  // Generate personalized setup sections based on persona, industry and selections
  const setupSections: SetupSection[] = React.useMemo(() => {
    const sections: SetupSection[] = []

    if (persona === "business") {
      // BUSINESS PERSONA (MARKETEER) SECTIONS
      
      // Section 1: Send your first campaign
      sections.push({
        id: "section-1",
        title: "Send your first campaign",
        description: "Get started by sending your first message to customers",
        icon: <Send className="w-5 h-5" />,
        steps: [
          {
            id: "step-1-1",
            title: "Configure your channel",
            description: channels.length > 0 
              ? `Set up ${channels.map(c => getChannelName(c)).join(", ")} for messaging`
              : "Choose and configure your preferred messaging channel",
            completed: false,
            action: {
              label: "Configure channels",
              href: "/channels"
            }
          },
          {
            id: "step-1-2",
            title: "Add your audience",
            description: "Add contacts or create a segment",
            completed: false,
            action: {
              label: "Add contacts",
              href: "/contacts"
            }
          },
          {
            id: "step-1-3",
            title: "Send your campaign",
            description: "Create and send your first message",
            completed: false,
            action: {
              label: "Create campaign",
              href: "/campaigns/create"
            }
          }
        ],
        illustration: (
          <div className="relative w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-card rounded-lg shadow-md flex items-center justify-center border border-border">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-success-foreground" />
                </div>
              </div>
            </div>
          </div>
        )
      })

      // Section 2: Industry-specific setup for Business persona
      if (industry === "ecommerce") {
      sections.push({
        id: "section-2",
        title: "Set up your store",
        description: "Configure your e-commerce integrations",
        icon: <Settings className="w-5 h-5" />,
        steps: [
          {
            id: "step-2-1",
            title: "Connect your store",
            description: "Integrate with Shopify, WooCommerce, or your platform",
            completed: false,
            action: {
              label: "Browse integrations",
              href: "/settings/plugins"
            }
          },
          {
            id: "step-2-2",
            title: "Set up abandoned cart recovery",
            description: "Automatically recover lost sales with smart reminders",
            completed: false,
            action: {
              label: "Configure automation",
              href: "/automation"
            }
          },
          {
            id: "step-2-3",
            title: "Create order notification templates",
            description: "Keep customers informed about their orders",
            completed: false,
            action: {
              label: "Create templates",
              href: "/campaigns/templates"
            }
          }
        ]
      })
    } else if (industry === "healthcare") {
      sections.push({
        id: "section-2",
        title: "Configure healthcare workflows",
        description: "Set up patient communication",
        icon: <Settings className="w-5 h-5" />,
        steps: [
          {
            id: "step-2-1",
            title: "Set up appointment reminders",
            description: "Reduce no-shows with automated reminders",
            completed: false,
            action: {
              label: "Configure automation",
              href: "/automation"
            }
          },
          {
            id: "step-2-2",
            title: "Create notification templates",
            description: "Templates for test results, prescriptions, and more",
            completed: false,
            action: {
              label: "Create templates",
              href: "/campaigns/templates"
            }
          },
          {
            id: "step-2-3",
            title: "Configure HIPAA compliance",
            description: "Ensure secure patient communication",
            completed: false,
            action: {
              label: "Security settings",
              href: "/settings/organization"
            }
          }
        ]
      })
    } else if (industry === "finance") {
      sections.push({
        id: "section-2",
        title: "Configure financial services",
        description: "Set up secure banking communications",
        icon: <Settings className="w-5 h-5" />,
        steps: [
          {
            id: "step-2-1",
            title: "Set up transaction alerts",
            description: "Real-time notifications for account activity",
            completed: false,
            action: {
              label: "Configure automation",
              href: "/automation"
            }
          },
          {
            id: "step-2-2",
            title: "Enable two-factor authentication",
            description: "Secure customer accounts with OTP",
            completed: false,
            action: {
              label: "Configure OTP",
              href: "/developer/apis/otp"
            }
          },
          {
            id: "step-2-3",
            title: "Create security notification templates",
            description: "Alert customers about suspicious activity",
            completed: false,
            action: {
              label: "Create templates",
              href: "/campaigns/templates"
            }
          }
        ]
      })
    } else {
      // Generic setup for other industries
      sections.push({
        id: "section-2",
        title: "Customize your setup",
        description: "Configure platform features",
        icon: <Settings className="w-5 h-5" />,
        steps: [
          {
            id: "step-2-1",
            title: "Set up automation workflows",
            description: "Create automated message sequences",
            completed: false,
            action: {
              label: "Configure automation",
              href: "/automation"
            }
          },
          {
            id: "step-2-2",
            title: "Create message templates",
            description: "Save time with reusable templates",
            completed: false,
            action: {
              label: "Create templates",
              href: "/campaigns/templates"
            }
          },
          {
            id: "step-2-3",
            title: "Configure integrations",
            description: "Connect your existing tools",
            completed: false,
            action: {
              label: "Browse integrations",
              href: "/settings/plugins"
            }
          }
        ]
      })
    }

      // Section 3: Team collaboration (if applicable)
      sections.push({
        id: "section-3",
        title: "Invite your team",
        description: "Collaborate with team members",
        icon: <Users className="w-5 h-5" />,
        steps: [
          {
            id: "step-3-1",
            title: "Add team members",
            description: "Invite colleagues to collaborate",
            completed: false,
            action: {
              label: "Manage team",
              href: "/settings/organization"
            }
          },
          {
            id: "step-3-2",
            title: "Set up roles and permissions",
            description: "Control who can access what",
            completed: false,
            action: {
              label: "Configure roles",
              href: "/settings/organization"
            }
          }
        ]
      })
    } else {
      // API PERSONA (DEVELOPER) SECTIONS
      
      // Section 1: Get API Access
      sections.push({
        id: "section-1",
        title: "Get API Access",
        description: "Set up your API credentials and authentication",
        icon: <Key className="w-5 h-5" />,
        steps: [
          {
            id: "step-1-1",
            title: "Generate API Key",
            description: "Create your API key for authentication",
            completed: false,
            action: {
              label: "Get API Key",
              href: "/developer-apis"
            }
          },
          {
            id: "step-1-2",
            title: "Review API Documentation",
            description: "Explore our comprehensive API documentation",
            completed: false,
            action: {
              label: "View API Docs",
              href: "/developer-apis/docs"
            }
          },
          {
            id: "step-1-3",
            title: "Test API Connection",
            description: "Verify your API credentials are working",
            completed: false,
            action: {
              label: "Test Connection",
              href: "/developer-apis"
            }
          }
        ],
        illustration: (
          <div className="relative w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-card rounded-lg shadow-md flex items-center justify-center border border-border">
                  <Key className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-success-foreground" />
                </div>
              </div>
            </div>
          </div>
        )
      })

      // Section 2: Integrate APIs
      sections.push({
        id: "section-2",
        title: "Integrate APIs",
        description: "Start integrating messaging APIs into your application",
        icon: <Code className="w-5 h-5" />,
        steps: [
          {
            id: "step-2-1",
            title: "Choose your API",
            description: "Select SMS, WhatsApp, Voice, or other APIs",
            completed: false,
            action: {
              label: "Browse APIs",
              href: "/developer-apis/listing"
            }
          },
          {
            id: "step-2-2",
            title: "Set up webhooks",
            description: "Configure webhooks to receive message status updates",
            completed: false,
            action: {
              label: "Configure Webhooks",
              href: "/developer-apis/docs"
            }
          },
          {
            id: "step-2-3",
            title: "Send your first API request",
            description: "Make your first API call to send a message",
            completed: false,
            action: {
              label: "Try SMS API",
              href: "/developer-apis/sms"
            }
          }
        ]
      })

      // Section 3: Advanced Features
      sections.push({
        id: "section-3",
        title: "Advanced Features",
        description: "Explore advanced API features and capabilities",
        icon: <Terminal className="w-5 h-5" />,
        steps: [
          {
            id: "step-3-1",
            title: "Explore SDKs and Libraries",
            description: "Use our SDKs for faster integration",
            completed: false,
            action: {
              label: "View SDKs",
              href: "/developer-apis/docs"
            }
          },
          {
            id: "step-3-2",
            title: "Set up OTP verification",
            description: "Implement OTP verification in your app",
            completed: false,
            action: {
              label: "OTP API",
              href: "/developer-apis/otp"
            }
          },
          {
            id: "step-3-3",
            title: "Configure rate limits",
            description: "Understand and manage API rate limits",
            completed: false,
            action: {
              label: "Rate Limits",
              href: "/developer-apis/docs"
            }
          }
        ]
      })
    }

    return sections
  }, [industry, channels, persona])

  // Helper function to get channel name
  function getChannelName(channelId: string): string {
    const channelMap: Record<string, string> = {
      "channel-1": "SMS",
      "channel-2": "WhatsApp",
      "channel-3": "Email",
      "channel-4": "Voice",
      "channel-5": "Messenger"
    }
    return channelMap[channelId] || channelId
  }

  // Calculate progress
  const totalSteps = setupSections.reduce((acc, section) => acc + section.steps.length, 0)
  const completedCount = completedSteps.size
  const progressPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  // Toggle step completion
  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stepId)) {
        newSet.delete(stepId)
      } else {
        newSet.add(stepId)
      }
      return newSet
    })
  }

  const containerClasses = inline 
    ? "relative w-full" 
    : "fixed bottom-6 right-6 z-50 w-full max-w-md"
  
  const containerStyle = inline 
    ? undefined 
    : { width: 'calc(25vw - 1.5rem)', minWidth: '480px', maxWidth: '600px' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={containerClasses}
      style={containerStyle}
    >
      {inline ? (
        // Inline mode: no card wrapper, collapsible sections
        <div className="space-y-3">
          {setupSections.map((section, sectionIndex) => {
            const isExpanded = expandedSection === section.id
            const sectionCompletedSteps = section.steps.filter(step => 
              completedSteps.has(step.id)
            ).length
            const allStepsCompleted = sectionCompletedSteps === section.steps.length

            return (
              <div
                key={section.id}
                className={cn(
                  "group border rounded-lg overflow-hidden bg-card transition-colors",
                  allStepsCompleted ? "border-border-success bg-muted" : "border-border"
                )}
              >
                {/* Section Header - Clickable to toggle */}
                <div
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-3 flex items-center justify-between cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                      allStepsCompleted 
                        ? "bg-success text-success-foreground border-border-success" 
                        : "bg-muted text-muted-foreground border-border"
                    )}>
                      {allStepsCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="[&>svg]:w-5 [&>svg]:h-5">
                          {section.icon}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-semibold truncate",
                        "text-sm"
                      )}>
                        {section.title}
                      </h3>
                      {section.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {section.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {sectionCompletedSteps}/{section.steps.length}
                      </Badge>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Section Content - Collapsible with animation */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-3 pb-3 space-y-2">
                        {section.steps.map((step, stepIndex) => {
                          const isCompleted = completedSteps.has(step.id)
                          
                          const isChannelConfigStep = step.id === "step-1-1"
                          const isSendCampaignStep = step.id === "step-1-3"
                          const isChannelConfigured = completedSteps.has("step-1-1")
                          const isLocked = isSendCampaignStep && !isChannelConfigured
                          
                          return (
                            <div
                              key={step.id}
                              className={cn(
                                "group relative flex items-start gap-3 p-3 rounded-lg border",
                                "overflow-hidden",
                                isCompleted 
                                  ? "border-border-success bg-success/10" 
                                  : "border-border bg-card"
                              )}
                            >
                              <div className="relative z-10 flex items-start gap-3 w-full">
                                <button
                                  onClick={() => !isLocked && toggleStepCompletion(step.id)}
                                  disabled={isLocked}
                                  className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                    isCompleted
                                      ? "border-success bg-success"
                                      : isLocked
                                        ? "border-muted-foreground/30 bg-muted cursor-not-allowed"
                                        : "border-border"
                                  )}
                                >
                                  {isCompleted && (
                                    <Check className="w-2.5 h-2.5 text-success-foreground" />
                                  )}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className={cn(
                                      "font-semibold text-sm",
                                      isCompleted && "line-through text-muted-foreground"
                                    )}>
                                      {step.title}
                                    </h4>
                                    {isLocked && (
                                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {step.description}
                                  </p>
                                  {step.action && !isCompleted && (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="inline-block mt-2">
                                            <Button
                                              variant="link"
                                              size="sm"
                                              className="text-sm h-auto p-0"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                if (!isLocked) {
                                                  window.location.href = step.action!.href
                                                }
                                              }}
                                              disabled={isLocked}
                                            >
                                              {step.action.label}
                                              <ChevronRight className="w-4 h-4 ml-0.5" />
                                            </Button>
                                          </span>
                                        </TooltipTrigger>
                                        {isLocked && (
                                          <TooltipContent>
                                            <p>You must configure a channel first</p>
                                          </TooltipContent>
                                        )}
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      ) : (
        // Floating widget mode: use Card wrapper
        <Card className="shadow-2xl border-2 border-border overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">Setup guide</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {totalSteps} tasks complete
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden border border-border">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                {isMinimized && (
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {progressPercentage}% complete
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardContent className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {setupSections.map((section, sectionIndex) => {
                  const isExpanded = expandedSection === section.id
                  const sectionCompletedSteps = section.steps.filter(step => 
                    completedSteps.has(step.id)
                  ).length
                  const allStepsCompleted = sectionCompletedSteps === section.steps.length

                  return (
                    <div
                      key={section.id}
                      className={cn(
                        "group border rounded-lg overflow-hidden transition-colors",
                        allStepsCompleted ? "border-border-success bg-muted" : "border-border"
                      )}
                    >
                      {/* Section Header */}
                      <div
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 flex items-center justify-between cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border",
                            allStepsCompleted 
                              ? "bg-success text-success-foreground border-border-success" 
                              : "bg-muted text-muted-foreground border-border"
                          )}>
                            {allStepsCompleted ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <span className="[&>svg]:w-4 [&>svg]:h-4">
                                {section.icon}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate text-sm">
                              {section.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {sectionCompletedSteps}/{section.steps.length}
                            </Badge>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Section Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-3 pb-3 space-y-2">
                              {section.steps.map((step, stepIndex) => {
                                const isCompleted = completedSteps.has(step.id)
                                
                                const isChannelConfigStep = step.id === "step-1-1"
                                const isSendCampaignStep = step.id === "step-1-3"
                                const isChannelConfigured = completedSteps.has("step-1-1")
                                const isLocked = isSendCampaignStep && !isChannelConfigured
                                
                                return (
                                  <div
                                    key={step.id}
                                    className={cn(
                                      "flex items-start gap-2 p-3 rounded-lg border",
                                      isCompleted 
                                        ? "border-border-success bg-success/10" 
                                        : "border-border bg-card"
                                    )}
                                  >
                                    <button
                                      onClick={() => !isLocked && toggleStepCompletion(step.id)}
                                      disabled={isLocked}
                                      className={cn(
                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                        isCompleted
                                          ? "border-success bg-success"
                                          : isLocked
                                            ? "border-muted-foreground/30 bg-muted cursor-not-allowed"
                                            : "border-border"
                                      )}
                                    >
                                      {isCompleted && (
                                        <Check className="w-2 h-2 text-success-foreground" />
                                      )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <h4 className={cn(
                                          "font-medium text-xs",
                                          isCompleted && "line-through text-muted-foreground"
                                        )}>
                                          {step.title}
                                        </h4>
                                        {isLocked && (
                                          <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                        {step.description}
                                      </p>
                                      {step.action && !isCompleted && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span className="inline-block mt-4">
                                                <Button
                                                  variant="link"
                                                  size="sm"
                                                  className="h-auto p-0 text-xs"
                                                  onClick={() => !isLocked && (window.location.href = step.action!.href)}
                                                  disabled={isLocked}
                                                >
                                                  {step.action.label}
                                                  <ChevronRight className="w-3 h-3 ml-0.5" />
                                                </Button>
                                              </span>
                                            </TooltipTrigger>
                                            {isLocked && (
                                              <TooltipContent>
                                                <p>You must configure a channel first</p>
                                              </TooltipContent>
                                            )}
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      )}
    </motion.div>
  )
}
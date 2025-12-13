import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Check, 
  ChevronDown,
  ChevronRight, 
  Users, 
  Send,
  Settings,
  Lock,
  Code,
  Briefcase,
  BookOpen,
  Terminal,
  Key,
  Webhook,
  FileCode
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
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
  icon?: React.ReactNode
  action?: {
    label: string
    href: string
  }
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
  inline?: boolean // Always true now, kept for backward compatibility
}

export function GettingStartedGuide({ 
  industry = "ecommerce",
  channels = [],
  goals = [],
  persona = "business",
  onDismiss,
  inline = true
}: GettingStartedGuideProps) {
  // LocalStorage keys - persona-specific
  const STORAGE_KEY_COMPLETED = `cequens-setup-guide-completed-steps-${persona}`
  const STORAGE_KEY_EXPANDED = `cequens-setup-guide-expanded-steps-${persona}`

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        const savedSteps = new Set<string>(parsed)
        // Automatically mark step-1 as completed if any channel is active (only for business persona)
        if (persona === "business" && hasActiveChannels()) {
          savedSteps.add("step-1")
        }
        return savedSteps
      } else {
        const steps = new Set<string>()
        // Automatically mark step-1 as completed if any channel is active (only for business persona)
        if (persona === "business" && hasActiveChannels()) {
          steps.add("step-1")
        }
        return steps
      }
    } catch {
      const steps = new Set<string>()
      // Automatically mark step-1 as completed if any channel is active (only for business persona)
      if (persona === "business" && hasActiveChannels()) {
        steps.add("step-1")
      }
      return steps
    }
  })


  // Initialize expanded steps - always start fresh, don't load from localStorage
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(() => {
    return new Set()
  })

  // Save completed steps to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(Array.from(completedSteps)))
    } catch (error) {
      console.error('Failed to save completed steps:', error)
    }
  }, [completedSteps, persona])

  // Listen for active channels changes and update step-1 completion (only for business persona)
  useEffect(() => {
    if (persona !== "business") return

    const handleActiveChannelsChange = () => {
      const hasActive = hasActiveChannels()
      setCompletedSteps(prev => {
        const newSet = new Set(prev)
        if (hasActive) {
          newSet.add("step-1")
        } else {
          newSet.delete("step-1")
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



  // Reset completed steps when persona changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        const savedSteps = new Set<string>(parsed)
        // Only auto-mark step-1 for business persona
        if (persona === "business" && hasActiveChannels()) {
          savedSteps.add("step-1")
        }
        setCompletedSteps(savedSteps)
      } else {
        const steps = new Set<string>()
        if (persona === "business" && hasActiveChannels()) {
          steps.add("step-1")
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

  // Generate personalized setup steps based on persona, industry and selections
  const setupSteps: SetupStep[] = React.useMemo(() => {
    const steps: SetupStep[] = []

    if (persona === "business") {
      // BUSINESS PERSONA (MARKETEER) STEPS
      
      // Step 1: Configure your channel
      steps.push({
        id: "step-1",
        title: "Configure your channel",
        description: channels.length > 0 
          ? `Set up channels with authentication and API settings. Enable multiple channels simultaneously. You can enable SMS, WhatsApp, Email, Voice, and Messenger channels based on your business needs.`
          : "Configure messaging channels (SMS, WhatsApp, Email, Voice, Messenger) with authentication credentials and API settings.",
        icon: <Send className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Configure channels",
          href: "/channels"
        }
      })

      // Step 2: Add your audience
      steps.push({
        id: "step-2",
        title: "Add your audience",
        description: "Import contacts from CSV or CRM, or add manually. Create targeted segments using demographics, purchase history, or custom attributes.",
        icon: <Users className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Add contacts",
          href: "/contacts"
        }
      })

      // Step 3: Send your campaign
      steps.push({
        id: "step-3",
        title: "Send your first campaign",
        description: "Create personalized campaigns with dynamic content. Schedule delivery times, segment audiences, and track open rates, clicks, and conversions.",
        icon: <Send className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Create campaign",
          href: "/campaigns/create"
        }
      })

      // Industry-specific steps for Business persona
      if (industry === "ecommerce") {
        steps.push({
          id: "step-4",
          title: "Connect your store",
          description: "Integrate Shopify, WooCommerce, or other platforms to sync customer data, orders, and products. Enable real-time webhooks for updates.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Browse integrations",
            href: "/settings/plugins"
          }
        })
        steps.push({
          id: "step-5",
          title: "Set up abandoned cart recovery",
          description: "Automatically send reminder messages to customers who abandoned carts. Customize timing, add discounts, and track recovery rates.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Configure automation",
            href: "/automation"
          }
        })
        steps.push({
          id: "step-6",
          title: "Create order notification templates",
          description: "Create automated order notification templates for confirmations, shipping updates, and delivery notifications with tracking links.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Create templates",
            href: "/campaigns/templates"
          }
        })
      } else if (industry === "healthcare") {
        steps.push({
          id: "step-4",
          title: "Set up appointment reminders",
          description: "Send automated appointment reminders 24 hours and 2 hours before appointments. Include confirmation and rescheduling options.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Configure automation",
            href: "/automation"
          }
        })
        steps.push({
          id: "step-5",
          title: "Create notification templates",
          description: "Create HIPAA-compliant templates for test results, prescriptions, medication reminders, and health alerts with secure messaging.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Create templates",
            href: "/campaigns/templates"
          }
        })
        steps.push({
          id: "step-6",
          title: "Configure HIPAA compliance",
          description: "Configure HIPAA-compliant settings with encryption, access controls, audit logging, and secure authentication for patient communications.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Security settings",
            href: "/settings/organization"
          }
        })
      } else if (industry === "finance") {
        steps.push({
          id: "step-4",
          title: "Set up transaction alerts",
          description: "Send real-time transaction alerts for deposits, withdrawals, transfers, and payments. Include transaction details and account balances.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Configure automation",
            href: "/automation"
          }
        })
        steps.push({
          id: "step-5",
          title: "Enable two-factor authentication",
          description: "Implement two-factor authentication using OTP via SMS or WhatsApp for login verification and transaction authorization.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Configure OTP",
            href: "/developer/apis/otp"
          }
        })
        steps.push({
          id: "step-6",
          title: "Create security notification templates",
          description: "Create security notification templates for suspicious activities, password changes, new device logins, and fraud alerts.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Create templates",
            href: "/campaigns/templates"
          }
        })
      } else {
        // Generic setup for other industries
        steps.push({
          id: "step-4",
          title: "Set up automation workflows",
          description: "Create automation workflows that trigger messages based on customer actions or events. Build multi-step sequences with conditional logic.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Configure automation",
            href: "/automation"
          }
        })
        steps.push({
          id: "step-5",
          title: "Create message templates",
          description: "Create reusable message templates with dynamic variables and media attachments. Organize by category for campaigns and workflows.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Create templates",
            href: "/campaigns/templates"
          }
        })
        steps.push({
          id: "step-6",
          title: "Configure integrations",
          description: "Connect CRM, help desk, analytics, and e-commerce platforms. Set up webhooks and API connections for data synchronization.",
          icon: <Settings className="w-5 h-5" />,
          completed: false,
          action: {
            label: "Browse integrations",
            href: "/settings/plugins"
          }
        })
      }

      // Team collaboration steps
      steps.push({
        id: "step-7",
        title: "Add team members",
        description: "Invite team members to collaborate on campaigns and manage contacts. Send invitations with role-based access and track activity.",
        icon: <Users className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Manage team",
          href: "/settings/organization"
        }
      })
      steps.push({
        id: "step-8",
        title: "Set up roles and permissions",
        description: "Configure role-based permissions for campaigns, contacts, templates, and analytics. Define custom roles to control team access.",
        icon: <Users className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Configure roles",
          href: "/settings/organization"
        }
      })
    } else {
      // API PERSONA (DEVELOPER) STEPS
      
      // Step 1: Generate API Key
      steps.push({
        id: "step-1",
        title: "Generate API Key",
        description: "Generate API keys for authentication. Create separate keys for development and production with IP restrictions and permissions.",
        icon: <Key className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Get API Key",
          href: "/developer-apis"
        }
      })

      // Step 2: Review API Documentation
      steps.push({
        id: "step-2",
        title: "Review API Documentation",
        description: "Review API documentation for endpoints, request formats, authentication, and error handling. Access code examples and test endpoints.",
        icon: <BookOpen className="w-5 h-5" />,
        completed: false,
        action: {
          label: "View API Docs",
          href: "/developer-apis/docs"
        }
      })

      // Step 3: Test API Connection
      steps.push({
        id: "step-3",
        title: "Test API Connection",
        description: "Test API credentials and connection using testing tools, curl, or Postman. Verify authentication and request formats before production.",
        icon: <Terminal className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Test Connection",
          href: "/developer-apis"
        }
      })

      // Step 4: Choose your API
      steps.push({
        id: "step-4",
        title: "Choose your API",
        description: "Choose from SMS, WhatsApp, Email, Voice, or Messenger APIs. Review capabilities, pricing, and features for your use case.",
        icon: <Code className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Browse APIs",
          href: "/developer-apis/listing"
        }
      })

      // Step 5: Set up webhooks
      steps.push({
        id: "step-5",
        title: "Set up webhooks",
        description: "Configure webhooks to receive real-time notifications for delivery status, receipts, and errors. Set up endpoints with authentication.",
        icon: <Webhook className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Configure Webhooks",
          href: "/developer-apis/docs"
        }
      })

      // Step 6: Send your first API request
      steps.push({
        id: "step-6",
        title: "Send your first API request",
        description: "Send your first test message using API sandbox or production endpoints. Track delivery status and handle errors with retry logic.",
        icon: <Send className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Try SMS API",
          href: "/developer-apis/sms"
        }
      })

      // Step 7: Explore SDKs and Libraries
      steps.push({
        id: "step-7",
        title: "Explore SDKs and Libraries",
        description: "Use official SDKs for JavaScript, Python, PHP, Java, Ruby, and Go. Pre-built functions handle authentication and error handling.",
        icon: <FileCode className="w-5 h-5" />,
        completed: false,
        action: {
          label: "View SDKs",
          href: "/developer-apis/docs"
        }
      })

      // Step 8: Set up OTP verification
      steps.push({
        id: "step-8",
        title: "Set up OTP verification",
        description: "Implement OTP verification for user authentication and 2FA. Configure generation, expiration, templates, and validation with retry logic.",
        icon: <Key className="w-5 h-5" />,
        completed: false,
        action: {
          label: "OTP API",
          href: "/developer-apis/otp"
        }
      })

      // Step 9: Configure rate limits
      steps.push({
        id: "step-9",
        title: "Configure rate limits",
        description: "Review rate limit policies for endpoints. Implement rate limit handling, exponential backoff, and request queuing strategies.",
        icon: <Settings className="w-5 h-5" />,
        completed: false,
        action: {
          label: "Rate Limits",
          href: "/developer-apis/docs"
        }
      })
    }

    return steps
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

  // Helper function to get step image name from step title
  function getStepImageName(stepTitle: string): string {
    // Convert title to filename: lowercase, replace spaces with hyphens, remove special chars
    const filename = stepTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
    return `${filename}.png`
  }

  // Helper function to check if a step is a goal step
  function isGoalStep(stepTitle: string): boolean {
    if (persona !== "business" || goals.length === 0) return false
    
    // Map goal IDs to step titles that should be tagged
    const goalStepMapping: Record<string, string[]> = {
      "goal-2": ["Send your first campaign"], // Marketing campaigns
      "goal-1": ["Add your audience", "Send your first campaign"], // Customer engagement
      "goal-3": ["Add your audience"], // Support automation
      "goal-4": ["Add your audience", "Send your first campaign"], // Lead generation
      "goal-6": ["Send your first campaign"], // Sales automation
      "goal-7": ["Add your audience", "Send your first campaign"], // Customer retention
      "goal-9": ["Configure your channel"], // Multi-channel messaging
    }
    
    // Check if any selected goal maps to this step title
    return goals.some(goalId => {
      const mappedSteps = goalStepMapping[goalId] || []
      return mappedSteps.includes(stepTitle)
    })
  }

  // Track if we've initialized expanded steps on this mount/persona
  const hasInitializedExpanded = React.useRef(false)
  
  // Reset initialization flag when persona changes
  useEffect(() => {
    hasInitializedExpanded.current = false
  }, [persona])
  
  // Initialize expanded steps - always expand first incomplete step on mount/refresh
  // This runs once when setupSteps is ready, ensuring we always start fresh on refresh
  useEffect(() => {
    if (!hasInitializedExpanded.current && setupSteps.length > 0) {
      hasInitializedExpanded.current = true
      const firstIncomplete = setupSteps.find(step => !completedSteps.has(step.id))
      if (firstIncomplete) {
        setExpandedSteps(new Set([firstIncomplete.id]))
      } else {
        // If all steps are completed, expand the first one
        setExpandedSteps(new Set([setupSteps[0].id]))
      }
    }
  }, [setupSteps.length, completedSteps.size, persona]) // Run when setupSteps, completedSteps, or persona changes

  // Auto-expand next incomplete step when a step is completed (if the completed step was expanded)
  useEffect(() => {
    // Find any completed step that is currently expanded
    const expandedCompletedStep = setupSteps.find(step => 
      completedSteps.has(step.id) && expandedSteps.has(step.id)
    )
    
    if (expandedCompletedStep) {
      const currentIndex = setupSteps.findIndex(step => step.id === expandedCompletedStep.id)
      const nextIncomplete = setupSteps.slice(currentIndex + 1).find(step => !completedSteps.has(step.id))
      
      if (nextIncomplete) {
        setExpandedSteps(prev => {
          const newExpanded = new Set(prev)
          newExpanded.delete(expandedCompletedStep.id) // Collapse the completed step
          newExpanded.add(nextIncomplete.id) // Expand the next incomplete step
          return newExpanded
        })
      } else {
        // If no next incomplete step, just collapse the completed one
        setExpandedSteps(prev => {
          const newExpanded = new Set(prev)
          newExpanded.delete(expandedCompletedStep.id)
          return newExpanded
        })
      }
    }
  }, [completedSteps, setupSteps]) // Run when completed steps or setup steps change

  // Save expanded steps to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify(Array.from(expandedSteps)))
    } catch (error) {
      console.error('Failed to save expanded steps:', error)
    }
  }, [expandedSteps, persona])


  // Toggle step expansion
  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stepId)) {
        newSet.delete(stepId)
      } else {
        newSet.add(stepId)
      }
      return newSet
    })
  }

  // Toggle step completion
  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev)
      const wasCompleted = newSet.has(stepId)
      
      if (wasCompleted) {
        newSet.delete(stepId)
      } else {
        newSet.add(stepId)
        
        // If step was just completed and was expanded, expand the next incomplete step
        if (expandedSteps.has(stepId)) {
          const currentIndex = setupSteps.findIndex(step => step.id === stepId)
          const nextIncomplete = setupSteps.slice(currentIndex + 1).find(step => !newSet.has(step.id))
          
          if (nextIncomplete) {
            setExpandedSteps(prev => {
              const newExpanded = new Set(prev)
              newExpanded.delete(stepId) // Collapse the completed step
              newExpanded.add(nextIncomplete.id) // Expand the next incomplete step
              return newExpanded
            })
          } else {
            // If no next incomplete step, just collapse the completed one
            setExpandedSteps(prev => {
              const newExpanded = new Set(prev)
              newExpanded.delete(stepId)
              return newExpanded
            })
          }
        }
      }
      
      return newSet
    })
  }

  // Helper function to render a step item
  const renderStepItem = (
    step: SetupStep,
    isCompleted: boolean,
    isExpanded: boolean,
    isLocked: boolean,
    variant: "inline" | "compact"
  ) => {
    const isInline = variant === "inline"
    const padding = isInline ? "p-4" : "p-3"
    const gap = isInline ? "gap-3" : "gap-2"
    const titleSize = isInline ? "font-semibold text-sm" : "font-medium text-xs"
    const descriptionSize = isInline ? "text-sm" : "text-xs"
    const checkboxSize = isInline ? "w-5 h-5" : "w-4 h-4"
    const checkIconSize = isInline ? "w-2.5 h-2.5" : "w-2 h-2"
    const lockIconSize = isInline ? "w-4 h-4" : "w-3 h-3"
    const chevronSize = isInline ? "w-4 h-4" : "w-3 h-3"
    const buttonVariant = isInline ? "default" : "link"
    const buttonSize = isInline ? "sm" : "sm"
    const buttonClassName = isInline ? "" : "h-auto p-0 text-xs"
    const buttonMargin = isInline ? "mt-8" : "mt-2"
    const contentPadding = isInline ? "pt-4" : "pt-1"
    const contentGap = isInline ? "gap-3" : "gap-2"

    // Use Card component for all steps
    const wrapperProps = { 
      className: "group overflow-hidden py-0" 
    }

    return (
      <Card
        key={step.id}
        {...wrapperProps}
      >
        {/* Step Header - Clickable to toggle expansion */}
        <div
          onClick={() => toggleStepExpansion(step.id)}
          className={cn("w-full flex items-start cursor-pointer text-left", padding, gap)}
        >
          {/* Column 1: Completion checkbox */}
          <div className="flex-shrink-0 flex items-start">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (!isLocked) {
                  toggleStepCompletion(step.id)
                }
              }}
              disabled={isLocked}
              className={cn(
                `${checkboxSize} rounded-full border-2 flex items-center justify-center`,
                isCompleted
                  ? "border-green-700 bg-green-700"
                  : isLocked
                    ? "border-muted-foreground/30 bg-muted cursor-not-allowed"
                    : "border-border"
              )}
            >
              {isCompleted && (
                <Check className={`${checkIconSize} text-white`} />
              )}
            </button>
          </div>

          {/* Column 2: Content (title, description, button) */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <h4 className={cn(
                titleSize,
                isCompleted && "line-through text-muted-foreground/60"
              )}>
                {step.title}
              </h4>
              {isGoalStep(step.title) && (
                <Badge variant="secondary" className="text-xs">
                  Goal
                </Badge>
              )}
              {isLocked && (
                <Lock className={`${lockIconSize} text-muted-foreground flex-shrink-0`} />
              )}
            </div>

            {/* Step Content - Collapsible with animation */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={cn("flex items-start", contentGap)}>
                    <div className={cn("flex-1 space-y-2", contentPadding)}>
                    <p className={cn(
                      descriptionSize,
                      isCompleted ? "text-muted-foreground/60" : "text-muted-foreground"
                    )}>
                      {step.description}
                    </p>
                    {step.action && !isCompleted && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cn("inline-block", buttonMargin)}>
                              <Button
                                variant={buttonVariant}
                                size={buttonSize}
                                className={buttonClassName}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!isLocked) {
                                    window.location.href = step.action!.href
                                  }
                                }}
                                disabled={isLocked}
                              >
                                {step.action.label}
                                <ChevronRight className={`${chevronSize} ml-0.5`} />
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

                    {/* Column 3: Visual - 24% of content column width */}
                    <div className="w-[24%] flex-shrink-0 flex items-start pt-1 hidden md:block">
                      <img 
                        src={`/steps/${getStepImageName(step.title)}`}
                        alt={step.title}
                        className="w-full aspect-square rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Column 4: Expand/Collapse icon */}
          <div className="flex-shrink-0 flex items-start pt-0.5">
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`${chevronSize} text-muted-foreground`} />
            </motion.div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative w-full"
    >
      <div className="space-y-3">
        {setupSteps.map((step) => {
          const isCompleted = completedSteps.has(step.id)
          const isExpanded = expandedSteps.has(step.id)
          const isSendCampaignStep = step.id === "step-3"
          const isChannelConfigured = completedSteps.has("step-1")
          const isLocked = isSendCampaignStep && !isChannelConfigured
          
          return renderStepItem(step, isCompleted, isExpanded, isLocked, "inline")
        })}
      </div>
    </motion.div>
  )
}
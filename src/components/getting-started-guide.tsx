import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  IconCheck, 
  IconChevronDown, 
  IconChevronRight, 
  IconMessage, 
  IconUsers, 
  IconSend,
  IconSettings,
  IconSparkles,
  IconMinimize,
  IconMaximize,
  IconLock
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { smoothTransition } from "@/lib/transitions"
import { cn } from "@/lib/utils"
import { Alert } from "./ui/alert"
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

// Props interface
interface GettingStartedGuideProps {
  industry?: string
  channels?: string[]
  goals?: string[]
  onDismiss?: () => void
}

export function GettingStartedGuide({ 
  industry = "ecommerce",
  channels = [],
  goals = [],
  onDismiss 
}: GettingStartedGuideProps) {
  // LocalStorage keys
  const STORAGE_KEY_COMPLETED = 'cequens-setup-guide-completed-steps'
  const STORAGE_KEY_MINIMIZED = 'cequens-setup-guide-minimized'
  const STORAGE_KEY_EXPANDED = 'cequens-setup-guide-expanded-section'

  // Initialize state from localStorage
  const [expandedSection, setExpandedSection] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPANDED)
      return saved ? saved : "section-1"
    } catch {
      return "section-1"
    }
  })

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPLETED)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
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
  }, [completedSteps, STORAGE_KEY_COMPLETED])

  // Save minimized state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MINIMIZED, String(isMinimized))
    } catch (error) {
      console.error('Failed to save minimized state:', error)
    }
  }, [isMinimized, STORAGE_KEY_MINIMIZED])

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
  }, [expandedSection, STORAGE_KEY_EXPANDED])

  // Generate personalized setup sections based on industry and selections
  const setupSections: SetupSection[] = React.useMemo(() => {
    const sections: SetupSection[] = []

    // Section 1: Send your first campaign (always included)
    sections.push({
      id: "section-1",
      title: "Send your first campaign",
      description: "Get started by sending your first message to customers",
      icon: <IconSend className="w-5 h-5" />,
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
        <div className="relative w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
                <IconSend className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <IconCheck className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      )
    })

    // Section 2: Industry-specific setup
    if (industry === "ecommerce") {
      sections.push({
        id: "section-2",
        title: "Set up your store",
        description: "Configure your e-commerce integrations",
        icon: <IconSettings className="w-5 h-5" />,
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
        icon: <IconSettings className="w-5 h-5" />,
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
        icon: <IconSettings className="w-5 h-5" />,
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
        icon: <IconSettings className="w-5 h-5" />,
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
      icon: <IconUsers className="w-5 h-5" />,
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

    return sections
  }, [industry, channels])

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 w-full max-w-md"
      style={{ width: 'calc(25vw - 1.5rem)', minWidth: '480px', maxWidth: '600px' }}
    >
      <Card className="shadow-2xl border-2 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <IconSparkles className="w-5 h-5 text-primary" />
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
                  <IconMaximize className="h-4 w-4" />
                ) : (
                  <IconMinimize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
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
              <CardContent className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
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
                        "border rounded-lg overflow-hidden transition-colors",
                        allStepsCompleted ? "border-green-200 bg-green-50/50" : "border-gray-200"
                      )}
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                            allStepsCompleted 
                              ? "bg-green-600 text-white" 
                              : "bg-gray-100 text-gray-600"
                          )}>
                            {allStepsCompleted ? (
                              <IconCheck className="w-4 h-4" />
                            ) : (
                              section.icon
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm truncate">
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
                              <IconChevronDown className="w-4 h-4 text-gray-400" />
                            </motion.div>
                          </div>
                        </div>
                      </button>

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
                              {/* Steps */}
                              {section.steps.map((step, stepIndex) => {
                                const isCompleted = completedSteps.has(step.id)
                                
                                // Check if this is the "Send campaign" step and if channel is configured
                                const isChannelConfigStep = step.id === "step-1-1"
                                const isSendCampaignStep = step.id === "step-1-3"
                                const isChannelConfigured = completedSteps.has("step-1-1")
                                const isLocked = isSendCampaignStep && !isChannelConfigured
                                
                                return (
                                  <div
                                    key={step.id}
                                    className={cn(
                                      "flex items-start gap-2 p-3 rounded-lg border transition-colors",
                                      isCompleted 
                                        ? "border-green-200 bg-green-50/50" 
                                        : "border-gray-100 bg-white hover:bg-gray-50/50"
                                    )}
                                  >
                                    <button
                                      onClick={() => !isLocked && toggleStepCompletion(step.id)}
                                      disabled={isLocked}
                                      className={cn(
                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                                        isCompleted
                                          ? "border-green-600 bg-green-600"
                                          : isLocked
                                          ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                                          : "border-gray-300 hover:border-primary"
                                      )}
                                    >
                                      {isCompleted && (
                                        <IconCheck className="w-2.5 h-2.5 text-white" />
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
                                          <IconLock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
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
                                                  <IconChevronRight className="w-3 h-3 ml-0.5" />
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
    </motion.div>
  )
}
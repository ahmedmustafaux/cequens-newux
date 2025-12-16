import * as React from "react"
import { useMemo } from "react"
import { Sparkles, User, Megaphone, Code, Inbox, ChevronRight, ChevronLeft } from "lucide-react"
import { ChatText, EnvelopeSimple } from "phosphor-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { workflowTemplates, type WorkflowTemplate, type AppIcon } from "@/data/home-templates"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/contexts/onboarding-context"

interface RecommendedTemplatesProps {
  className?: string
  isLoading?: boolean
}

export function RecommendedTemplates({ className, isLoading = false }: RecommendedTemplatesProps) {
  const { onboardingData } = useOnboarding()
  const [activeTab, setActiveTab] = React.useState("for-you")
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  // Filter templates based on active tab
  const filteredTemplates = useMemo(() => {
    let templates = workflowTemplates

    if (activeTab === "for-you") {
      // Show a mix from every category, personalized to user
      // Prioritize templates that match user's industry, goals, and channels
      if (onboardingData) {
        const personalizedTemplates = templates.filter((template) => {
          const matchesIndustry = !template.industries || 
            !onboardingData.industry ||
            template.industries.includes(onboardingData.industry)
          
          const matchesGoals = !template.goals || 
            !onboardingData.goals ||
            onboardingData.goals.length === 0 ||
            template.goals.some(goal => onboardingData.goals?.includes(goal))
          
          const matchesChannels = !template.channels ||
            !onboardingData.channels ||
            onboardingData.channels.length === 0 ||
            template.channels.some(channel => onboardingData.channels?.includes(channel))
          
          return matchesIndustry && matchesGoals && matchesChannels
        })
        
        // If we have personalized matches, show those first, then a mix of others
        if (personalizedTemplates.length > 0) {
          const otherTemplates = templates.filter(t => !personalizedTemplates.includes(t))
          // Mix in some from each category
          const aiTemplates = otherTemplates.filter(t => t.isAIPowered).slice(0, 2)
          const broadcastTemplates = otherTemplates.filter(t => 
            t.tags?.includes("Campaigns")
          ).slice(0, 2)
          const apiTemplates = otherTemplates.filter(t => 
            t.tags?.includes("API") && !t.isAIPowered && !t.tags?.includes("Campaigns") && !t.tags?.includes("Inbox")
          ).slice(0, 2)
          const inboxTemplates = otherTemplates.filter(t => 
            t.tags?.includes("Inbox")
          ).slice(0, 2)
          
          templates = [
            ...personalizedTemplates,
            ...aiTemplates,
            ...broadcastTemplates,
            ...apiTemplates,
            ...inboxTemplates
          ]
        }
      }
      // If no onboarding data, show a diverse mix
    } else if (activeTab === "broadcasting") {
      // Show campaigns templates
      templates = templates.filter(t => 
        t.tags?.includes("Campaigns")
      )
    } else if (activeTab === "ai-powered") {
      // Show AI-powered templates
      templates = templates.filter(t => t.isAIPowered)
    } else if (activeTab === "apis") {
      // Show API-related templates
      templates = templates.filter(t => 
        t.tags?.includes("API")
      )
    } else if (activeTab === "inbox") {
      // Show inbox-related templates
      templates = templates.filter(t => 
        t.tags?.includes("Inbox")
      )
    }

    return templates
  }, [activeTab, onboardingData])

  // Check scroll position and update button visibility
  const checkScrollPosition = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  // Check scroll position on mount and when templates change
  React.useEffect(() => {
    // Use requestAnimationFrame to ensure layout is complete
    const checkAfterLayout = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          checkScrollPosition()
        })
      })
    }
    
    checkAfterLayout()
    // Also check after a short delay to ensure layout is complete
    const timer = setTimeout(checkScrollPosition, 200)
    return () => clearTimeout(timer)
  }, [filteredTemplates, activeTab, checkScrollPosition])

  // Add scroll event listener and ResizeObserver
  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollPosition)
      // Also listen for resize events
      window.addEventListener("resize", checkScrollPosition)
      
      // Use ResizeObserver to detect when container size changes
      const resizeObserver = new ResizeObserver(() => {
        checkScrollPosition()
      })
      resizeObserver.observe(container)
      
      return () => {
        container.removeEventListener("scroll", checkScrollPosition)
        window.removeEventListener("resize", checkScrollPosition)
        resizeObserver.disconnect()
      }
    }
  }, [checkScrollPosition])

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const renderAppIcons = (apps: AppIcon[]) => {
    const renderAppIcon = (app: AppIcon) => {
      if (app.iconType === "svg") {
        return <img src={app.icon} alt={app.name} className="w-5 h-5" />
      } else if (app.iconType === "component") {
        if (app.icon === "ChatText") {
          return <ChatText weight="fill" className="w-5 h-5 text-primary" />
        } else if (app.icon === "EnvelopeSimple") {
          return <EnvelopeSimple weight="fill" className="w-5 h-5 text-primary" />
        }
      } else if (app.iconType === "emoji") {
        return <span className={app.color}>{app.icon}</span>
      } else {
        return <span className={cn("text-sm font-bold", app.color)}>{app.icon}</span>
      }
      return <span className="text-sm">{app.icon}</span>
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        {apps.map((app, index) => (
          <React.Fragment key={app.name}>
            <div className={cn(
              "w-8 h-8 rounded-lg border flex items-center justify-center",
              app.bgColor || "bg-background"
            )}>
              {renderAppIcon(app)}
            </div>
            {index < apps.length - 1 && apps.length > 1 && (
              <span className="text-muted-foreground text-xs">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Explore Solutions</h2>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pr-0">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="for-you" className="gap-1.5" disabled={isLoading}>
            <User className="w-4 h-4" />
            For you
          </TabsTrigger>
          <TabsTrigger value="broadcasting" className="gap-1.5" disabled={isLoading}>
            <Megaphone className="w-4 h-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="ai-powered" className="gap-1.5" disabled={isLoading}>
            <Sparkles className="w-4 h-4" />
            AI Powered apps
          </TabsTrigger>
          <TabsTrigger value="apis" className="gap-1.5" disabled={isLoading}>
            <Code className="w-4 h-4" />
            APIs
          </TabsTrigger>
          <TabsTrigger value="inbox" className="gap-1.5" disabled={isLoading}>
            <Inbox className="w-4 h-4" />
            Inbox
          </TabsTrigger>
        </TabsList>

        {/* Template Cards */}
        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="min-w-[280px] max-w-[280px]">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-8 w-24 mb-3" />
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
          <div className="relative">
            {/* Left gradient overlay */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card via-card/80 to-transparent pointer-events-none z-10" />
            )}

            {/* Right gradient overlay */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-card via-card/80 to-transparent pointer-events-none z-10" />
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto hide-scrollbar"
            >
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="min-w-[280px] max-w-[280px] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    // Navigate to template detail or create workflow
                  }}
                >
                  <CardHeader className="pb-3">
                    {/* App Icons */}
                    <div className="mb-3">
                      {renderAppIcons(template.apps)}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm font-medium leading-snug line-clamp-2">
                      {template.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Tags badges */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {template.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={cn(
                              "text-xs",
                              tag === "AI Powered"
                                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                                : tag === "Campaigns"
                                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400"
                                : tag === "API"
                                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                                : tag === "Inbox"
                                ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-400"
                                : "border-border bg-muted text-muted-foreground"
                            )}
                          >
                            {tag === "AI Powered" && <Sparkles className="w-3 h-3 mr-1" />}
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scroll left button */}
            {canScrollLeft && (
              <button
                onClick={handleScrollLeft}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-accent transition-colors z-20 cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Scroll right button */}
            {canScrollRight && (
              <button
                onClick={handleScrollRight}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-accent transition-colors z-20 cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          )}
        </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

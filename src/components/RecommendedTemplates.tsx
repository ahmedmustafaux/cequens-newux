import * as React from "react"
import { useMemo, useCallback } from "react"
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

// Badge configuration
const BADGE_CONFIG: Record<string, { styles: string; icon: React.ReactNode }> = {
  "AI Powered": {
    styles: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400",
    icon: <Sparkles className="w-3 h-3 mr-1" />
  },
  "Campaigns": {
    styles: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-400",
    icon: <Megaphone className="w-3 h-3 mr-1" />
  },
  "API": {
    styles: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-400",
    icon: <Code className="w-3 h-3 mr-1" />
  },
  "Inbox": {
    styles: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400",
    icon: <Inbox className="w-3 h-3 mr-1" />
  }
}

// App icon component mapping
const APP_ICON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  ChatText,
  EnvelopeSimple
}

// Helper functions for template filtering
const matchesOnboarding = (template: WorkflowTemplate, onboardingData: any) => {
  const matchesIndustry = !template.industries || !onboardingData.industry || 
    template.industries.includes(onboardingData.industry)
  const matchesGoals = !template.goals || !onboardingData.goals?.length || 
    template.goals.some(goal => onboardingData.goals.includes(goal))
  const matchesChannels = !template.channels || !onboardingData.channels?.length || 
    template.channels.some(channel => onboardingData.channels.includes(channel))
  return matchesIndustry && matchesGoals && matchesChannels
}

const getTemplatesByCategory = (templates: WorkflowTemplate[], count: number = 3) => ({
  ai: templates.filter(t => t.isAIPowered).slice(0, count),
  campaigns: templates.filter(t => t.tags?.includes("Campaigns")).slice(0, count),
  api: templates.filter(t => 
    t.tags?.includes("API") && !t.isAIPowered && 
    !t.tags?.includes("Campaigns") && !t.tags?.includes("Inbox")
  ).slice(0, count),
  inbox: templates.filter(t => t.tags?.includes("Inbox")).slice(0, count)
})

const filterTemplatesByTab = (tab: string, templates: WorkflowTemplate[]) => {
  switch (tab) {
    case "broadcasting":
      return templates.filter(t => t.tags?.includes("Campaigns") && !t.isAIPowered)
    case "ai-powered":
      return templates.filter(t => t.isAIPowered && !t.tags?.includes("Inbox"))
    case "apis":
      return templates.filter(t => 
        t.tags?.includes("API") && !t.tags?.includes("Campaigns") && 
        !t.tags?.includes("Inbox") && !t.isAIPowered
      )
    case "inbox":
      return templates.filter(t => t.tags?.includes("Inbox"))
    default:
      return templates
  }
}

export function RecommendedTemplates({ className, isLoading = false }: RecommendedTemplatesProps) {
  const { onboardingData } = useOnboarding()
  const [activeTab, setActiveTab] = React.useState("for-you")
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const tabsScrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const [canScrollLeftTabs, setCanScrollLeftTabs] = React.useState(false)
  const [canScrollRightTabs, setCanScrollRightTabs] = React.useState(false)

  // Filter templates based on active tab
  const filteredTemplates = useMemo(() => {
    if (activeTab === "for-you") {
      if (onboardingData) {
        const personalized = workflowTemplates.filter(t => matchesOnboarding(t, onboardingData))
        if (personalized.length > 0) {
          const others = workflowTemplates.filter(t => !personalized.includes(t))
          const categories = getTemplatesByCategory(others, 2)
          return [...personalized, ...categories.ai, ...categories.campaigns, ...categories.api, ...categories.inbox]
        }
      }
      const categories = getTemplatesByCategory(workflowTemplates, 3)
      return [...categories.ai, ...categories.campaigns, ...categories.api, ...categories.inbox]
    }
    return filterTemplatesByTab(activeTab, workflowTemplates)
  }, [activeTab, onboardingData])

  // Get badge config for a tag
  const getBadgeConfig = (tag: string) => {
    return BADGE_CONFIG[tag] || { styles: "border-border bg-muted text-muted-foreground", icon: null }
  }

  // Generic scroll position checker
  const checkScroll = useCallback((container: HTMLElement | null, setLeft: (v: boolean) => void, setRight: (v: boolean) => void) => {
    if (!container) return
    const { scrollLeft, scrollWidth, clientWidth } = container
    setLeft(scrollLeft > 0.5)
    setRight(scrollLeft < scrollWidth - clientWidth - 0.5)
  }, [])

  const checkScrollPosition = useCallback(() => {
    checkScroll(scrollContainerRef.current, setCanScrollLeft, setCanScrollRight)
  }, [checkScroll])

  const checkTabsScrollPosition = useCallback(() => {
    checkScroll(tabsScrollContainerRef.current, setCanScrollLeftTabs, setCanScrollRightTabs)
  }, [checkScroll])

  // Check scroll position when content changes or loads
  React.useEffect(() => {
    if (isLoading) return
    
    const checkAfterLayout = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          checkScrollPosition()
          checkTabsScrollPosition()
        })
      })
    }
    
    checkAfterLayout()
    const timer = setTimeout(() => {
      checkScrollPosition()
      checkTabsScrollPosition()
    }, 200)
    return () => clearTimeout(timer)
  }, [filteredTemplates, activeTab, isLoading, checkScrollPosition, checkTabsScrollPosition])

  // Setup scroll and resize listeners
  React.useEffect(() => {
    const setupListeners = (container: HTMLElement | null, checkFn: () => void) => {
      if (!container) return () => {}
      
      let rafId: number | null = null
      const handleScroll = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            checkFn()
            rafId = null
          })
        }
      }
      
      const handleResize = () => checkFn()
      const resizeObserver = new ResizeObserver(checkFn)
      
      container.addEventListener("scroll", handleScroll, { passive: true })
      window.addEventListener("resize", handleResize)
      resizeObserver.observe(container)
      
      return () => {
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
        resizeObserver.disconnect()
        if (rafId !== null) cancelAnimationFrame(rafId)
      }
    }
    
    const cleanup1 = setupListeners(scrollContainerRef.current, checkScrollPosition)
    const cleanup2 = setupListeners(tabsScrollContainerRef.current, checkTabsScrollPosition)
    
    return () => {
      cleanup1()
      cleanup2()
    }
  }, [checkScrollPosition, checkTabsScrollPosition])

  const SCROLL_STEP = 256
  const TABS_SCROLL_STEP = 200

  const createScrollHandler = (container: React.RefObject<HTMLDivElement | null>, step: number, checkFn: () => void) => {
    return (direction: "left" | "right") => {
      if (!container.current) return
      container.current.scrollBy({ 
        left: direction === "left" ? -step : step, 
        behavior: "smooth" 
      })
      setTimeout(checkFn, 300)
    }
  }

  const handleScroll = createScrollHandler(scrollContainerRef, SCROLL_STEP, checkScrollPosition)
  const handleTabsScroll = createScrollHandler(tabsScrollContainerRef, TABS_SCROLL_STEP, checkTabsScrollPosition)

  const renderAppIcon = (app: AppIcon) => {
    if (app.iconType === "svg") {
      return <img src={app.icon} alt={app.name} className="w-5 h-5" />
    }
    if (app.iconType === "component") {
      const IconComponent = APP_ICON_COMPONENTS[app.icon]
      return IconComponent ? (
        <IconComponent weight="fill" className="w-5 h-5 text-primary" />
      ) : null
    }
    if (app.iconType === "emoji") {
      return <span className={app.color}>{app.icon}</span>
    }
    return <span className={cn("text-sm font-bold", app.color)}>{app.icon}</span>
  }

  const renderAppIcons = (apps: AppIcon[]) => (
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
        <div className="relative">
          {isLoading ? (
            <div className="bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton 
                  key={i} 
                  className="h-[calc(100%-1px)] rounded-md px-2 py-1"
                  style={{ width: `${60 + Math.random() * 40}px` }}
                />
              ))}
            </div>
          ) : (
            <>
              <div
                ref={tabsScrollContainerRef}
                className="overflow-x-auto hide-scrollbar relative"
              >
                <TabsList className="inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] gap-2">
                  <TabsTrigger value="for-you" className="gap-1.5">
                    <User className="w-4 h-4" />
                    For you
                  </TabsTrigger>
                  <TabsTrigger value="broadcasting" className="gap-1.5">
                    <Megaphone className="w-4 h-4" />
                    Campaigns
                  </TabsTrigger>
                  <TabsTrigger value="ai-powered" className="gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    AI Powered apps
                  </TabsTrigger>
                  <TabsTrigger value="apis" className="gap-1.5">
                    <Code className="w-4 h-4" />
                    APIs
                  </TabsTrigger>
                  <TabsTrigger value="inbox" className="gap-1.5">
                    <Inbox className="w-4 h-4" />
                    Inbox
                  </TabsTrigger>
                </TabsList>

                {/* Left gradient overlay for tabs */}
                {canScrollLeftTabs && (
                  <div className="absolute left-0 top-0 h-9 w-16 bg-gradient-to-r from-card via-card/80 to-transparent pointer-events-none z-10" />
                )}

                {/* Right gradient overlay for tabs */}
                {canScrollRightTabs && (
                  <div className="absolute right-0 top-0 h-9 w-16 bg-gradient-to-l from-card via-card/80 to-transparent pointer-events-none z-10" />
                )}

                {/* Scroll buttons for tabs */}
                {canScrollLeftTabs && (
                  <button
                    onClick={() => handleTabsScroll("left")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-accent transition-colors z-20 cursor-pointer"
                    aria-label="Scroll tabs left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {canScrollRightTabs && (
                  <button
                    onClick={() => handleTabsScroll("right")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-accent transition-colors z-20 cursor-pointer"
                    aria-label="Scroll tabs right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Template Cards */}
        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-[320px]">
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
            <div 
              className={cn(
                "absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-card via-card/80 to-transparent pointer-events-none z-10 transition-opacity",
                canScrollLeft ? "opacity-100" : "opacity-0"
              )}
            />

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
                  className="w-[320px] flex flex-col cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
                  onClick={() => {
                    // Navigate to template detail or create workflow
                  }}
                >
                  <CardHeader className="pb-3 flex-shrink-0">
                    {/* App Icons */}
                    <div className="mb-3">
                      {renderAppIcons(template.apps)}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-[2.5rem]">
                      {template.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="pt-0 flex-shrink-0">
                    {/* Tags badges */}
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {template.tags.map((tag) => {
                          const config = getBadgeConfig(tag)
                          return (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={cn("text-xs font-medium", config.styles)}
                            >
                              {config.icon}
                              {tag}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scroll buttons */}
            <button
              onClick={() => handleScroll("left")}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-accent transition-all z-20 cursor-pointer",
                canScrollLeft 
                  ? "opacity-100 translate-x-0 pointer-events-auto" 
                  : "opacity-0 -translate-x-2 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {canScrollRight && (
              <button
                onClick={() => handleScroll("right")}
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

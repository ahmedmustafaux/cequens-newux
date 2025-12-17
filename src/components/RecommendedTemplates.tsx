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
  const tabsScrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const [canScrollLeftTabs, setCanScrollLeftTabs] = React.useState(false)
  const [canScrollRightTabs, setCanScrollRightTabs] = React.useState(false)

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
      } else {
        // If no onboarding data, show a diverse mix from all categories
        const aiTemplates = templates.filter(t => t.isAIPowered).slice(0, 3)
        const broadcastTemplates = templates.filter(t => 
          t.tags?.includes("Campaigns")
        ).slice(0, 3)
        const apiTemplates = templates.filter(t => 
          t.tags?.includes("API") && !t.isAIPowered && !t.tags?.includes("Campaigns") && !t.tags?.includes("Inbox")
        ).slice(0, 3)
        const inboxTemplates = templates.filter(t => 
          t.tags?.includes("Inbox")
        ).slice(0, 3)
        
        templates = [
          ...aiTemplates,
          ...broadcastTemplates,
          ...apiTemplates,
          ...inboxTemplates
        ]
      }
    } else if (activeTab === "broadcasting") {
      // Show only campaigns templates (exclude AI-powered campaigns from other tabs)
      templates = templates.filter(t => 
        t.tags?.includes("Campaigns") && !t.isAIPowered
      )
    } else if (activeTab === "ai-powered") {
      // Show only AI-powered templates (exclude inbox AI from this tab)
      templates = templates.filter(t => 
        t.isAIPowered && !t.tags?.includes("Inbox")
      )
    } else if (activeTab === "apis") {
      // Show API-related templates (exclude campaigns and inbox)
      templates = templates.filter(t => 
        t.tags?.includes("API") && 
        !t.tags?.includes("Campaigns") && 
        !t.tags?.includes("Inbox") &&
        !t.isAIPowered
      )
    } else if (activeTab === "inbox") {
      // Show inbox-related templates only
      templates = templates.filter(t => 
        t.tags?.includes("Inbox")
      )
    }

    return templates
  }, [activeTab, onboardingData])

  // Get badge styling based on product/tag
  const getBadgeStyles = (tag: string) => {
    switch (tag) {
      case "AI Powered":
        return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
      case "Campaigns":
        return "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-400"
      case "API":
        return "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-400"
      case "Inbox":
        return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400"
      default:
        return "border-border bg-muted text-muted-foreground"
    }
  }

  // Get badge icon based on tag
  const getBadgeIcon = (tag: string) => {
    switch (tag) {
      case "AI Powered":
        return <Sparkles className="w-3 h-3 mr-1" />
      case "Campaigns":
        return <Megaphone className="w-3 h-3 mr-1" />
      case "API":
        return <Code className="w-3 h-3 mr-1" />
      case "Inbox":
        return <Inbox className="w-3 h-3 mr-1" />
      default:
        return null
    }
  }

  // Check scroll position and update button visibility
  const checkScrollPosition = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      // Use a small threshold (0.5) to account for sub-pixel scrolling
      setCanScrollLeft(scrollLeft > 0.5)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 0.5)
    }
  }, [])

  // Check tabs scroll position and update button visibility
  const checkTabsScrollPosition = React.useCallback(() => {
    if (tabsScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsScrollContainerRef.current
      // Use a small threshold (0.5) to account for sub-pixel scrolling
      setCanScrollLeftTabs(scrollLeft > 0.5)
      setCanScrollRightTabs(scrollLeft < scrollWidth - clientWidth - 0.5)
    }
  }, [])

  // Check scroll position when loading finishes
  React.useEffect(() => {
    if (isLoading) return
    
    // Use requestAnimationFrame to ensure layout is complete after loading
    const checkAfterLayout = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          checkScrollPosition()
          checkTabsScrollPosition()
        })
      })
    }
    
    checkAfterLayout()
    // Also check after a short delay to ensure layout is complete
    const timer = setTimeout(() => {
      checkScrollPosition()
      checkTabsScrollPosition()
    }, 300)
    return () => clearTimeout(timer)
  }, [isLoading, checkScrollPosition, checkTabsScrollPosition])

  // Check scroll position on mount and when templates change
  React.useEffect(() => {
    // Don't check if loading, wait until content is rendered
    if (isLoading) return
    
    // Use requestAnimationFrame to ensure layout is complete
    const checkAfterLayout = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          checkScrollPosition()
          checkTabsScrollPosition()
        })
      })
    }
    
    checkAfterLayout()
    // Also check after a short delay to ensure layout is complete
    const timer = setTimeout(() => {
      checkScrollPosition()
      checkTabsScrollPosition()
    }, 200)
    return () => clearTimeout(timer)
  }, [filteredTemplates, activeTab, isLoading, checkScrollPosition, checkTabsScrollPosition])

  // Add scroll event listener and ResizeObserver
  React.useEffect(() => {
    const container = scrollContainerRef.current
    const tabsContainer = tabsScrollContainerRef.current
    
    const cleanupFunctions: (() => void)[] = []
    
    if (container) {
      // Use requestAnimationFrame for smoother scroll detection
      let rafId: number | null = null
      const handleScroll = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            checkScrollPosition()
            rafId = null
          })
        }
      }
      container.addEventListener("scroll", handleScroll, { passive: true })
      const handleResize = () => checkScrollPosition()
      window.addEventListener("resize", handleResize)
      
      const resizeObserver = new ResizeObserver(() => {
        checkScrollPosition()
      })
      resizeObserver.observe(container)
      
      cleanupFunctions.push(() => {
        container.removeEventListener("scroll", handleScroll)
        window.removeEventListener("resize", handleResize)
        resizeObserver.disconnect()
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }
      })
    }
    
    if (tabsContainer) {
      tabsContainer.addEventListener("scroll", checkTabsScrollPosition)
      const handleTabsResize = () => checkTabsScrollPosition()
      window.addEventListener("resize", handleTabsResize)
      
      const tabsResizeObserver = new ResizeObserver(() => {
        checkTabsScrollPosition()
      })
      tabsResizeObserver.observe(tabsContainer)
      
      cleanupFunctions.push(() => {
        tabsContainer.removeEventListener("scroll", checkTabsScrollPosition)
        window.removeEventListener("resize", handleTabsResize)
        tabsResizeObserver.disconnect()
      })
    }
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [checkScrollPosition, checkTabsScrollPosition])

  const SCROLL_STEP = 240 + 16

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" })
      // Check immediately and after animation
      checkScrollPosition()
      setTimeout(() => {
        checkScrollPosition()
      }, 300)
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: SCROLL_STEP, behavior: "smooth" })
      // Check immediately and after animation completes
      checkScrollPosition()
      setTimeout(() => {
        checkScrollPosition()
      }, 300)
    }
  }

  const handleTabsScrollLeft = () => {
    if (tabsScrollContainerRef.current) {
      tabsScrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
      // Check immediately and after animation
      checkTabsScrollPosition()
      setTimeout(() => {
        checkTabsScrollPosition()
      }, 300)
    }
  }

  const handleTabsScrollRight = () => {
    if (tabsScrollContainerRef.current) {
      tabsScrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
      // Check immediately and after animation completes
      checkTabsScrollPosition()
      setTimeout(() => {
        checkTabsScrollPosition()
      }, 300)
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

                {/* Scroll left button for tabs */}
                {canScrollLeftTabs && (
                  <button
                    onClick={handleTabsScrollLeft}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-accent transition-colors z-20 cursor-pointer"
                    aria-label="Scroll tabs left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {/* Scroll right button for tabs */}
                {canScrollRightTabs && (
                  <button
                    onClick={handleTabsScrollRight}
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
                        {template.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={cn(
                              "text-xs font-medium",
                              getBadgeStyles(tag)
                            )}
                          >
                            {getBadgeIcon(tag)}
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
            <button
              onClick={handleScrollLeft}
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

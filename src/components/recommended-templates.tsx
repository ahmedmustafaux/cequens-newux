import * as React from "react"
import { useMemo } from "react"
import { Sparkles, User, Star, ChevronRight, ChevronLeft } from "lucide-react"
import { ChatText, EnvelopeSimple } from "phosphor-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { workflowTemplates, type WorkflowTemplate, type AppIcon } from "@/data/home-templates"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/contexts/onboarding-context"

interface RecommendedTemplatesProps {
  className?: string
}

export function RecommendedTemplates({ className }: RecommendedTemplatesProps) {
  const { onboardingData } = useOnboarding()
  const [activeTab, setActiveTab] = React.useState("for-you")
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  // Filter templates based on user's onboarding data
  const filteredTemplates = useMemo(() => {
    let templates = workflowTemplates

    if (activeTab === "for-you" && onboardingData) {
      // Filter by user's industry, goals, and channels
      templates = templates.filter((template) => {
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
      
      // If no matches, show all templates
      if (templates.length === 0) {
        templates = workflowTemplates
      }
    } else if (activeTab === "ai-workflow") {
      templates = templates.filter(t => t.isAIPowered && t.categories.includes("ai-workflow"))
    } else if (activeTab === "most-popular") {
      templates = templates.filter(t => t.categories.includes("most-popular"))
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
    checkScrollPosition()
    // Also check after a short delay to ensure layout is complete
    const timer = setTimeout(checkScrollPosition, 100)
    return () => clearTimeout(timer)
  }, [filteredTemplates, checkScrollPosition])

  // Add scroll event listener
  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollPosition)
      // Also listen for resize events
      window.addEventListener("resize", checkScrollPosition)
      return () => {
        container.removeEventListener("scroll", checkScrollPosition)
        window.removeEventListener("resize", checkScrollPosition)
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
          <h2 className="text-xl font-semibold">Recommended templates</h2>
          <a
            href="#"
            className="text-sm text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault()
              // Navigate to templates page
            }}
          >
            Browse all templates
          </a>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pr-0">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="for-you" className="gap-1.5">
            <User className="w-4 h-4" />
            For you
          </TabsTrigger>
          <TabsTrigger value="ai-workflow" className="gap-1.5">
            <Sparkles className="w-4 h-4" />
            AI Workflows
          </TabsTrigger>
          <TabsTrigger value="most-popular" className="gap-1.5">
            <Star className="w-4 h-4" />
            Most popular
          </TabsTrigger>
        </TabsList>

        {/* Template Cards */}
        <TabsContent value={activeTab} className="mt-0">
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
                    {/* AI-powered badge */}
                    {template.isAIPowered && (
                      <Badge
                        variant="outline"
                        className="text-xs border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI-powered
                      </Badge>
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
        </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

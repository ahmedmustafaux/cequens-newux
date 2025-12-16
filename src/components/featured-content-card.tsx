import * as React from "react"
import { X, ChevronLeft, ChevronRight, Users, Shield, Lock, UserCheck } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { featuredContent, getAppIcon, type FeaturedContent } from "@/data/home-templates"
import { cn } from "@/lib/utils"
import { ChatText, EnvelopeSimple } from "phosphor-react"

interface FeaturedContentCardProps {
  onDismiss?: () => void
  className?: string
  showDismiss?: boolean
}

export function FeaturedContentCard({ onDismiss, className, showDismiss = true }: FeaturedContentCardProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isDismissed, setIsDismissed] = React.useState(false)
  const storageKey = "featured-content-dismissed"

  // Check localStorage on mount (only if dismiss is enabled)
  React.useEffect(() => {
    if (showDismiss) {
      const dismissed = localStorage.getItem(storageKey)
      if (dismissed === "true") {
        setIsDismissed(true)
      }
    }
  }, [showDismiss])

  const handleDismiss = () => {
    if (!showDismiss) return
    setIsDismissed(true)
    localStorage.setItem(storageKey, "true")
    onDismiss?.()
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : featuredContent.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < featuredContent.length - 1 ? prev + 1 : 0))
  }

  // Don't check dismissal if showDismiss is false (always show)
  if ((showDismiss && isDismissed) || featuredContent.length === 0) {
    return null
  }

  const currentContent: FeaturedContent = featuredContent[currentIndex]
  const apps = currentContent.apps.map(name => getAppIcon(name))

  // Render app icon
  const renderAppIcon = (app: ReturnType<typeof getAppIcon>) => {
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
      return <span className={cn("font-bold", app.color)}>{app.icon}</span>
    }
    return <span>{app.icon}</span>
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* New Release Label */}
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        New Release
      </div>

      <Card className="relative">
        {/* Dismiss button - only show if enabled */}
        {showDismiss && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 z-10 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <CardContent>
          {/* Visual element - roles and permissions */}
          <div className="relative w-full h-32 bg-blue-50 dark:bg-blue-950/20 rounded-t-lg flex items-center justify-center p-4">
            <div className="flex items-center gap-3">
              {/* Users icon - main */}
              <div className="w-16 h-16 rounded-lg border border-border bg-background flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              {/* Connector arrow */}
              <div className="flex items-center">
                <div className="w-8 h-px bg-border" />
                <Shield className="w-4 h-4 text-muted-foreground mx-1" />
                <div className="w-8 h-px bg-border" />
              </div>
              {/* Shield icon - permissions */}
              <div className="w-12 h-12 rounded-lg border border-border bg-background flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              {/* Connector arrow */}
              <div className="flex items-center">
                <div className="w-6 h-px bg-border" />
                <Lock className="w-3 h-3 text-muted-foreground mx-1" />
                <div className="w-6 h-px bg-border" />
              </div>
              {/* Lock icon - security */}
              <div className="w-10 h-10 rounded-lg border border-border bg-background flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="pt-6 pb-4">
          {/* Metadata */}
          <div className="text-sm text-muted-foreground mb-3">
            New Feature • 2 min
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 leading-tight">
            Create roles and permissions
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Control access to your platform with granular role-based permissions. Assign team members specific roles and customize what they can see and do.
          </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-0">
          <Button variant="outline" size="sm" asChild>
            <a href="#">
              Get started
            </a>
          </Button>

          {/* Pagination */}
          {featuredContent.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                {currentIndex + 1} of {featuredContent.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

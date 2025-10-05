import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardSkeleton } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RotateCcw, Filter, Search } from "lucide-react"

interface EmptyStateProps {
  title?: string
  description?: string
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  secondaryActions?: Array<{
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  }>
  icon?: React.ReactNode
  showBadge?: boolean
  badgeText?: string
  showDefaultActions?: boolean
  isLoading?: boolean
}

export default function EmptyState({ 
  title = "No items found",
  description = "Get started by creating your first item or adjusting your filters.",
  primaryAction,
  secondaryActions = [],
  icon = <Search className="h-8 w-8 text-black" />,
  showBadge = true,
  badgeText = "Empty",
  showDefaultActions = true,
  isLoading = false
}: EmptyStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <CardSkeleton />
      </div>
    )
  }
  const handleSecondaryAction = (action: typeof secondaryActions[0]) => {
    action.onClick()
  }

  return (
    <div className="px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">No data to display.</p>
        </div>
        {showBadge && (
          <Badge variant="secondary" className="text-xs">
            {badgeText}
          </Badge>
        )}
      </div>
      
      <Card>
        <CardHeader className="gap-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-full p-6">
            {icon}
             </div>
          </div>
          
          <div className="text-center">
            <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1 w-80 mx-auto">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="text-center">
            {/* All Actions - Horizontally Aligned */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
              {/* Show actions only if they exist */}
              {(primaryAction || secondaryActions.length > 0) && (
                <>
                  {/* Primary Action */}
                  {primaryAction && (
                    <Button 
                      onClick={primaryAction.onClick}
                      size="sm"
                      className="gap-2"
                    >
                      {primaryAction.icon || <Plus className="h-4 w-4" />}
                      {primaryAction.label}
                    </Button>
                  )}

                  {/* Secondary Actions */}
                  {secondaryActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={() => handleSecondaryAction(action)}
                      className="gap-2"
                    >
                      {action.icon || <Filter className="h-4 w-4" />}
                      {action.label}
                    </Button>
                  ))}
                </>
              )}

              {/* Show default actions only if no custom actions are provided and showDefaultActions is true */}
              {!primaryAction && secondaryActions.length === 0 && showDefaultActions && (
                <>
                  <Button 
                    onClick={() => {
                      // TODO: Implement create new item functionality
                    }}
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement reset filters functionality
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset Filters
                  </Button>
                </>
              )}

              {/* Show message if no actions are available at all */}
              {!primaryAction && secondaryActions.length === 0 && !showDefaultActions && (
                <div className="text-sm text-muted-foreground">
                  No actions available
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

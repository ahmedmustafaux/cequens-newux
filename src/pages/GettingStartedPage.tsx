import * as React from "react"
import { GettingStartedGuide } from "@/components/getting-started-guide"
import { GettingStartedResources } from "@/components/getting-started-resources"
import { useOnboarding } from "@/contexts/onboarding-context"
import { useAuth } from "@/hooks/use-auth"

export default function GettingStartedPage() {
  const { onboardingData } = useOnboarding()
  const { user } = useAuth()
  const [totalSteps, setTotalSteps] = React.useState(4)
  const [completedCount, setCompletedCount] = React.useState(0)
  
  // Calculate progress from localStorage
  React.useEffect(() => {
    const calculateProgress = () => {
      try {
        const saved = localStorage.getItem('cequens-setup-guide-completed-steps')
        const steps = saved ? new Set(JSON.parse(saved)) : new Set()
        
        // Calculate total steps based on industry
        // Section 1: Always 3 steps
        // Section 2: 3 steps (industry-specific)
        // Section 3: Always 2 steps (team)
        let total = 3 + 3 + 2 // = 8 total steps
        
        setCompletedCount(steps.size)
        setTotalSteps(total)
      } catch {
        setCompletedCount(0)
        setTotalSteps(4)
      }
    }
    
    calculateProgress()
    
    // Listen for storage changes to update progress
    const handleStorageChange = () => {
      calculateProgress()
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also check on interval to catch local changes
    const interval = setInterval(calculateProgress, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [onboardingData?.industry])

  // Get user's first name
  const userName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <div className="w-full">
      {/* Two-column layout: 2/3 Getting Started, 1/3 Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Getting Started Section - 2/3 width (8 columns) */}
        <div className="lg:col-span-8">
          {/* Header with greeting and progress bar aligned horizontally - same width as guide */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="text-xl font-semibold">
              👋 Hello, {userName}! Let's get started.
            </h1>
            {/* Progress bar aligned horizontally with greeting */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[200px]">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${totalSteps > 0 ? Math.min((completedCount / totalSteps) * 100, 100) : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {completedCount} of {totalSteps}
              </span>
            </div>
          </div>
          <GettingStartedGuide
            industry={onboardingData?.industry || "ecommerce"}
            channels={onboardingData?.channels || []}
            goals={onboardingData?.goals || []}
            inline={true}
          />
        </div>

        {/* Resources Section - 1/3 width (4 columns) */}
        <div className="lg:col-span-4">
          <GettingStartedResources />
        </div>
      </div>
    </div>
  )
}

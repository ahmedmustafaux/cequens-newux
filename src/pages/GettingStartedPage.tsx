import * as React from "react"
import { motion } from "framer-motion"
import { GettingStartedGuide, Persona } from "@/components/getting-started-guide"
import { GettingStartedResources } from "@/components/getting-started-resources"
import { useOnboarding } from "@/contexts/onboarding-context"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Code } from "lucide-react"

export default function GettingStartedPage() {
  const { onboardingData } = useOnboarding()
  const { user } = useAuth()
  const [totalSteps, setTotalSteps] = React.useState(4)
  const [completedCount, setCompletedCount] = React.useState(0)
  const [isDataLoading, setIsDataLoading] = React.useState(true)
  
  // Persona state with localStorage persistence
  const STORAGE_KEY_PERSONA = 'cequens-setup-guide-persona'
  const [persona, setPersona] = React.useState<Persona>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERSONA)
      return (saved === "business" || saved === "api") ? saved : "business"
    } catch {
      return "business"
    }
  })

  // Save persona to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PERSONA, persona)
    } catch (error) {
      console.error('Failed to save persona:', error)
    }
  }, [persona])
  
  // Calculate progress from localStorage (persona-specific)
  React.useEffect(() => {
    const calculateProgress = () => {
      try {
        const storageKey = `cequens-setup-guide-completed-steps-${persona}`
        const saved = localStorage.getItem(storageKey)
        const steps = saved ? new Set(JSON.parse(saved)) : new Set()
        
        // Calculate total steps based on persona
        let total: number
        if (persona === "business") {
          // Business persona: Section 1 (3 steps) + Section 2 (3 steps) + Section 3 (2 steps) = 8 total
          total = 3 + 3 + 2
        } else {
          // API persona: Section 1 (3 steps) + Section 2 (3 steps) + Section 3 (3 steps) = 9 total
          total = 3 + 3 + 3
        }
        
        setCompletedCount(steps.size)
        setTotalSteps(total)
      } catch {
        setCompletedCount(0)
        setTotalSteps(persona === "business" ? 8 : 9)
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
  }, [persona, onboardingData?.industry])

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true)
    const timer = setTimeout(() => {
      setIsDataLoading(false)
    }, 400) // Simulate 400ms loading time for server data

    return () => clearTimeout(timer)
  }, [])

  // Get user's first name
  const userName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  // Guide skeleton component
  const GuideSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="border rounded-lg overflow-hidden bg-card border-border"
        >
          {/* Section Header Skeleton */}
          <div className="w-full p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-5 w-12 flex-shrink-0" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      {/* Two-column layout: 2/3 Getting Started, 1/3 Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Getting Started Section - 2/3 width (8 columns) */}
        <div className="lg:col-span-8">
          {/* Header with greeting, persona switcher, and progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-4 mb-4"
          >
            {isDataLoading ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Skeleton className="h-7 w-64" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-1.5 w-[200px]" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-9 w-[300px]" />
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-semibold">
                      👋 Hello, {userName}! Let's get started as a
                    </h1>
                    {/* Persona Switcher */}
                    <Select value={persona} onValueChange={(value) => setPersona(value as Persona)}>
                      <SelectTrigger className="w-auto gap-6 h-auto py-5 bg-white [&_[data-slot=select-value]]:hidden">
                        <SelectValue />
                        <h1 className="text-xl font-semibold bg-white">
                          {persona === "business" ? "Marketeer" : "Developer"}
                        </h1>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business" className="text-xl">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>Marketeer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="api" className="text-xl">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            <span>Developer</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Progress bar aligned horizontally with greeting */}
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden border border-border">
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
              </>
            )}
          </motion.div>
          
          {isDataLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <GuideSkeleton />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <GettingStartedGuide
                industry={onboardingData?.industry || "ecommerce"}
                channels={onboardingData?.channels || []}
                goals={onboardingData?.goals || []}
                persona={persona}
                inline={true}
              />
            </motion.div>
          )}
        </div>

        {/* Resources Section - 1/3 width (4 columns) */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <GettingStartedResources />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

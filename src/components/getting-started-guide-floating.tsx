import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles,
  Minimize2,
  Maximize2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GettingStartedGuide, Persona } from "./getting-started-guide"

// Props interface for floating widget
interface GettingStartedGuideFloatingProps {
  industry?: string
  channels?: string[]
  goals?: string[]
  persona?: Persona
  onDismiss?: () => void
}

export function GettingStartedGuideFloating({ 
  industry = "ecommerce",
  channels = [],
  goals = [],
  persona = "business",
  onDismiss
}: GettingStartedGuideFloatingProps) {
  // LocalStorage keys - persona-specific
  const STORAGE_KEY_MINIMIZED = `cequens-setup-guide-minimized-${persona}`
  const STORAGE_KEY_COMPLETED = `cequens-setup-guide-completed-steps-${persona}`

  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MINIMIZED)
      return saved === 'true'
    } catch {
      return false
    }
  })

  // Calculate progress
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)

  // Calculate total steps based on persona
  useEffect(() => {
    // Business persona: 8 steps (3 + 3 + 2)
    // API persona: 9 steps (3 + 3 + 3)
    const total = persona === "business" ? 8 : 9
    setTotalSteps(total)
  }, [persona])

  // Update progress from localStorage
  useEffect(() => {
    const updateProgress = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_COMPLETED)
        if (saved) {
          const parsed = JSON.parse(saved) as string[]
          const completed = parsed.length
          setCompletedCount(completed)
          const percentage = totalSteps > 0 ? Math.round((completed / totalSteps) * 100) : 0
          setProgressPercentage(percentage)
        } else {
          setCompletedCount(0)
          setProgressPercentage(0)
        }
      } catch {
        setCompletedCount(0)
        setProgressPercentage(0)
      }
    }

    updateProgress()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      updateProgress()
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also check on interval to catch local changes
    const interval = setInterval(updateProgress, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [totalSteps, STORAGE_KEY_COMPLETED])

  // Save minimized state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MINIMIZED, String(isMinimized))
    } catch (error) {
      console.error('Failed to save minimized state:', error)
    }
  }, [isMinimized, persona])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50 w-full max-w-md"
      style={{ width: 'calc(25vw - 1.5rem)', minWidth: '480px', maxWidth: '600px' }}
    >
      <Card className="shadow-2xl border-2 border-border overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
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
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden border border-border">
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
              <CardContent className="space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto">
                <GettingStartedGuide
                  industry={industry}
                  channels={channels}
                  goals={goals}
                  persona={persona}
                  inline={true}
                  onDismiss={onDismiss}
                />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}


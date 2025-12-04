import * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

interface OnboardingData {
  industry?: string
  channels?: string[]
  goals?: string[]
  teamSize?: string
  usage?: string[]
}

interface OnboardingContextType {
  hasCompletedOnboarding: boolean
  completeOnboarding: (data?: OnboardingData) => void
  onboardingData: OnboardingData | null
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  
  // Check if user has completed onboarding
  useEffect(() => {
    if (user) {
      // For new users, check localStorage for onboarding completion
      if (user.userType === "newUser") {
        const completed = localStorage.getItem(`onboarding-completed-${user.email}`)
        setHasCompletedOnboarding(completed === "true")
        
        // Load onboarding data
        const savedData = localStorage.getItem(`onboarding-data-${user.email}`)
        if (savedData) {
          try {
            setOnboardingData(JSON.parse(savedData))
          } catch (e) {
            console.error("Failed to parse onboarding data", e)
          }
        }
        
        // Remove old "getting-started-seen" key if it exists (cleanup from previous version)
        localStorage.removeItem(`getting-started-seen-${user.email}`)
      } else {
        // Existing users don't need onboarding
        setHasCompletedOnboarding(true)
      }
    }
  }, [user])
  
  // Function to mark onboarding as completed
  const completeOnboarding = (data?: OnboardingData) => {
    if (user) {
      localStorage.setItem(`onboarding-completed-${user.email}`, "true")
      setHasCompletedOnboarding(true)
      
      // Save onboarding data if provided
      if (data) {
        localStorage.setItem(`onboarding-data-${user.email}`, JSON.stringify(data))
        setOnboardingData(data)
      }
    }
  }
  
  return (
    <OnboardingContext.Provider value={{ 
      hasCompletedOnboarding, 
      completeOnboarding,
      onboardingData
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
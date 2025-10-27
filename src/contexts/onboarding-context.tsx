import * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

interface OnboardingContextType {
  hasCompletedOnboarding: boolean
  completeOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true)
  
  // Check if user has completed onboarding
  useEffect(() => {
    if (user) {
      // For new users, check localStorage for onboarding completion
      if (user.userType === "newUser") {
        const completed = localStorage.getItem(`onboarding-completed-${user.email}`)
        setHasCompletedOnboarding(completed === "true")
      } else {
        // Existing users don't need onboarding
        setHasCompletedOnboarding(true)
      }
    }
  }, [user])
  
  // Function to mark onboarding as completed
  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding-completed-${user.email}`, "true")
      setHasCompletedOnboarding(true)
    }
  }
  
  return (
    <OnboardingContext.Provider value={{ hasCompletedOnboarding, completeOnboarding }}>
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
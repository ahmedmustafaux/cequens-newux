import * as React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, ChevronRight, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useOnboarding } from "@/contexts/onboarding-context"
import { smoothTransition, pageVariants } from "@/lib/transitions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { toast } from "sonner"

// Define the onboarding questions and options
const onboardingSteps = [
  {
    id: 1,
    question: "What's your primary goal with our platform?",
    options: [
      { id: "goal-1", label: "Customer engagement" },
      { id: "goal-2", label: "Marketing campaigns" },
      { id: "goal-3", label: "Support automation" },
      { id: "goal-4", label: "Lead generation" },
      { id: "goal-5", label: "Internal communications" },
    ],
    multiSelect: false,
  },
  {
    id: 2,
    question: "Which channels do you plan to use?",
    options: [
      { id: "channel-1", label: "SMS" },
      { id: "channel-2", label: "WhatsApp" },
      { id: "channel-3", label: "Email" },
      { id: "channel-4", label: "Voice" },
      { id: "channel-5", label: "Messenger" },
      { id: "channel-6", label: "Telegram" },
    ],
    multiSelect: true,
  },
  {
    id: 3,
    question: "What's your team size?",
    options: [
      { id: "team-1", label: "Just me" },
      { id: "team-2", label: "2-5 people" },
      { id: "team-3", label: "6-20 people" },
      { id: "team-4", label: "21-100 people" },
      { id: "team-5", label: "100+ people" },
    ],
    multiSelect: false,
  },
  {
    id: 4,
    question: "Which industry are you in?",
    options: [
      { id: "industry-1", label: "E-commerce" },
      { id: "industry-2", label: "Healthcare" },
      { id: "industry-3", label: "Finance" },
      { id: "industry-4", label: "Education" },
      { id: "industry-5", label: "Technology" },
      { id: "industry-6", label: "Retail" },
      { id: "industry-7", label: "Other" },
    ],
    multiSelect: false,
  },
  {
    id: 5,
    question: "What features are most important to you?",
    options: [
      { id: "feature-1", label: "Analytics & Reporting" },
      { id: "feature-2", label: "AI Chatbots" },
      { id: "feature-3", label: "Campaign Management" },
      { id: "feature-4", label: "Contact Management" },
      { id: "feature-5", label: "Templates" },
      { id: "feature-6", label: "Automation" },
      { id: "feature-7", label: "API Integration" },
    ],
    multiSelect: true,
  },
]

export default function NewUserOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [buildingProgress, setBuildingProgress] = useState(0)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { completeOnboarding: markOnboardingComplete } = useOnboarding()

  // Redirect if not a new user
  useEffect(() => {
    if (user && user.userType !== "newUser") {
      navigate("/")
    }
  }, [user, navigate])

  const handleOptionSelect = (optionId: string) => {
    const step = onboardingSteps[currentStep]
    
    if (step.multiSelect) {
      // For multi-select, toggle the option
      setSelectedOptions(prev => {
        const currentSelections = prev[step.id] || []
        const isSelected = currentSelections.includes(optionId)
        
        if (isSelected) {
          return {
            ...prev,
            [step.id]: currentSelections.filter(id => id !== optionId)
          }
        } else {
          return {
            ...prev,
            [step.id]: [...currentSelections, optionId]
          }
        }
      })
    } else {
      // For single select, replace the selection
      setSelectedOptions(prev => ({
        ...prev,
        [step.id]: [optionId]
      }))
    }
  }

  const isOptionSelected = (optionId: string) => {
    const step = onboardingSteps[currentStep]
    const selections = selectedOptions[step.id] || []
    return selections.includes(optionId)
  }

  const canProceed = () => {
    const step = onboardingSteps[currentStep]
    const selections = selectedOptions[step.id] || []
    return selections.length > 0
  }

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeOnboarding = async () => {
    setIsCompleted(true)
    setIsLoading(true)

    // Simulate building the dashboard
    const interval = setInterval(() => {
      setBuildingProgress(prev => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsLoading(false)
            // Mark onboarding as completed
            markOnboardingComplete()
            // Redirect to dashboard after completion
            navigate("/")
          }, 1000)
          return 100
        }
        return newProgress
      })
    }, 150)

    // Show toast
    toast.success("Preferences saved!", {
      description: "We're customizing your dashboard based on your preferences.",
      duration: 4000,
    })
  }

  // Animation variants for the steps
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  // Building animation phrases
  const buildingPhrases = [
    "Analyzing your preferences...",
    "Customizing your dashboard...",
    "Setting up your channels...",
    "Preparing your templates...",
    "Finalizing your experience..."
  ]

  const currentBuildingPhrase = () => {
    const index = Math.min(
      Math.floor(buildingProgress / 20),
      buildingPhrases.length - 1
    )
    return buildingPhrases[index]
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 pt-24">
      <Card className="w-full max-w-2xl shadow-lg bg-white rounded-2xl overflow-hidden fixed top-16 z-10">
        <CardContent className="p-4">
          {!isCompleted ? (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={smoothTransition}
              className="space-y-6"
            >
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 flex space-x-1">
                  {onboardingSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`h-1 flex-1 rounded-full ${
                        index <= currentStep
                          ? "bg-primary"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-3 text-xs text-gray-500">
                  Step {currentStep + 1} of {onboardingSteps.length}
                </span>
              </div>

              {/* Question */}
              <motion.div
                key={`step-${currentStep}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepVariants}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-8 mt-12 ml-2">
                  {onboardingSteps[currentStep].question}
                </h2>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {onboardingSteps[currentStep].options.map(option => (
                    <div
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-all
                        ${
                          isOptionSelected(option.id)
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {onboardingSteps[currentStep].multiSelect ? (
                          <Checkbox 
                            checked={isOptionSelected(option.id)}
                            className="pointer-events-none"
                          />
                        ) : (
                          <div 
                            className={`h-4 w-4 rounded-full border ${
                              isOptionSelected(option.id) 
                                ? "border-primary bg-primary" 
                                : "border-gray-300 bg-gray-100/80"
                            } flex items-center justify-center`}
                          >
                            {isOptionSelected(option.id) && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                            )}
                          </div>
                        )}
                        <span>{option.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Multi-select hint */}
                {onboardingSteps[currentStep].multiSelect && (
                  <p className="text-xs text-muted-foreground mb-2">
                    You can select multiple options
                  </p>
                )}
              </motion.div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center"
                >
                  {currentStep === onboardingSteps.length - 1 ? (
                    "Complete"
                  ) : (
                    <>
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-6 text-center space-y-4"
            >
              <h2 className="text-xl font-bold">Building Your Experience</h2>
              <p className="text-muted-foreground text-sm">{currentBuildingPhrase()}</p>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${buildingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Loading animation */}
              <div className="flex justify-center py-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-8 w-8 text-primary" />
                </motion.div>
              </div>

              <p className="text-xs text-muted-foreground">
                Please wait while we set up your personalized dashboard...
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
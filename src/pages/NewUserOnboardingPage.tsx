import * as React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, ChevronRight, Loader2, MessageSquare, Mail, Phone } from "lucide-react"
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

// Define interfaces for option types
interface BaseOption {
  id: string;
  label: string;
}

interface IconOption extends BaseOption {
  iconType: "lucide" | "svg" | "img";
  icon: string;
}

type Option = BaseOption | IconOption;

interface OnboardingStep {
  id: number;
  question: string;
  options: Option[];
  multiSelect: boolean;
  visualOptions?: boolean;
}

// Helper function to check if an option has an icon
const hasIcon = (option: Option): option is IconOption => {
  return 'iconType' in option && 'icon' in option;
};

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
    multiSelect: true,
  },
  {
    id: 2,
    question: "Which channels do you plan to use?",
    options: [
      { id: "channel-1", label: "SMS", iconType: "lucide", icon: "MessageSquare" },
      { id: "channel-2", label: "WhatsApp", iconType: "svg", icon: "/icons/WhatsApp.svg" },
      { id: "channel-3", label: "Email", iconType: "lucide", icon: "Mail" },
      { id: "channel-4", label: "Voice", iconType: "lucide", icon: "Phone" },
      { id: "channel-5", label: "Messenger", iconType: "img", icon: "/icons/Messenger.png" },
      { id: "channel-6", label: "Telegram", iconType: "svg", icon: "/icons/Telegram.svg" },
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
    question: "How will you use our platform?",
    options: [
      { id: "usage-1", label: "API Integrations (Developers)" },
      { id: "usage-2", label: "Interfaced Apps (CRM Teams)" },
    ],
    multiSelect: true,
    visualOptions: true,
  },
]

export default function NewUserOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({
    5: ["usage-1", "usage-2"] // Pre-select both options for the last question
  })
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
                <h2 className="text-2xl font-bold mb-2 mt-12 ml-2">
                  {onboardingSteps[currentStep].question}
                </h2>
                
                {onboardingSteps[currentStep].multiSelect ? (
                  <p className="text-xs text-muted-foreground mb-6 ml-2">
                    You can select multiple options
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mb-6 ml-2">
                    Please select one option
                  </p>
                )}

                {/* Options */}
                {onboardingSteps[currentStep].visualOptions ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {onboardingSteps[currentStep].options.map(option => (
                      <div
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        className="flex flex-col items-center"
                      >
                        <div className="w-full cursor-pointer group">
                          <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center transition-colors group-hover:bg-muted/60 group-hover:ring-1 group-hover:ring-primary">
                            <div className="w-full h-full p-2">
                              <div className={`
                                overflow-hidden w-full h-full bg-background/80 rounded-sm border border-border/50 relative
                                ${isOptionSelected(option.id) ? "bg-primary/10" : ""}
                              `}>
                                {/* Visual representation based on option */}
                                {option.id === "usage-1" && (
                                  <>
                                    {/* API Integrations (Developers) */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200"></div>
                                    
                                    {/* Code/API visual */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5">
                                      {/* Terminal header with title */}
                                      <div className="w-full h-1.5 bg-slate-700 rounded-t-md flex items-center justify-between px-1">
                                        <div className="flex items-center">
                                          <div className="w-0.5 h-0.5 rounded-full bg-red-400 mr-0.5"></div>
                                          <div className="w-0.5 h-0.5 rounded-full bg-yellow-400 mr-0.5"></div>
                                          <div className="w-0.5 h-0.5 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="w-1/4 h-0.5 bg-slate-500 rounded-full"></div>
                                        <div className="w-1/6 h-0.5 bg-transparent"></div>
                                      </div>
                                      
                                      {/* Terminal body with code */}
                                      <div className="w-full h-full bg-slate-800 rounded-b-md p-1 flex flex-col justify-start">
                                        {/* Command prompt line */}
                                        <div className="flex items-center mb-0.5">
                                          <div className="w-1 h-0.5 bg-green-500 rounded-full mr-0.5"></div>
                                          <div className="w-2/3 h-0.5 bg-slate-600 rounded-full"></div>
                                        </div>
                                        
                                        {/* Response lines with syntax highlighting */}
                                        <div className="flex items-center mb-0.5">
                                          <div className="w-1/6 h-0.5 bg-purple-500 rounded-full mr-0.5"></div>
                                          <div className="w-1/4 h-0.5 bg-blue-400 rounded-full mr-0.5"></div>
                                          <div className="w-1/3 h-0.5 bg-yellow-400 rounded-full"></div>
                                        </div>
                                        
                                        <div className="flex items-center mb-0.5">
                                          <div className="w-1/5 h-0.5 bg-blue-400 rounded-full mr-0.5"></div>
                                          <div className="w-2/5 h-0.5 bg-green-400 rounded-full"></div>
                                        </div>
                                        
                                        <div className="flex items-center mb-0.5">
                                          <div className="w-1/6 h-0.5 bg-red-400 rounded-full mr-0.5"></div>
                                          <div className="w-1/2 h-0.5 bg-blue-400 rounded-full"></div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                          <div className="w-1/4 h-0.5 bg-purple-500 rounded-full mr-0.5"></div>
                                          <div className="w-1/3 h-0.5 bg-yellow-400 rounded-full"></div>
                                        </div>
                                        
                                        {/* Cursor */}
                                        <div className="w-0.5 h-0.5 bg-white mt-0.5 animate-pulse"></div>
                                      </div>
                                    </div>
                                    
                                    {/* Code brackets decoration */}
                                    <div className="absolute bottom-1 right-2 text-xs text-slate-400 opacity-30">{"{ }"}</div>
                                  </>
                                )}
                                
                                {option.id === "usage-2" && (
                                  <>
                                    {/* Interfaced Apps (CRM Teams) - Chat with user cards from different channels */}
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200"></div>
                                    
                                    {/* Multi-channel chat interface */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-3/5 shadow-sm">
                                      {/* App header */}
                                      <div className="w-full h-1.5 bg-white border-b border-slate-200 rounded-t-md flex items-center justify-between px-1">
                                        <div className="flex items-center">
                                          <div className="w-1 h-0.5 bg-primary rounded-full mr-1"></div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <div className="w-0.5 h-0.5 bg-slate-400 rounded-full"></div>
                                          <div className="w-0.5 h-0.5 bg-slate-400 rounded-full"></div>
                                        </div>
                                      </div>
                                      
                                      {/* App body - split view */}
                                      <div className="w-full h-full bg-slate-50 rounded-b-md flex">
                                        {/* Left sidebar - user cards from different channels */}
                                        <div className="w-1/3 h-full bg-white border-r border-slate-200 flex flex-col p-0.5 space-y-0.5 overflow-hidden">
                                          {/* WhatsApp user */}
                                          <div className="flex items-center bg-green-50/50 border-l-2 border-green-500 rounded-sm p-0.5">
                                            {/* WhatsApp logo */}
                                            <div className="w-1 h-1 bg-white rounded-full flex items-center justify-center mr-0.5 relative overflow-hidden">
                                              <div className="absolute inset-0.5 bg-green-500 rounded-full flex items-center justify-center">
                                                <div className="w-0.5 h-0.5 bg-white transform rotate-45"></div>
                                              </div>
                                            </div>
                                            <div className="flex-1">
                                              <div className="w-1/2 h-0.5 bg-slate-700 rounded-full mb-0.5"></div>
                                              <div className="w-2/3 h-0.5 bg-slate-400 rounded-full"></div>
                                            </div>
                                          </div>
                                          
                                          {/* Instagram user */}
                                          <div className="flex items-center hover:bg-pink-50/30 border-l-2 border-transparent rounded-sm p-0.5">
                                            {/* Instagram logo */}
                                            <div className="w-1 h-1 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-0.5 relative overflow-hidden">
                                              <div className="absolute inset-0.5 bg-white rounded-full"></div>
                                              <div className="absolute top-0 right-0 w-0.5 h-0.5 bg-pink-500 rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                              <div className="w-1/2 h-0.5 bg-slate-700 rounded-full mb-0.5"></div>
                                              <div className="w-2/3 h-0.5 bg-slate-400 rounded-full"></div>
                                            </div>
                                          </div>
                                          
                                          {/* Messenger user */}
                                          <div className="flex items-center hover:bg-blue-50/30 border-l-2 border-transparent rounded-sm p-0.5">
                                            {/* Messenger logo */}
                                            <div className="w-1 h-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-0.5 relative overflow-hidden">
                                              <div className="absolute inset-0.5 bg-white transform rotate-45 translate-y-0.5"></div>
                                            </div>
                                            <div className="flex-1">
                                              <div className="w-1/2 h-0.5 bg-slate-700 rounded-full mb-0.5"></div>
                                              <div className="w-2/3 h-0.5 bg-slate-400 rounded-full"></div>
                                            </div>
                                          </div>
                                          
                                          {/* Telegram user */}
                                          <div className="flex items-center hover:bg-blue-50/30 border-l-2 border-transparent rounded-sm p-0.5">
                                            {/* Telegram logo */}
                                            <div className="w-1 h-1 bg-blue-500 rounded-full flex items-center justify-center mr-0.5 relative overflow-hidden">
                                              <div className="absolute right-0 bottom-0 w-0.5 h-0.5 bg-white transform rotate-45"></div>
                                            </div>
                                            <div className="flex-1">
                                              <div className="w-1/2 h-0.5 bg-slate-700 rounded-full mb-0.5"></div>
                                              <div className="w-2/3 h-0.5 bg-slate-400 rounded-full"></div>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Right side - active chat */}
                                        <div className="flex-1 flex flex-col">
                                          {/* Chat header */}
                                          <div className="h-1.5 bg-white border-b border-slate-200 flex items-center px-0.5 justify-between">
                                            <div className="flex items-center">
                                              {/* WhatsApp logo */}
                                              <div className="w-0.75 h-0.75 bg-white rounded-full flex items-center justify-center mr-0.5 relative overflow-hidden">
                                                <div className="absolute inset-0.5 bg-green-500 rounded-full flex items-center justify-center">
                                                  <div className="w-0.25 h-0.25 bg-white transform rotate-45"></div>
                                                </div>
                                              </div>
                                              <div className="w-1/4 h-0.5 bg-slate-700 rounded-full"></div>
                                            </div>
                                            <div className="flex items-center space-x-0.5">
                                              <div className="w-0.5 h-0.5 rounded-full bg-green-500"></div>
                                              <div className="w-0.5 h-0.5 rounded-full bg-slate-400"></div>
                                            </div>
                                          </div>
                                          
                                          {/* Chat messages */}
                                          <div className="flex-1 p-0.5 flex flex-col justify-end space-y-0.5 bg-slate-50">
                                            {/* Incoming message */}
                                            <div className="flex items-start">
                                              <div className="w-0.75 h-0.75 rounded-full bg-slate-200 flex items-center justify-center mt-0.5 mr-0.5 overflow-hidden">
                                                <div className="w-0.5 h-0.5 bg-slate-400"></div>
                                              </div>
                                              <div className="bg-white border border-slate-200 rounded-md rounded-tl-none p-0.5 max-w-[70%]">
                                                <div className="w-full h-0.5 bg-slate-500 rounded-full mb-0.5"></div>
                                                <div className="w-2/3 h-0.5 bg-slate-500 rounded-full"></div>
                                              </div>
                                            </div>
                                            
                                            {/* Outgoing message */}
                                            <div className="flex items-start justify-end">
                                              <div className="bg-green-100 border border-green-200 rounded-md rounded-tr-none p-0.5 max-w-[70%]">
                                                <div className="w-full h-0.5 bg-green-600/60 rounded-full mb-0.5"></div>
                                                <div className="w-3/4 h-0.5 bg-green-600/60 rounded-full"></div>
                                              </div>
                                              <div className="w-0.5 h-0.5 rounded-full bg-green-500 mt-0.5 ml-0.5"></div>
                                            </div>
                                          </div>
                                          
                                          {/* Message input area */}
                                          <div className="h-1.5 bg-white border-t border-slate-200 flex items-center px-0.5 justify-between">
                                            <div className="w-3/4 h-0.5 bg-slate-200 rounded-full"></div>
                                            <div className="flex items-center">
                                              <div className="w-0.5 h-0.5 rounded-full bg-slate-400 mr-0.5"></div>
                                              <div className="w-0.5 h-0.5 rounded-full bg-green-500"></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 justify-center mt-2">
                            <Checkbox 
                              checked={isOptionSelected(option.id)}
                              className="pointer-events-none"
                            />
                            <label className="text-sm">{option.label}</label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
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
                        <div className="flex items-center justify-between">
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
                          
                          {/* Icon on the right side */}
                          {currentStep === 1 && hasIcon(option) && (
                            <div className="flex items-center justify-center w-6 h-6">
                              {option.iconType === "lucide" && option.icon === "MessageSquare" && (
                                <MessageSquare className="w-5 h-5 text-gray-500" />
                              )}
                              {option.iconType === "lucide" && option.icon === "Mail" && (
                                <Mail className="w-5 h-5 text-gray-500" />
                              )}
                              {option.iconType === "lucide" && option.icon === "Phone" && (
                                <Phone className="w-5 h-5 text-gray-500" />
                              )}
                              {option.iconType === "svg" && (
                                <img src={option.icon} alt={option.label} className="w-5 h-5" />
                              )}
                              {option.iconType === "img" && (
                                <img src={option.icon} alt={option.label} className="w-5 h-5" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </motion.div>

              {/* Navigation buttons */}
              <div className="flex justify-between pt-2">
                {currentStep > 0 ? (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                ) : (
                  <div></div> /* Empty div to maintain flex spacing */
                )}
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
              <p className="text-xs text-muted-foreground mt-10">
                Please wait while we set up your personalized dashboard...
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
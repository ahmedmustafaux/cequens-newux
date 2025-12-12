import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Check, ChevronRight, Loader2, MessageSquare, Mail, Phone, Smartphone } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useOnboarding } from "@/contexts/onboarding-context"
import { smoothTransition, pageVariants } from "@/lib/transitions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { OnboardingTemplateSelection, IndustryTemplate } from "@/components/onboarding-template-selection"
import { OnboardingIndustryOverview } from "@/components/onboarding-industry-overview"
import { ThemeSwitcher } from "@/components/theme-switcher"

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

// Helper function to render icon based on type
const renderIcon = (option: IconOption) => {
  if (option.iconType === "lucide") {
    const iconMap: Record<string, React.ReactNode> = {
      MessageSquare: <MessageSquare className="w-4 h-4 text-primary" />,
      Mail: <Mail className="w-4 h-4 text-primary" />,
      Phone: <Phone className="w-4 h-4 text-primary" />,
      Smartphone: <Smartphone className="w-4 h-4 text-primary" />,
    };
    return iconMap[option.icon] || null;
  } else if (option.iconType === "svg" || option.iconType === "img") {
    return <img src={option.icon} alt={option.label} className="w-4 h-4" />;
  }
  return null;
};

// Define the onboarding questions and options (4 questions for "start from scratch")
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
      { id: "goal-6", label: "Sales automation" },
      { id: "goal-7", label: "Customer retention" },
      { id: "goal-8", label: "Analytics & reporting" },
      { id: "goal-9", label: "Multi-channel messaging" },
    ],
    multiSelect: true,
  },
  {
    id: 2,
    question: "Which channels do you plan to use?",
    options: [
      { id: "channel-2", label: "WhatsApp", iconType: "svg", icon: "/icons/WhatsApp.svg" },
      { id: "channel-6", label: "Instagram", iconType: "svg", icon: "/icons/Instagram.svg" },
      { id: "channel-5", label: "Messenger", iconType: "img", icon: "/icons/Messenger.png" },
      { id: "channel-1", label: "SMS", iconType: "lucide", icon: "MessageSquare" },
      { id: "channel-3", label: "Email", iconType: "lucide", icon: "Mail" },
      { id: "channel-4", label: "Voice", iconType: "lucide", icon: "Phone" },
      { id: "channel-7", label: "Push Notifications", iconType: "lucide", icon: "Smartphone" },
    ],
    multiSelect: true,
  },
  {
    id: 3,
    question: "What's your company size?",
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
    question: "How will you use our platform?",
    options: [
      { id: "usage-1", label: "API Integrations (Developers)" },
      { id: "usage-2", label: "Interfaced Apps (CRM Teams)" },
    ],
    multiSelect: true,
    visualOptions: true,
  },
]

// Short wizard steps (only Company size and Persona)
const shortWizardSteps = [
  onboardingSteps[2], // Company size (step 3)
  onboardingSteps[3], // Persona/Usage (step 4)
]

export default function NewUserOnboardingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<IndustryTemplate | null>(null)
  const [customIndustryName, setCustomIndustryName] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string[]>>({
    5: ["usage-1", "usage-2"] // Pre-select both options for the usage question (step 5)
  })
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [buildingProgress, setBuildingProgress] = useState(0)
  const wizardCardRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { completeOnboarding: markOnboardingComplete } = useOnboarding()

  // All steps including industry selection as first step
  const totalSteps = 5 // Industry selection + 4 questions

  // Redirect if not a new user
  useEffect(() => {
    if (user && user.userType !== "newUser") {
      navigate("/")
    }
  }, [user, navigate])

  const handleTemplateSelect = (template: IndustryTemplate) => {
    // Pre-fill selections based on template
    setSelectedOptions(prev => ({
      ...prev,
      1: template.goals, // Primary goals
      2: template.channels, // Channels
      3: [template.teamSize], // Company size
      4: ["usage-1", "usage-2"] // Usage options
    }))
    
    setSelectedTemplate(template)
    setCustomIndustryName("")
  }

  const handleCustomIndustry = (industryName: string) => {
    setSelectedTemplate(null)
    setCustomIndustryName(industryName)
  }

  const handleIndustryClear = () => {
    setSelectedTemplate(null)
    setCustomIndustryName("")
  }

  const handleOptionSelect = (optionId: string) => {
    const step = onboardingSteps[currentStep - 1] // Adjust index since step 0 is industry
    
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
    if (currentStep === 0) return false // Industry selection handled separately
    const step = onboardingSteps[currentStep - 1] // Adjust index since step 0 is industry
    const selections = selectedOptions[step.id] || []
    return selections.includes(optionId)
  }

  const canProceed = () => {
    // For industry selection (step 0), require either a template or custom industry name
    if (currentStep === 0) {
      return selectedTemplate !== null || customIndustryName.trim().length > 0
    }
    // For other steps, require selection
    const step = onboardingSteps[currentStep - 1] // Adjust index since step 0 is industry
    const selections = selectedOptions[step.id] || []
    return selections.length > 0
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
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

    // Prepare onboarding data to save
    const onboardingData = {
      industry: selectedTemplate?.industry || (customIndustryName ? "custom" : "none"),
      customIndustryName: customIndustryName || undefined,
      channels: selectedOptions[2] || [],
      goals: selectedOptions[1] || [],
      teamSize: selectedOptions[3]?.[0] || "",
      usage: selectedOptions[4] || []
    }

    // Simulate building the dashboard
    const interval = setInterval(() => {
      setBuildingProgress(prev => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsLoading(false)
            // Mark onboarding as completed with data
            markOnboardingComplete(onboardingData)
            // Redirect after completion
            // Special handling: ahmed@cequens should go to guide page, others go to dashboard
            const isAhmedUser = user?.email?.toLowerCase().includes("ahmed@cequens")
            navigate(isAhmedUser ? "/getting-started" : "/")
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

  // Show wizard with industry selection as first step
  return (
    <div className="relative min-h-screen bg-layout">
      {/* Theme Switcher - Top Right Corner */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeSwitcher />
      </div>
      
      <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-16">
        {/* Wizard Card */}
        <Card ref={wizardCardRef} className="w-full max-w-xl shadow-none bg-card rounded-lg overflow-hidden p-4">
          {!isCompleted ? (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={smoothTransition}
              className="space-y-4"
            >
              {/* Progress indicator */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 flex space-x-1">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full ${
                        index <= currentStep
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs text-muted-foreground">
                  {currentStep + 1}/{totalSteps}
                </span>
              </div>

              {/* Industry Selection Step (Step 0) */}
              {currentStep === 0 ? (
                <motion.div
                  key="industry-step"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-md font-semibold mb-1">
                    What industry are you in?
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Please select an industry or enter a custom industry name
                  </p>
                  
                  <div className="mb-8 mt-4">
                    <OnboardingTemplateSelection
                      onTemplateSelect={handleTemplateSelect}
                      onStartFromScratch={() => {}} // Not used in inline mode
                      onCustomIndustry={handleCustomIndustry}
                      inlineMode={true}
                      selectedTemplate={selectedTemplate}
                      customIndustryName={customIndustryName}
                      onClear={handleIndustryClear}
                      wizardCardRef={wizardCardRef}
                    />
                  </div>
                </motion.div>
              ) : (
                /* Regular Questions (Steps 1-4) */
                <>
                  {/* Question */}
                  <motion.div
                    key={`step-${currentStep}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-md font-semibold mb-1">
                      {onboardingSteps[currentStep - 1].question}
                    </h3>
                    
                    {onboardingSteps[currentStep - 1].multiSelect ? (
                      <p className="text-xs text-muted-foreground mb-3">
                        You can select multiple options
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mb-3">
                        Please select one option
                      </p>
                    )}

                    {/* Options */}
                    {onboardingSteps[currentStep - 1].visualOptions ? (
                      // Visual options for usage question - simplified with native components
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        {onboardingSteps[currentStep - 1].options.map(option => (
                          <div
                            key={option.id}
                            onClick={() => handleOptionSelect(option.id)}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Checkbox 
                              checked={isOptionSelected(option.id)}
                              className="pointer-events-none"
                            />
                            <Label className="text-sm font-normal cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Standard options for other questions
                      <div className="space-y-3 mb-8 mt-8">
                        {onboardingSteps[currentStep - 1].options.map(option => (
                          <div
                            key={option.id}
                            onClick={() => handleOptionSelect(option.id)}
                            className="flex items-center gap-2.5 cursor-pointer"
                          >
                            {onboardingSteps[currentStep - 1].multiSelect ? (
                              <Checkbox 
                                checked={isOptionSelected(option.id)}
                                className="pointer-events-none"
                              />
                            ) : (
                              <div 
                                className={`h-4 w-4 rounded-full border-1 shrink-0 flex items-center justify-center transition-colors ${
                                  isOptionSelected(option.id) 
                                    ? "border-primary bg-primary" 
                                    : "border-muted-foreground/50"
                                }`}
                              >
                                {isOptionSelected(option.id) && (
                                  <div className="h-2 w-2 rounded-full bg-primary-foreground"></div>
                                )}
                              </div>
                            )}
                            {hasIcon(option) && (
                              <div className="flex-shrink-0">
                                {renderIcon(option)}
                              </div>
                            )}
                            <Label className="text-sm font-normal cursor-pointer flex-1">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </>
              )}

              {/* Navigation buttons */}
              <div className={`flex ${currentStep >= 1 ? 'justify-between' : 'justify-end'} pt-1`}>
                {currentStep >= 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center"
                >
                  {currentStep === totalSteps - 1 ? (
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
              className="py-4 text-center space-y-3"
            >
              <h2 className="text-lg font-semibold">Building Your Experience</h2>
              <p className="text-muted-foreground text-sm">{currentBuildingPhrase()}</p>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${buildingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Please wait while we set up your personalized dashboard...
              </p>
            </motion.div>
          )}
      </Card>
      </div>
    </div>
  )
}
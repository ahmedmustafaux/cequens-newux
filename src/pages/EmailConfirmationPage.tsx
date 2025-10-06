import * as React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { getLogoAltText, getWelcomeMessage, getAppName } from "@/lib/config"
import { smoothTransition, pageVariants } from "@/lib/transitions"

export default function EmailConfirmationPage() {
  enum ConfirmationStep {
    WAITING,
    SUCCESS
  }

  const [currentStep, setCurrentStep] = useState<ConfirmationStep>(ConfirmationStep.WAITING)
  const [isLoading, setIsLoading] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  // Get user data from location state
  const userData = location.state?.userData || {
    email: "user@example.com",
    firstName: "User",
    lastName: "Name"
  }
  
  // Get the intended redirect path
  const from = location.state?.from?.pathname || "/"
  
  // Generate a confirmation token for simulation
  const confirmationToken = React.useMemo(() => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }, [])

  // Countdown effect for resend code
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [resendCountdown])

  const handleConfirmation = async () => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setCurrentStep(ConfirmationStep.SUCCESS)
    
    toast.success("Email verified successfully!", {
      description: "Your email has been verified. Now we need to verify your phone number.",
      duration: 4000,
    })
    
    // Simulate final email verification
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to phone verification page with user data
    navigate("/phone-verification", { state: { userData, from } })
    
    setIsLoading(false)
  }
  
  const resendConfirmationEmail = async () => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Reset countdown
    setResendCountdown(30)
    
    // Show confirmation email sent toast
    toast.info("Confirmation email resent", {
      description: `We've sent another confirmation link to ${userData.email}. Please check your inbox.`,
      duration: 10000,
    })
    
    setIsLoading(false)
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-lg mx-auto">
        <div className="w-full p-6">
          {/* Logo/Brand */}
          <div className="text-left mb-6 sm:mb-8">
            <div className="h-4 w-auto mb-3 sm:mb-4 py-10">
              <img
                src="/Logo.svg"
                alt={getLogoAltText()}
                className="w-25 h-auto"
              />
            </div>
          </div>

          {currentStep === ConfirmationStep.WAITING ? (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={smoothTransition}
              className="w-full"
            >
              <div className="text-left mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-1">Check your email</h2>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation link to <span className="font-medium">{userData.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Confirmation instructions</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Check your email inbox for a message from {getAppName()}</li>
                          <li>Click the confirmation link in the email</li>
                          <li>You'll be redirected to complete your account setup</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive an email?{" "}
                    <Button
                      type="button"
                      variant="link"
                      onClick={resendConfirmationEmail}
                      disabled={resendCountdown > 0 || isLoading}
                      className={`font-medium transition-colors ${
                        resendCountdown > 0 || isLoading
                          ? 'text-muted-foreground'
                          : 'text-foreground hover:text-foreground/80'
                      }`}
                    >
                      {isLoading ? (
                        'Sending...'
                      ) : resendCountdown > 0 ? (
                        `Resend email (${resendCountdown}s)`
                      ) : (
                        'Resend email'
                      )}
                    </Button>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={smoothTransition}
              className="w-full grid gap-4 text-center"
            >
              <div className="mx-auto">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-500 mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold mb-1">Email verified!</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your email has been successfully verified. Redirecting to phone verification...
                </p>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Demo button completely outside the white container */}
      {currentStep === ConfirmationStep.WAITING && (
        <div className="mt-4 text-center">
          <Button
            type="button"
            variant="link"
            onClick={handleConfirmation}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                <span>Verifying...</span>
              </div>
            ) : (
              "Demo: Simulate Email Confirmation"
            )}
          </Button>
        </div>
      )}
    </>
  )
}
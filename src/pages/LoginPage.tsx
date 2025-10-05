import * as React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Shield, MessageSquare, Phone, Smartphone, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { validateLoginForm, validateEmail, isFormValid, type FieldValidation } from "@/lib/validation"
import { ErrorMessage } from "@/components/ui/error-message"
import { getDemoEmail } from "@/lib/config"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { motion } from "framer-motion"
import { smoothTransition } from "@/lib/transitions"
import { getLogoAltText, getAccountText, getDemoCredentials } from "@/lib/config"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'credentials' | 'otp'>('credentials')
  const [errors, setErrors] = useState<FieldValidation>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const [showVerificationMethods, setShowVerificationMethods] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [generalError, setGeneralError] = useState<string>("")
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  // Get the intended redirect path
  const from = location.state?.from?.pathname || "/"

  // Demo credentials from config
  const demoCredentials = getDemoCredentials()

  // Countdown effect for resend code
  useEffect(() => {
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

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setTouched(prev => ({ ...prev, email: true }))
    
    // Clear errors when user starts typing
    if (errors.email) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.email
        return newErrors
      })
    }
    if (generalError) {
      setGeneralError("")
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setTouched(prev => ({ ...prev, password: true }))
    
    // Clear errors when user starts typing
    if (errors.password) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.password
        return newErrors
      })
    }
    if (generalError) {
      setGeneralError("")
    }
  }

  const handleOtpChange = (value: string) => {
    setOtp(value)
    setTouched(prev => ({ ...prev, otp: true }))
    
    // Clear error when user starts typing
    if (errors.otp) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.otp
        return newErrors
      })
    }

    // Auto-submit when OTP is complete
    if (value.length === 6) {
      setTimeout(() => {
        const form = document.querySelector('form')
        if (form) {
          form.requestSubmit()
        }
      }, 100)
    }
  }

  const validateField = (field: string, value: string) => {
    let validation: any = { isValid: true }
    
    switch (field) {
      case 'email':
        validation = validateEmail(value)
        break
      case 'password':
        if (!value) {
          validation = { isValid: false, message: "Password is required" }
        }
        break
      case 'otp':
        if (value.length === 6 && value !== "000000") { // Only show error for wrong OTP
          validation = { isValid: false, message: "Invalid OTP code" }
        }
        break
    }
    
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [field]: validation }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    let value = ''
    switch (field) {
      case 'email':
        value = email
        break
      case 'password':
        value = password
        break
      case 'otp':
        value = otp
        break
    }
    validateField(field, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (currentStep === 'credentials') {
      // Mark all fields as touched
      setTouched({ email: true, password: true })

      // Validate form
      const formErrors = validateLoginForm(email, password)
      setErrors(formErrors)

      if (!isFormValid(formErrors)) {
        setIsLoading(false)
        return
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check demo credentials
      if (email === demoCredentials.email && password === demoCredentials.password) {
        // Move to OTP step
        setCurrentStep('otp')
        setOtp("")
        setErrors({})
        setTouched({})
        setGeneralError("")
        // Start countdown for resend code
        setResendCountdown(30)
      } else {
        // Show general error instead of individual field errors
        setGeneralError("Invalid email or password")
        setErrors({})
      }
    } else if (currentStep === 'otp') {
      // Mark OTP field as touched
      setTouched({ otp: true })

      if (otp.length !== 6) {
        setIsLoading(false)
        return
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check demo OTP
      if (otp === "000000") {
        toast.success("Welcome back! 👋", {
          description: "You've successfully signed in. Redirecting to your dashboard...",
          duration: 3000,
        })
        
        // Use auth context to login with redirect
        login(email, undefined, from)
      } else {
        // Show error in form
        setErrors({
          otp: { isValid: false, message: "Invalid OTP code" }
        })
      }
    }

    setIsLoading(false)
  }

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email)
    setPassword(demoCredentials.password)
    toast.info("Demo credentials filled! 🔑", {
      description: "Login form has been populated with demo credentials. You can now test the sign-in process.",
      duration: 3000,
    })
  }

  const goBackToCredentials = () => {
    setCurrentStep('credentials')
    setOtp("")
    setErrors({})
    setTouched({})
  }

  const handleOAuthLogin = (provider: string) => {
    toast.info(`${provider} Sign-in Coming Soon`, {
      description: `We're working on ${provider} integration. For now, please use email sign-in.`, 
      duration: 4000,
    })
  }

  const handleResendCode = () => {
    if (resendCountdown > 0 || isResending) return
    setShowVerificationMethods(true)
  }

  const handleSendVerification = async (method: string) => {
    setIsResending(true)
    setSelectedMethod(method)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Start countdown
      setResendCountdown(30)
      
      // Close popup
      setShowVerificationMethods(false)
      setSelectedMethod(null)
      
      const methodNames = {
        email: "email",
        sms: "SMS",
        whatsapp: "WhatsApp",
        call: "phone call"
      }
      
      toast.success("Code sent! 📱", {
        description: `A new verification code has been sent via ${methodNames[method as keyof typeof methodNames]}.`,
        duration: 3000,
      })
    } catch (error) {
      toast.error("Failed to send code", {
        description: "Please try again later or contact support if the issue persists.",
        duration: 4000,
      })
    } finally {
      setIsResending(false)
    }
  }

  const closeVerificationMethods = () => {
    setShowVerificationMethods(false)
    setSelectedMethod(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-6xl mx-auto h-full max-h-[calc(100vh-2rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left Panel - White Background with Form */}
          <motion.div 
            className="bg-white flex items-center justify-center p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={smoothTransition}
          >
            <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-left mb-6 sm:mb-8">
            <div className="h-4 w-auto mb-3 sm:mb-4 py-10">
              <img
                src="/Logo.svg"
                alt={getLogoAltText()}
                className="w-25 h-auto"
              />
            </div>
            {currentStep === 'credentials' && (
              <>
                <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">Welcome back</h1>
                <p className="text-sm text-muted-foreground">Sign in to your {getAccountText()}</p>
              </>
            )}
          </div>

          {/* OAuth Buttons - Only show on credentials step */}
          {currentStep === 'credentials' && (
            <>
              <div className="grid gap-3 mb-4 sm:mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthLogin("Google")}
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleOAuthLogin("GitHub")}
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </Button>
              </div>

              <div className="relative mb-4 sm:mb-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">
            {currentStep === 'credentials' ? (
              <>
                {/* General Error Alert */}
                {generalError && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {generalError}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 sm:top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className="pl-10"
                      autoComplete="email"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 sm:top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 sm:top-3 text-slate-400 hover:text-slate-600 h-auto w-auto p-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      className="h-4 w-4"
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to="#"
                    className="text-sm font-medium text-foreground hover:text-foreground/80"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* Back button */}
                <div className="flex items-center mb-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={goBackToCredentials}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </div>

                {/* OTP Section */}
                <div className="text-left mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-1">Verify your identity</h2>
                      <p className="text-sm text-muted-foreground">
                        We've sent a 6-digit code to {getDemoEmail()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={handleOtpChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the code?{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResendCode}
                        disabled={resendCountdown > 0 || isResending}
                        className={`font-medium transition-colors ${
                          resendCountdown > 0 || isResending
                            ? 'text-muted-foreground'
                            : 'text-foreground hover:text-foreground/80'
                        }`}
                      >
                        {isResending ? (
                          'Sending...'
                        ) : resendCountdown > 0 ? (
                          `Resend code (${resendCountdown}s)`
                        ) : (
                          'Resend code'
                        )}
                      </Button>
                    </p>
                  </div>
                  {touched.otp && errors.otp && errors.otp.message === "Invalid OTP code" && <ErrorMessage message={errors.otp?.message} />}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>
              </>
            )}

            {currentStep === 'credentials' && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-foreground hover:text-foreground/80"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            )}
          </form>

            </div>
          </motion.div>

          {/* Right Panel Wrapper with Margins */}
          <div className="p-4 hidden lg:block">
            {/* Blue Background with Partners */}
            <div className="bg-gray-100 flex flex-col justify-end p-4 relative overflow-hidden h-full rounded-2xl">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-32 h-32 bg-gray-300/30 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-32 w-24 h-24 bg-gray-300/30 rounded-full blur-xl"></div>
              <div className="absolute bottom-32 left-32 w-40 h-40 bg-gray-300/30 rounded-full blur-xl"></div>
              <div className="absolute bottom-20 right-20 w-28 h-28 bg-gray-300/30 rounded-full blur-xl"></div>
            </div>
            
            {/* Partners Section */}
            <div className="relative z-10 text-gray-800">
              <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-6">Our partners</h3>
              <div className="relative overflow-hidden">
                {/* Gradient overlays for smooth edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-100 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-100 to-transparent z-10"></div>
                
                {/* Animated partners */}
                <motion.div 
                  className="flex items-center"
                  animate={{ x: [0, -600] }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    repeatType: "loop",
                    ease: "linear" 
                  }}
                >
                  {/* First set of logos */}
                  {/* Meta */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/meta.svg" alt="Meta" className="max-h-8 max-w-24 object-contain" />
                    </div>
                  </div>
                  
                  {/* Microsoft */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/microsoft.svg" alt="Microsoft" className="max-h-8 max-w-24 object-contain" />
                    </div>
                  </div>
                  
                  {/* AWS */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/aws.svg" alt="AWS" className="max-h-6 max-w-20 object-contain" />
                    </div>
                  </div>
                  
                  {/* Google */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/google.svg" alt="Google" className="max-h-8 max-w-24 object-contain" />
                    </div>
                  </div>
                  
                  {/* MasterCard */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/mastercard.svg" alt="MasterCard" className="max-h-8 max-w-24 object-contain" />
                    </div>
                  </div>

                  {/* Duplicate set for seamless loop */}
                  {/* Meta */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/meta.svg" alt="Meta" className="max-h-8 max-w-24 object-contain" />
                    </div>
                  </div>
                  
                  {/* Microsoft */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/microsoft.svg" alt="Microsoft" className="max-h-8 max-w-24 object-contain" />
                    </div>
                  </div>
                  
                  {/* AWS */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/aws.svg" alt="AWS" className="max-h-6 max-w-20 object-contain" />
                    </div>
                  </div>
                  
                  {/* Google */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/google.svg" alt="Google" className="max-h-8 max-w-24 object-contain" />
                    </div>
                  </div>
                  
                  {/* MasterCard */}
                  <div className="flex-shrink-0 mx-8">
                    <div className="w-28 h-12 flex items-center justify-center">
                      <img src="/logos/mastercard.svg" alt="MasterCard" className="max-h-8 max-w-24 object-contain" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            </div>
      </div>
    </div>

      {/* Verification Methods Dialog */}
      <Dialog open={showVerificationMethods} onOpenChange={setShowVerificationMethods}>
        <DialogContent className="sm:max-w-sm p-4">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-base">Choose verification method</DialogTitle>
            <DialogDescription className="text-xs">
              How would you like to receive your verification code?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {/* Email */}
            <Button
              onClick={() => handleSendVerification('email')}
              disabled={isResending}
              variant="outline"
              className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 h-auto justify-start"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <Mail className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm text-foreground">Email</div>
                <div className="text-xs text-muted-foreground">{getDemoEmail()}</div>
              </div>
            </Button>

            {/* SMS */}
            <Button
              onClick={() => handleSendVerification('sms')}
              disabled={isResending}
              variant="outline"
              className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 h-auto justify-start"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <MessageSquare className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm text-foreground">SMS</div>
                <div className="text-xs text-muted-foreground">+1 (555) 123-4567</div>
              </div>
            </Button>

            {/* WhatsApp */}
            <Button
              onClick={() => handleSendVerification('whatsapp')}
              disabled={isResending}
              variant="outline"
              className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 h-auto justify-start"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <Smartphone className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm text-foreground">WhatsApp</div>
                <div className="text-xs text-muted-foreground">+1 (555) 123-4567</div>
              </div>
            </Button>

            {/* Phone Call */}
            <Button
              onClick={() => handleSendVerification('call')}
              disabled={isResending}
              variant="outline"
              className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 h-auto justify-start"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <Phone className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm text-foreground">Phone Call</div>
                <div className="text-xs text-muted-foreground">+1 (555) 123-4567</div>
              </div>
            </Button>
          </div>

          {isResending && (
            <div className="mt-3 flex items-center justify-center text-xs text-muted-foreground">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-600 border-t-transparent mr-2" />
              Sending verification code...
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

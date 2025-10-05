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
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-[700px]">
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
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    leftIcon={<Mail className="h-4 w-4" />}
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-auto w-auto p-1 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    }
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                  />
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
              <h3 className="text-xs uppercase text-gray-400 font-medium mb-6 text-center">OUR PARTNERS</h3>
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

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, Building, CheckCircle2, AlertCircle, ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { validateSignupForm, validateEmail, validateName, validatePassword, validateConfirmPassword, validateTermsAgreement, isFormValid, type FieldValidation } from "@/lib/validation"
import { ErrorMessage } from "@/components/ui/error-message"
import { PasswordStrength } from "@/components/ui/password-strength"
import { motion } from "framer-motion"
import { getLogoAltText, getWelcomeMessage, getJoinMessage, getDemoCredentials } from "@/lib/config"
import { smoothTransition, fadeVariants, pageVariants } from "@/lib/transitions"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"

export default function SignupPage() {
  // Signup steps
  enum SignupStep {
    FORM,
    VERIFICATION,
    SUCCESS
  }

  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.FORM)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FieldValidation>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationAttempts, setVerificationAttempts] = useState(0)
  const [resendCountdown, setResendCountdown] = useState(0)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const passwordStrengthRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  // Get the intended redirect path
  const from = location.state?.from?.pathname || "/"
  
  // Generate a random verification code for simulation
  const generatedCode = React.useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000).toString()
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateField = (field: string, value: any) => {
    let validation: any = { isValid: true }
    
    switch (field) {
      case 'firstName':
        validation = validateName(value, "First name")
        break
      case 'lastName':
        validation = validateName(value, "Last name")
        break
      case 'companyName':
        if (!value.trim()) {
          validation = { isValid: false, message: "Company name is required" }
        } else if (value.trim().length < 2) {
          validation = { isValid: false, message: "Company name must be at least 2 characters long" }
        }
        break
      case 'email':
        validation = validateEmail(value, true) // true = require business email
        break
      case 'password':
        validation = validatePassword(value)
        break
      case 'confirmPassword':
        validation = validateConfirmPassword(formData.password, value)
        break
      case 'agreeToTerms':
        validation = validateTermsAgreement(value)
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
    validateField(field, formData[field as keyof typeof formData])
    
    if (field === 'password') {
      // Small delay to allow clicking on the strength indicator
      setTimeout(() => {
        if (document.activeElement !== passwordInputRef.current && 
            !passwordStrengthRef.current?.contains(document.activeElement)) {
          setPasswordFocused(false);
        }
      }, 100);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Current step:", currentStep)

    if (currentStep === SignupStep.FORM) {
      console.log("Processing form step")
      // Mark all fields as touched
      const allFields = ['firstName', 'lastName', 'companyName', 'email', 'password', 'confirmPassword', 'agreeToTerms']
      const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
      setTouched(newTouched)

      // Validate entire form
      const formErrors = validateSignupForm(formData)
      setErrors(formErrors)

      if (!isFormValid(formErrors)) {
        toast.error("Please fix the errors below", {
          description: "Check the highlighted fields and correct any validation errors before continuing.",
          duration: 5000,
        })
        setIsLoading(false)
        return
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Show verification code in toast for demo purposes
      toast.info("Verification code sent", {
        description: `For demo purposes, your verification code is: ${generatedCode}`,
        duration: 10000,
      })

      console.log("Moving to verification step")
      // Move to verification step
      setCurrentStep(SignupStep.VERIFICATION)
      setIsLoading(false)
      // Start countdown for resend code
      setResendCountdown(30)
    } 
    else if (currentStep === SignupStep.VERIFICATION) {
      console.log("Verifying code:", verificationCode, "Expected:", generatedCode);
      
      // Verify the code - ensure it's a string comparison
      const enteredCode = verificationCode.toString();
      const expectedCode = generatedCode.toString();
      
      if (enteredCode === expectedCode) {
        console.log("Verification successful");
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setCurrentStep(SignupStep.SUCCESS)
        
        toast.success(getWelcomeMessage(), {
          description: "Your account has been verified successfully. Redirecting to your dashboard...",
          duration: 4000,
        })
        
        // Simulate final account creation
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Use auth context to login
        login(formData.email, `${formData.firstName} ${formData.lastName}`, from)
        
        // Redirect to overview page
        navigate("/")
      } else {
        console.log("Verification failed");
        setVerificationAttempts(prev => prev + 1)
        
        if (verificationAttempts >= 2) {
          toast.error("Too many failed attempts", {
            description: "Please request a new verification code or contact support.",
            duration: 5000,
          })
        } else {
          toast.error("Invalid verification code", {
            description: "Please check the code and try again.",
            duration: 3000,
          })
        }
      }
      
      setIsLoading(false)
    }
  }
  
  const resendVerificationCode = async () => {
    setIsLoading(true)
    
    // Clear current verification code
    setVerificationCode("")
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Reset verification attempts
    setVerificationAttempts(0)
    
    // Reset countdown
    setResendCountdown(30)
    
    // Show verification code in toast for demo purposes
    toast.info("New verification code sent", {
      description: `For demo purposes, your verification code is: ${generatedCode}`,
      duration: 10000,
    })
    
    setIsLoading(false)
  }

  const fillDemoData = () => {
    const demoCredentials = getDemoCredentials()
    setFormData({
      firstName: "John",
      lastName: "Doe",
      companyName: "Acme Corporation",
      email: demoCredentials.email,
      password: demoCredentials.password,
      confirmPassword: demoCredentials.password,
      agreeToTerms: true
    })
    toast.info("Demo data filled! 🚀", {
      description: "Form has been populated with demo information. You can now test the signup process.",
      duration: 3000,
    })
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
            <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">Create your account</h1>
            <p className="text-sm text-muted-foreground">{getJoinMessage()}</p>
          </div>


          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">
            {currentStep === SignupStep.FORM && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={smoothTransition}
                className="grid gap-3 sm:gap-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start content-start">
                  <div className="grid gap-1">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      onBlur={() => handleBlur("firstName")}
                      leftIcon={<User className="h-4 w-4" />}
                      className={`${touched.firstName && errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    {touched.firstName && <ErrorMessage message={errors.firstName?.message} />}
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      onBlur={() => handleBlur("lastName")}
                      className={`${touched.lastName && errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    {touched.lastName && <ErrorMessage message={errors.lastName?.message} />}
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Corporation"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    onBlur={() => handleBlur("companyName")}
                    leftIcon={<Building className="h-4 w-4" />}
                    className={`${touched.companyName && errors.companyName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    autoComplete="organization"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                  />
                  {touched.companyName && <ErrorMessage message={errors.companyName?.message} />}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="email">Business email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    leftIcon={<Mail className="h-4 w-4" />}
                    className={`${touched.email && errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                  />
                  {touched.email && <ErrorMessage message={errors.email?.message} />}
                </div>

                <div className="grid gap-1 relative">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
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
                      className={`${touched.password && errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    
                    {/* Password Strength Tooltip - Fixed to prevent clipping */}
                    {passwordFocused && (
                      <div 
                        ref={passwordStrengthRef}
                        className="bg-white p-3 rounded-md shadow-md border border-gray-200 z-50 w-auto"
                        style={{ 
                          position: 'fixed',
                          left: passwordInputRef.current ? 
                            passwordInputRef.current.getBoundingClientRect().left + 
                            passwordInputRef.current.getBoundingClientRect().width + 10 : 'auto',
                          top: passwordInputRef.current ? 
                            passwordInputRef.current.getBoundingClientRect().top : 'auto'
                        }}
                      >
                        <PasswordStrength password={formData.password} />
                      </div>
                    )}
                    
                    {/* Display password errors inline */}
                    {touched.password && errors.password && (
                      <ErrorMessage message={errors.password?.message} />
                    )}
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="h-auto w-auto p-1 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    }
                    className={`${touched.confirmPassword && errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                  />
                  {touched.confirmPassword && <ErrorMessage message={errors.confirmPassword?.message} />}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    onBlur={() => handleBlur("agreeToTerms")}
                    className={`mt-1 ${touched.agreeToTerms && errors.agreeToTerms ? 'border-red-300' : ''}`}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the{" "}
                    <Link to="#" className="text-sm font-medium text-foreground hover:text-foreground/80">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="text-sm font-medium text-foreground hover:text-foreground/80">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {touched.agreeToTerms && <ErrorMessage message={errors.agreeToTerms?.message} />}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !isFormValid(errors)}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </motion.div>
            )}

            {currentStep === SignupStep.VERIFICATION && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={smoothTransition}
                className="grid gap-4"
              >
                <div className="text-left mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground mb-1">Verify your identity</h2>
                      <p className="text-sm text-muted-foreground">
                        We've sent a 6-digit code to <span className="font-medium">{formData.email}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="otp" className="text-sm font-medium">Verification Code</Label>
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={setVerificationCode}
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
                      Didn't receive a code?{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={resendVerificationCode}
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
                          `Resend code (${resendCountdown}s)`
                        ) : (
                          'Resend code'
                        )}
                      </Button>
                    </p>
                  </div>
                  {verificationAttempts > 0 && verificationCode !== generatedCode && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                      Invalid verification code. Please try again.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify & Create Account"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setCurrentStep(SignupStep.FORM)}
                  disabled={isLoading}
                >
                  Back to signup
                </Button>
              </motion.div>
            )}

            {currentStep === SignupStep.SUCCESS && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={smoothTransition}
                className="grid gap-4 text-center"
              >
                <div className="mx-auto">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-500 mb-4">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-semibold mb-1">Account verified!</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your account has been successfully verified. Redirecting to dashboard...
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

            {currentStep === SignupStep.FORM && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-foreground hover:text-foreground/80"
                  >
                    Sign in
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
    </div>
  )
}

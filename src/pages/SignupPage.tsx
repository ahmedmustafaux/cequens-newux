import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, Building, CheckCircle2, AlertCircle, ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Field, 
  FieldLabel, 
  FieldContent, 
  FieldDescription, 
  FieldError 
} from "@/components/ui/field"
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon 
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { validateSignupForm, validateEmail, validateName, validatePassword, validateConfirmPassword, validateTermsAgreement, isFormValid, type FieldValidation } from "@/lib/validation"
import { ErrorMessage } from "@/components/ui/error-message"
import { PasswordStrength } from "@/components/ui/password-strength"
import { motion } from "framer-motion"
import { getLogoAltText, getWelcomeMessage, getJoinMessage, getDemoCredentials, getAppName } from "@/lib/config"
import { smoothTransition, fadeVariants, pageVariants } from "@/lib/transitions"

export default function SignupPage() {
  // Signup step
  enum SignupStep {
    FORM
  }

  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.FORM)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FieldValidation>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})
  const [passwordFocused, setPasswordFocused] = useState(false)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const passwordStrengthRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  // Get the intended redirect path
  const from = location.state?.from?.pathname || "/"
  

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

    // Show confirmation email sent toast
    toast.info("Confirmation email sent", {
      description: `We've sent a confirmation link to ${formData.email}. Please check your inbox.`,
      duration: 10000,
    })

    console.log("Redirecting to email confirmation page")
    
    // Redirect to email confirmation page with user data
    navigate("/email-confirmation", { 
      state: { 
        userData: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        },
        from: from
      } 
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
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Left Panel - White Background with Form */}
          <motion.div 
            className="bg-white flex items-center justify-center p-6 h-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={smoothTransition}
          >
            <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-left mb-6 sm:mb-8">
            <div className="h-4 w-auto mb-3 sm:mb-4 py-6">
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
                {/* Social Login Options */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => {
                      toast.info("Google login", {
                        description: "Google authentication would be initiated here.",
                        duration: 3000,
                      })
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                    onClick={() => {
                      toast.info("Microsoft login", {
                        description: "Microsoft authentication would be initiated here.",
                        duration: 3000,
                      })
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" className="h-5 w-5">
                      <path fill="#f25022" d="M1 1h10v10H1z"/>
                      <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                      <path fill="#7fba00" d="M12 1h10v10H12z"/>
                      <path fill="#ffb900" d="M12 12h10v10H12z"/>
                    </svg>
                    <span>Sign in with Microsoft</span>
                  </Button>
                </div>
                
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start content-start">
                  <Field>
                    <FieldLabel htmlFor="firstName">First name</FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupAddon>
                          <User className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          onBlur={() => handleBlur("firstName")}
                          className={`${touched.firstName && errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          required
                        />
                      </InputGroup>
                      {touched.firstName && errors.firstName && <FieldError>{errors.firstName.message}</FieldError>}
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
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
                      </InputGroup>
                      {touched.lastName && errors.lastName && <FieldError>{errors.lastName.message}</FieldError>}
                    </FieldContent>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="companyName">Company name</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupAddon>
                        <Building className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="companyName"
                        type="text"
                        placeholder="Acme Corporation"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        onBlur={() => handleBlur("companyName")}
                        className={`${touched.companyName && errors.companyName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        autoComplete="organization"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                    </InputGroup>
                    {touched.companyName && errors.companyName && <FieldError>{errors.companyName.message}</FieldError>}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupAddon>
                        <Mail className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={`${touched.email && errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        autoComplete="email"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                    </InputGroup>
                    {touched.email && errors.email && <FieldError>{errors.email.message}</FieldError>}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <InputGroup>
                        <InputGroupAddon>
                          <Lock className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="password"
                          ref={passwordInputRef}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => handleBlur("password")}
                          className={`${touched.password && errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                          autoComplete="new-password"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          required
                        />
                        <InputGroupAddon align="inline-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            className="h-auto w-auto p-1 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                      
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
                    </div>
                    {touched.password && errors.password && <FieldError>{errors.password.message}</FieldError>}
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupAddon>
                        <Lock className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                        className={`${touched.confirmPassword && errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="h-auto w-auto p-1 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {touched.confirmPassword && errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
                  </FieldContent>
                </Field>

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


            {currentStep === SignupStep.FORM && (
              <div className="text-center m-2 mb-4">
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

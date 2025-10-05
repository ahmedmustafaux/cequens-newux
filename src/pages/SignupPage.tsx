import * as React from "react"
import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
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
import { smoothTransition } from "@/lib/transitions"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
      case 'email':
        validation = validateEmail(value)
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mark all fields as touched
    const allFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'agreeToTerms']
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

    toast.success(getWelcomeMessage(), {
      description: "Your account has been created successfully. Redirecting to your dashboard...",
      duration: 4000,
    })
    
    // Use auth context to login
    login(formData.email, `${formData.firstName} ${formData.lastName}`, from)
    
    // Redirect to overview page
    navigate("/")

    setIsLoading(false)
  }

  const fillDemoData = () => {
    const demoCredentials = getDemoCredentials()
    setFormData({
      firstName: "John",
      lastName: "Doe",
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

  const handleOAuthSignup = (provider: string) => {
    toast.info(`${provider} Sign-up Coming Soon`, {
      description: `We're working on ${provider} integration. For now, please use email sign-up.`, 
      duration: 4000,
    })
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
            <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">Create your account</h1>
            <p className="text-sm text-muted-foreground">{getJoinMessage()}</p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid gap-3 mb-4 sm:mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthSignup("Google")}
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
              onClick={() => handleOAuthSignup("GitHub")}
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start content-start">
                  <div className="grid gap-1">
                    <Label htmlFor="firstName">First name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 sm:top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        onBlur={() => handleBlur("firstName")}
                        className={`pl-10 ${touched.firstName && errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                      {touched.firstName && <ErrorMessage message={errors.firstName?.message} />}
                    </div>
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
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 sm:top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`pl-10 ${touched.email && errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      autoComplete="email"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    {touched.email && <ErrorMessage message={errors.email?.message} />}
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 sm:top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      className={`pl-10 pr-10 ${touched.password && errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    {touched.password && <ErrorMessage message={errors.password?.message} />}
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
                  {formData.password && (
                    <PasswordStrength password={formData.password} className="mt-2" />
                  )}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 sm:top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      className={`pl-10 pr-10 ${touched.confirmPassword && errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                    {touched.confirmPassword && <ErrorMessage message={errors.confirmPassword?.message} />}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 sm:top-3 text-slate-400 hover:text-slate-600 h-auto w-auto p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
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
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create account"
              )}
            </Button>

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
    </div>
  )
}

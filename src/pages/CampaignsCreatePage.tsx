import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { usePageTitle } from "@/hooks/use-dynamic-title"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { 
  Field, 
  FieldLabel, 
  FieldContent, 
  FieldDescription,
  FieldError
} from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeaderWithActions } from "@/components/page-header"
import { CardSkeleton } from "@/components/ui/card"
import { Save, X, Users, Clock, Eye, Send, Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { EnvelopeSimple, ChatText } from "phosphor-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { pageVariants, smoothTransition } from "@/lib/transitions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateCampaign } from "@/hooks/use-campaigns"
import { useSegments } from "@/hooks/use-segments"
import { useContacts } from "@/hooks/use-contacts"
import type { Campaign } from "@/lib/supabase/types"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface CampaignFormData {
  name: string
  type: "Email" | "SMS" | "Whatsapp" | ""
  status: "Draft" | "Active" | "Completed"
  selectedSegmentId: string
  recipients: number
  description: string
  subject: string
  message: string
  scheduleType: "now" | "scheduled"
  scheduledDate: string
  scheduledTime: string
}

export default function CampaignsCreatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const createCampaignMutation = useCreateCampaign()
  const { data: segments = [], isLoading: segmentsLoading } = useSegments()
  const { data: allContacts = [] } = useContacts(undefined, true) // Get all contacts for "All contacts" option
  
  const [isDirty, setIsDirty] = React.useState(false)
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = React.useState(0)
  
  const steps = [
    { id: 0, label: "Details", description: "Campaign information" },
    { id: 1, label: "Content", description: "Message content" },
    { id: 2, label: "Schedule", description: "Send timing" }
  ]
  
  usePageTitle("Create Campaign")

  // Get current date/time for scheduling
  const now = new Date()
  const defaultDate = now.toISOString().split('T')[0]
  const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  // Initialize form data
  const [formData, setFormData] = React.useState<CampaignFormData>({
    name: "",
    type: "",
    status: "Draft",
    selectedSegmentId: "",
    recipients: 0,
    description: "",
    subject: "",
    message: "",
    scheduleType: "now",
    scheduledDate: defaultDate,
    scheduledTime: defaultTime
  })

  // Get selected segment to calculate recipients
  const selectedSegment = React.useMemo(() => {
    if (!formData.selectedSegmentId) return null
    if (formData.selectedSegmentId === "all-contacts") return { id: "all-contacts", name: "All Contacts", contact_ids: allContacts.map(c => c.id) }
    return segments.find(s => s.id === formData.selectedSegmentId) || null
  }, [segments, formData.selectedSegmentId, allContacts])

  // Calculate recipients from selected segment
  React.useEffect(() => {
    if (selectedSegment) {
      setFormData(prev => ({
        ...prev,
        recipients: selectedSegment.contact_ids?.length || 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        recipients: 0
      }))
    }
  }, [selectedSegment])

  // Check if we have selected contacts from navigation state
  React.useEffect(() => {
    const state = location.state as { selectedContactIds?: string[] } | null
    if (state?.selectedContactIds && state.selectedContactIds.length > 0) {
      setFormData(prev => ({
        ...prev,
        recipients: state.selectedContactIds!.length
      }))
    }
  }, [location.state])

  // Simulate initial page loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field: keyof CampaignFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setIsDirty(true)
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Character limits based on type
  const getCharacterLimit = () => {
    switch (formData.type) {
      case "SMS":
        return 160
      case "Whatsapp":
        return 4096
      case "Email":
        return 10000
      default:
        return 10000
    }
  }

  const getMessageLength = formData.message.length
  const characterLimit = getCharacterLimit()
  const isOverLimit = getMessageLength > characterLimit

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = "Campaign name is required"
    }

    if (!formData.type) {
      errors.type = "Campaign type is required"
    }

    if (formData.type === "Email" && !formData.subject.trim()) {
      errors.subject = "Subject line is required for email campaigns"
    }

    if (!formData.message.trim()) {
      errors.message = "Message content is required"
    } else if (isOverLimit) {
      errors.message = `Message exceeds ${characterLimit} character limit`
    }

    if (formData.selectedSegmentId && formData.selectedSegmentId !== "all-contacts" && formData.recipients === 0) {
      errors.selectedSegmentId = "Selected segment has no contacts"
    }
    if (formData.selectedSegmentId === "all-contacts" && allContacts.length === 0) {
      errors.selectedSegmentId = "No contacts available"
    }

    if (formData.scheduleType === "scheduled") {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
      if (scheduledDateTime < now) {
        errors.scheduledDate = "Scheduled date must be in the future"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    if (step === 0) {
      // Validate Details step
      if (!formData.name.trim()) {
        errors.name = "Campaign name is required"
      }
      if (!formData.type) {
        errors.type = "Campaign type is required"
      }
      if (formData.selectedSegmentId && formData.selectedSegmentId !== "all-contacts" && formData.recipients === 0) {
        errors.selectedSegmentId = "Selected segment has no contacts"
      }
      if (formData.selectedSegmentId === "all-contacts" && allContacts.length === 0) {
        errors.selectedSegmentId = "No contacts available"
      }
    } else if (step === 1) {
      // Validate Content step
      if (formData.type === "Email" && !formData.subject.trim()) {
        errors.subject = "Subject line is required for email campaigns"
      }
      if (!formData.message.trim()) {
        errors.message = "Message content is required"
      } else if (isOverLimit) {
        errors.message = `Message exceeds ${characterLimit} character limit`
      }
    } else if (step === 2) {
      // Validate Schedule step
      if (formData.scheduleType === "scheduled") {
        const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
        if (scheduledDateTime < now) {
          errors.scheduledDate = "Scheduled date must be in the future"
        }
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      toast.error("Please fix the errors before continuing")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      // Go to first step with errors
      if (!formData.name.trim() || !formData.type) {
        setCurrentStep(0)
      } else if (formData.type === "Email" && !formData.subject.trim() || !formData.message.trim()) {
        setCurrentStep(1)
      } else {
        setCurrentStep(2)
      }
      return
    }

    try {
      const scheduledDateTime = formData.scheduleType === "scheduled" 
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
        : null

      const campaignData: Omit<Campaign, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
        name: formData.name.trim(),
        type: formData.type as "Email" | "SMS" | "Whatsapp",
        status: formData.scheduleType === "now" ? "Active" : "Draft",
        recipients: formData.recipients,
        sent_date: formData.scheduleType === "now" 
          ? new Date().toISOString() 
          : scheduledDateTime,
        open_rate: 0,
        click_rate: 0,
      }

      await createCampaignMutation.mutateAsync(campaignData)
      toast.success(
        formData.scheduleType === "scheduled" 
          ? "Campaign scheduled successfully!" 
          : "Campaign created successfully!"
      )
      navigate("/campaigns")
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast.error("Failed to create campaign. Please try again.")
    }
  }

  const handleDiscard = () => {
    if (isDirty) {
      const confirmed = window.confirm("Are you sure you want to discard your changes?")
      if (confirmed) {
        navigate("/campaigns")
      }
    } else {
      navigate("/campaigns")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Email":
        return <EnvelopeSimple className="h-4 w-4" weight="fill" />
      case "SMS":
        return <ChatText className="h-4 w-4" weight="fill" />
      case "Whatsapp":
        return <img src="/icons/WhatsApp.svg" alt="WhatsApp" className="h-4 w-4" />
      default:
        return null
    }
  }

  const canSave = formData.name.trim() !== "" && formData.type !== "" && formData.message.trim() !== "" && !isOverLimit && !createCampaignMutation.isPending

  // Preview message
  const previewMessage = React.useMemo(() => {
    if (!formData.message) return ""
    return formData.message
  }, [formData.message])

  return (
    <PageWrapper isLoading={isInitialLoading}>
      <PageHeaderWithActions
        title="Create Campaign"
        description="Set up and schedule your marketing campaign"
        isLoading={isInitialLoading}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleDiscard}
            disabled={createCampaignMutation.isPending || isInitialLoading}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        {isInitialLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 grid gap-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="grid gap-4 auto-rows-min">
              <CardSkeleton />
            </div>
          </div>
        ) : (
          <motion.div 
            className="w-full"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={smoothTransition}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              {/* Main Content */}
              <div className="lg:col-span-2 grid grid-cols-1 gap-4 items-start">
                {/* Step Indicator */}
                <div className="relative py-4 px-4 sm:px-6">
                  {/* Steps container */}
                  <div className="relative flex items-start justify-between">
                    {/* Progress line background - from center of first to center of last circle */}
                    <div 
                      className="absolute top-4 h-0.5 bg-muted"
                      style={{
                        left: '1.25rem', // Half of w-10 (2.5rem)
                        right: '1.25rem', // Half of w-10 (2.5rem)
                      }}
                    />
                    
                    {/* Progress fill - calculate based on completed segments */}
                    {currentStep > 0 && (
                      <div 
                        className="absolute top-4 h-0.5 bg-primary transition-all duration-300"
                        style={{
                          left: '1.25rem',
                          width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 1.25rem)`
                        }}
                      />
                    )}
                    
                    {/* Steps */}
                    {steps.map((step, index) => {
                      const isActive = currentStep === step.id
                      const isCompleted = currentStep > step.id
                      
                      return (
                        <div key={step.id} className="flex flex-col items-start flex-1 relative z-10">
                          <div className="flex flex-col items-start gap-2 w-full">
                            {/* Step circle */}
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors flex-shrink-0 bg-background ${
                                isActive || isCompleted
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-muted-foreground/30 text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <span className="text-xs font-semibold">{step.id + 1}</span>
                              )}
                            </div>
                            {/* Step labels */}
                            <div className="flex flex-col items-start min-w-0 mt-1">
                              <span
                                className={`text-sm font-medium text-left ${
                                  isActive || isCompleted
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {step.label}
                              </span>
                              <span className="text-xs text-muted-foreground text-left mt-0.5">
                                {step.description}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Step Content */}
                <div className="space-y-4">
                  {/* Step 1: Details */}
                  {currentStep === 0 && (
                    <Card className="py-5 gap-5">
                      <CardHeader>
                        <CardTitle>Campaign Details</CardTitle>
                        <CardDescription>Enter the basic information for your campaign</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Field>
                          <FieldLabel>Campaign Name *</FieldLabel>
                          <FieldContent>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              placeholder="e.g., Summer Sale 2024"
                              className={formErrors.name ? "border-destructive" : ""}
                            />
                          </FieldContent>
                          {formErrors.name && <FieldError>{formErrors.name}</FieldError>}
                        </Field>

                        <Field>
                          <FieldLabel>Campaign Type *</FieldLabel>
                          <FieldContent>
                            <div className="grid grid-cols-3 gap-4">
                              <Card
                                className={`cursor-pointer shadow-none ${
                                  formData.type === "Whatsapp" 
                                    ? "border-primary border-2" 
                                    : formErrors.type 
                                      ? "border-destructive border-2" 
                                      : ""
                                }`}
                                onClick={() => {
                                  handleInputChange("type", "Whatsapp")
                                  // Reset message when type changes
                                  if (formData.message) {
                                    handleInputChange("message", "")
                                  }
                                }}
                              >
                                <CardContent className="p-4 flex flex-col items-left gap-4 text-left">
                                  <img 
                                    src="/icons/WhatsApp.svg" 
                                    alt="WhatsApp" 
                                    className="h-6 w-6" 
                                  />
                                  <div className="flex flex-col items-left gap-1">
                                    <span className="text-sm font-semibold text-foreground">
                                      WhatsApp
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      Interactive
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card
                                className={`cursor-pointer shadow-none ${
                                  formData.type === "SMS" 
                                    ? "border-primary border-2" 
                                    : formErrors.type 
                                      ? "border-destructive border-2" 
                                      : ""
                                }`}
                                onClick={() => {
                                  handleInputChange("type", "SMS")
                                  // Reset message when type changes
                                  if (formData.message) {
                                    handleInputChange("message", "")
                                  }
                                }}
                              >
                                <CardContent className="p-4 flex flex-col items-left gap-4 text-left">
                                  <ChatText 
                                    className="h-6 w-6 text-primary" 
                                    weight="fill" 
                                  />
                                  <div className="flex flex-col items-left gap-1">
                                    <span className="text-sm font-semibold text-foreground">
                                      SMS
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      Quick messages
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Card
                                        className={`shadow-none cursor-not-allowed ${
                                          formErrors.type 
                                            ? "border-destructive border-2" 
                                            : ""
                                        }`}
                                      >
                                        <CardContent className="p-4 flex flex-col items-left gap-4 text-left">
                                          <EnvelopeSimple 
                                            className="h-6 w-6 text-blue-600 dark:text-blue-400 opacity-50" 
                                            weight="fill" 
                                          />
                                          <div className="flex flex-col items-left gap-1">
                                            <div className="flex items-center gap-2">
                                              <span className="text-sm font-semibold text-foreground opacity-50">
                                                Email
                                              </span>
                                              <Badge variant="secondary" className="text-xs">
                                                Not configured
                                              </Badge>
                                            </div>
                                            <span className="text-xs text-muted-foreground opacity-50">
                                              Rich content
                                            </span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="p-3">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm">Email channel needs to be configured</p>
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-primary underline"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          navigate("/campaigns/settings")
                                        }}
                                      >
                                        Configure
                                      </Button>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </FieldContent>
                          {formErrors.type && <FieldError>{formErrors.type}</FieldError>}
                        </Field>

                        <Field>
                          <FieldLabel>Select Audience *</FieldLabel>
                          <FieldContent>
                            <Select
                              value={formData.selectedSegmentId}
                              onValueChange={(value) => handleInputChange("selectedSegmentId", value)}
                              disabled={segmentsLoading}
                            >
                              <SelectTrigger className={formErrors.selectedSegmentId ? "border-destructive" : ""}>
                                <SelectValue placeholder={segmentsLoading ? "Loading segments..." : "Select a segment"} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all-contacts">
                                  <div className="flex items-center justify-between w-full gap-8">
                                    <span>All Contacts</span>
                                    <Badge variant="secondary">
                                      {allContacts.length} contacts
                                    </Badge>
                                  </div>
                                </SelectItem>
                                {segments.length === 0 ? (
                                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                    No segments available. <br />
                                    <Button 
                                      variant="link" 
                                      className="mt-2 h-auto p-0"
                                      onClick={() => navigate("/contacts/segments")}
                                    >
                                      Create a segment first
                                    </Button>
                                  </div>
                                ) : (
                                  segments.map((segment) => {
                                    const capitalizedName = segment.name.charAt(0).toUpperCase() + segment.name.slice(1)
                                    return (
                                      <SelectItem key={segment.id} value={segment.id}>
                                        <div className="flex items-center justify-between w-full gap-8">
                                          <span>{capitalizedName}</span>
                                          <Badge variant="secondary">
                                            {segment.contact_ids?.length || 0} contacts
                                          </Badge>
                                        </div>
                                      </SelectItem>
                                    )
                                  })
                                )}
                              </SelectContent>
                            </Select>
                          </FieldContent>
                          {formErrors.selectedSegmentId && <FieldError>{formErrors.selectedSegmentId}</FieldError>}
                          <FieldDescription>
                            {selectedSegment ? (
                              <span className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {formData.recipients.toLocaleString()} contact{formData.recipients !== 1 ? 's' : ''} will receive this campaign
                              </span>
                            ) : (
                              "Select a segment to target your campaign"
                            )}
                          </FieldDescription>
                        </Field>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 2: Content */}
                  {currentStep === 1 && (
                    <Card className="py-5 gap-5">
                      <CardHeader>
                        <CardTitle>Message Content</CardTitle>
                        <CardDescription>Write your campaign message</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {formData.type === "Email" && (
                          <Field>
                            <FieldLabel>Subject Line *</FieldLabel>
                            <FieldContent>
                              <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => handleInputChange("subject", e.target.value)}
                                placeholder="Enter email subject line"
                                className={formErrors.subject ? "border-destructive" : ""}
                                maxLength={100}
                              />
                            </FieldContent>
                            {formErrors.subject && <FieldError>{formErrors.subject}</FieldError>}
                            <FieldDescription>
                              {formData.subject.length}/100 characters
                            </FieldDescription>
                          </Field>
                        )}

                        <Field>
                          <FieldLabel>
                            Message Content *
                            {formData.type && (
                              <span className="ml-2 text-xs text-muted-foreground font-normal">
                                (Max {characterLimit.toLocaleString()} characters)
                              </span>
                            )}
                          </FieldLabel>
                          <FieldContent>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleInputChange("message", e.target.value)}
                              placeholder={
                                formData.type === "Email" 
                                  ? "Write your email message here..."
                                  : formData.type === "SMS"
                                  ? "Write your SMS message here (160 characters recommended)..."
                                  : "Write your WhatsApp message here..."
                              }
                              className={`min-h-[200px] ${formErrors.message ? "border-destructive" : ""} ${isOverLimit ? "border-destructive" : ""}`}
                              maxLength={characterLimit + 100} // Allow typing over limit to show error
                            />
                          </FieldContent>
                          {formErrors.message && <FieldError>{formErrors.message}</FieldError>}
                          <FieldDescription>
                            <span className={isOverLimit ? "text-destructive" : ""}>
                              {getMessageLength.toLocaleString()}/{characterLimit.toLocaleString()} characters
                              {formData.type === "SMS" && getMessageLength > 160 && (
                                <span className="ml-2 text-muted-foreground">
                                  ({Math.ceil(getMessageLength / 160)} SMS)
                                </span>
                              )}
                            </span>
                          </FieldDescription>
                        </Field>

                        {formData.type && formData.message && (
                          <>
                            <Separator />
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <FieldLabel>Preview</FieldLabel>
                              </div>
                              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                                {formData.type === "Email" && formData.subject && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                                    <p className="font-medium">{formData.subject}</p>
                                  </div>
                                )}
                                <div>
                                  {formData.type === "Email" && (
                                    <p className="text-xs text-muted-foreground mb-1">Message:</p>
                                  )}
                                  <p className="text-sm whitespace-pre-wrap">{previewMessage}</p>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 3: Schedule */}
                  {currentStep === 2 && (
                    <Card className="py-5 gap-5">
                      <CardHeader>
                        <CardTitle>Schedule Campaign</CardTitle>
                        <CardDescription>Choose when to send your campaign</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Field>
                          <FieldLabel>Send Timing</FieldLabel>
                          <FieldContent>
                            <RadioGroup
                              value={formData.scheduleType}
                              onValueChange={(value) => handleInputChange("scheduleType", value as "now" | "scheduled")}
                            >
                              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                                <RadioGroupItem value="now" id="now" />
                                <Label htmlFor="now" className="flex-1 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Send className="h-4 w-4" />
                                    <div>
                                      <p className="font-medium">Send Now</p>
                                      <p className="text-xs text-muted-foreground">Send immediately when campaign is activated</p>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                                <RadioGroupItem value="scheduled" id="scheduled" />
                                <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <div>
                                      <p className="font-medium">Schedule for Later</p>
                                      <p className="text-xs text-muted-foreground">Choose a specific date and time</p>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FieldContent>
                        </Field>

                        {formData.scheduleType === "scheduled" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                              <FieldLabel>Date *</FieldLabel>
                              <FieldContent>
                                <Input
                                  type="date"
                                  value={formData.scheduledDate}
                                  onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                                  min={defaultDate}
                                  className={formErrors.scheduledDate ? "border-destructive" : ""}
                                />
                              </FieldContent>
                              {formErrors.scheduledDate && <FieldError>{formErrors.scheduledDate}</FieldError>}
                            </Field>
                            <Field>
                              <FieldLabel>Time *</FieldLabel>
                              <FieldContent>
                                <Input
                                  type="time"
                                  value={formData.scheduledTime}
                                  onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                                  className={formErrors.scheduledTime ? "border-destructive" : ""}
                                />
                              </FieldContent>
                            </Field>
                          </div>
                        )}

                        {formData.scheduleType === "scheduled" && (
                          <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-3">
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                              <div className="text-sm">
                                <p className="font-medium text-blue-900 dark:text-blue-100">
                                  Scheduled for {new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toLocaleString()}
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                  Campaign will be sent automatically at the scheduled time
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation Buttons */}
                  <Card className="py-4">
                    <CardContent className="px-4 sm:px-6">
                      <div className="flex items-center justify-between gap-4">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentStep === 0}
                          className="flex-shrink-0"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Previous</span>
                        </Button>
                        <div className="text-sm text-muted-foreground text-center hidden sm:block">
                          Step {currentStep + 1} of {steps.length}
                        </div>
                        <div className="text-xs text-muted-foreground text-center sm:hidden">
                          {currentStep + 1}/{steps.length}
                        </div>
                        {currentStep < steps.length - 1 ? (
                          <Button onClick={handleNext} className="flex-shrink-0">
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="h-4 w-4 sm:ml-2" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSave}
                            disabled={!canSave || isInitialLoading}
                            className="flex-shrink-0"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">
                              {createCampaignMutation.isPending 
                                ? "Creating..." 
                                : formData.scheduleType === "scheduled" 
                                  ? "Schedule Campaign" 
                                  : "Send Now"}
                            </span>
                            <span className="sm:hidden">
                              {createCampaignMutation.isPending ? "Creating..." : "Save"}
                            </span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sidebar */}
              <div className="grid grid-cols-1 gap-4 items-start">
                {/* Summary */}
                <Card className="py-5 gap-5">
                  <CardHeader>
                    <CardTitle>Campaign Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                        <div className="flex items-center gap-2 mt-1">
                          {formData.type && getTypeIcon(formData.type)}
                          <p className="text-sm">{formData.type || "Not selected"}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Recipients</label>
                        <p className="text-sm mt-1">
                          {formData.recipients > 0 ? (
                            <span className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {formData.recipients.toLocaleString()} contact{formData.recipients !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            "No recipients selected"
                          )}
                        </p>
                      </div>
                      {formData.type && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Message Length</label>
                          <p className="text-sm mt-1">
                            {getMessageLength.toLocaleString()} / {characterLimit.toLocaleString()} characters
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  )
}

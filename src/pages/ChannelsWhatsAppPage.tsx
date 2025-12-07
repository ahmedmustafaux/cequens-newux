import * as React from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { pageVariants } from "@/lib/transitions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Phone,
  Building2,
  Key,
  Webhook,
  MessageSquare,
  Shield,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Lightbulb,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ConfigStep {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "upcoming"
}

interface ResourceLink {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  type: "documentation" | "video" | "guide" | "tip"
}

export default function ChannelsWhatsAppPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [showAccessToken, setShowAccessToken] = React.useState(false)
  const [showWebhookToken, setShowWebhookToken] = React.useState(false)
  
  // Form state
  const [formData, setFormData] = React.useState({
    businessAccountId: "",
    phoneNumberId: "",
    accessToken: "",
    webhookUrl: "",
    webhookVerifyToken: "",
    displayName: "",
    about: "",
    phoneNumber: "",
  })

  const steps: ConfigStep[] = [
    {
      id: "meta-account",
      title: "Meta Business Account",
      description: "Create or connect your Meta Business Account",
      status: currentStep === 0 ? "current" : currentStep > 0 ? "completed" : "upcoming",
    },
    {
      id: "whatsapp-account",
      title: "WhatsApp Business Account",
      description: "Set up your WhatsApp Business Account",
      status: currentStep === 1 ? "current" : currentStep > 1 ? "completed" : "upcoming",
    },
    {
      id: "phone-number",
      title: "Phone Number",
      description: "Add and verify your business phone number",
      status: currentStep === 2 ? "current" : currentStep > 2 ? "completed" : "upcoming",
    },
    {
      id: "api-credentials",
      title: "API Credentials",
      description: "Configure your API access credentials",
      status: currentStep === 3 ? "current" : currentStep > 3 ? "completed" : "upcoming",
    },
    {
      id: "webhook",
      title: "Webhook Setup",
      description: "Configure webhooks to receive messages",
      status: currentStep === 4 ? "current" : currentStep > 4 ? "completed" : "upcoming",
    },
  ]

  // Resources for the right panel
  const resources: ResourceLink[] = [
    {
      title: "WhatsApp Cloud API Documentation",
      description: "Official Meta documentation for WhatsApp Business API",
      href: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started",
      icon: <BookOpen className="w-4 h-4" />,
      type: "documentation"
    },
    {
      title: "Business Management API",
      description: "Learn how to manage your WhatsApp Business Account",
      href: "https://developers.facebook.com/docs/whatsapp/business-management-api",
      icon: <FileText className="w-4 h-4" />,
      type: "documentation"
    },
    {
      title: "Getting Started Video",
      description: "Watch a step-by-step setup tutorial",
      href: "https://www.youtube.com/watch?v=example",
      icon: <Video className="w-4 h-4" />,
      type: "video"
    },
    {
      title: "Best Practices Guide",
      description: "Tips for optimizing your WhatsApp messaging",
      href: "#",
      icon: <Lightbulb className="w-4 h-4" />,
      type: "guide"
    },
    {
      title: "Common Issues & Solutions",
      description: "Troubleshoot common setup problems",
      href: "#",
      icon: <HelpCircle className="w-4 h-4" />,
      type: "tip"
    },
  ]

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      toast.success("Step completed!")
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTestConnection = () => {
    toast.info("Testing connection...")
    setTimeout(() => {
      toast.success("Connection successful!")
    }, 1500)
  }

  const handleSaveConfiguration = () => {
    toast.success("Configuration saved successfully!")
  }

  const renderStepIcon = (step: ConfigStep, index: number) => {
    if (step.status === "completed") {
      return (
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
      )
    }
    if (step.status === "current") {
      return (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-sm font-semibold text-white">{index + 1}</span>
        </div>
      )
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-500">{index + 1}</span>
      </div>
    )
  }

  const getResourceIconColor = (type: string) => {
    // All icons in grayscale
    return "text-gray-600 bg-gray-50"
  }

  return (
    <PageWrapper isLoading={isLoading}>
      <PageHeader
        title="WhatsApp Business API Configuration"
        description="Connect your WhatsApp Business Account to start messaging customers"
        isLoading={isLoading}
      />

      {!isLoading && (
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex gap-6"
        >
          {/* Main Content - 2/3 width */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Wizard Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        {renderStepIcon(step, index)}
                        {index < steps.length - 1 && (
                          <div
                            className={cn(
                              "w-0.5 h-16 mt-2",
                              step.status === "completed"
                                ? "bg-green-600"
                                : "bg-gray-200"
                            )}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={cn(
                              "font-semibold",
                              step.status === "current"
                                ? "text-foreground"
                                : step.status === "completed"
                                ? "text-green-600"
                                : "text-muted-foreground"
                            )}
                          >
                            {step.title}
                          </h4>
                          {step.status === "current" && (
                            <Badge className="text-xs">Current Step</Badge>
                          )}
                          {step.status === "completed" && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step Content */}
            {/* Step 0: Meta Business Account */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <CardTitle>Meta Business Account Setup</CardTitle>
                  </div>
                  <CardDescription>
                    You need a Meta Business Account to use WhatsApp Business API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          Before you begin
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                          <li>You must have a Facebook Business Manager account</li>
                          <li>Your business must be verified by Meta</li>
                          <li>You need admin access to the Business Manager</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Steps to create Meta Business Account:</h4>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">1.</span>
                          <span>
                            Go to{" "}
                            <a
                              href="https://business.facebook.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              Facebook Business Manager
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">2.</span>
                          <span>Click "Create Account" and follow the setup wizard</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">3.</span>
                          <span>Provide your business details and verify your business</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">4.</span>
                          <span>Once created, copy your Business Account ID from Settings</span>
                        </li>
                      </ol>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="businessAccountId">
                        Meta Business Account ID
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="businessAccountId"
                          placeholder="Enter your Business Account ID"
                          value={formData.businessAccountId}
                          onChange={(e) =>
                            handleInputChange("businessAccountId", e.target.value)
                          }
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleCopy(
                              formData.businessAccountId,
                              "Business Account ID"
                            )
                          }
                          disabled={!formData.businessAccountId}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Find this in Business Settings → Business Info
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={handleNextStep}
                      disabled={!formData.businessAccountId}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 1: WhatsApp Business Account */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    <CardTitle>WhatsApp Business Account</CardTitle>
                  </div>
                  <CardDescription>
                    Create a WhatsApp Business Account within your Meta Business Account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Create WhatsApp Business Account:</h4>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">1.</span>
                          <span>
                            Go to{" "}
                            <a
                              href="https://business.facebook.com/wa/manage/home"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              WhatsApp Manager
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">2.</span>
                          <span>Click "Create a WhatsApp Business Account"</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">3.</span>
                          <span>Select your Meta Business Account</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">4.</span>
                          <span>Complete the business profile information</span>
                        </li>
                      </ol>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Business Display Name</Label>
                        <Input
                          id="displayName"
                          placeholder="Your Business Name"
                          value={formData.displayName}
                          onChange={(e) =>
                            handleInputChange("displayName", e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          This name will be visible to your customers
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="about">About (Optional)</Label>
                        <Input
                          id="about"
                          placeholder="Brief description of your business"
                          value={formData.about}
                          onChange={(e) => handleInputChange("about", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          A short description that appears in your business profile
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={!formData.displayName}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Phone Number */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <CardTitle>Phone Number Configuration</CardTitle>
                  </div>
                  <CardDescription>
                    Add and verify a phone number for your WhatsApp Business Account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          Phone Number Requirements
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                          <li>Must be able to receive SMS or voice calls</li>
                          <li>Cannot be already registered with WhatsApp</li>
                          <li>Must be a valid phone number (not VoIP)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Add Phone Number:</h4>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">1.</span>
                          <span>In WhatsApp Manager, go to "Phone Numbers"</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">2.</span>
                          <span>Click "Add Phone Number"</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">3.</span>
                          <span>Enter your phone number and verify via SMS or call</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">4.</span>
                          <span>Copy the Phone Number ID after verification</span>
                        </li>
                      </ol>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+1234567890"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            handleInputChange("phoneNumber", e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Include country code (e.g., +1 for US)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                        <div className="flex gap-2">
                          <Input
                            id="phoneNumberId"
                            placeholder="Enter Phone Number ID from WhatsApp Manager"
                            value={formData.phoneNumberId}
                            onChange={(e) =>
                              handleInputChange("phoneNumberId", e.target.value)
                            }
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleCopy(formData.phoneNumberId, "Phone Number ID")
                            }
                            disabled={!formData.phoneNumberId}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Find this in WhatsApp Manager → Phone Numbers
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={!formData.phoneNumber || !formData.phoneNumberId}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: API Credentials */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-gray-600" />
                    <CardTitle>API Access Credentials</CardTitle>
                  </div>
                  <CardDescription>
                    Generate and configure your API access token
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          Security Notice
                        </p>
                        <p className="text-sm text-gray-700">
                          Keep your access token secure. Never share it publicly or commit it to version control.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Generate Access Token:</h4>
                      <ol className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">1.</span>
                          <span>
                            Go to{" "}
                            <a
                              href="https://developers.facebook.com/apps"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              Meta for Developers
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">2.</span>
                          <span>Create a new app or select existing app</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">3.</span>
                          <span>Add WhatsApp product to your app</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-medium text-foreground">4.</span>
                          <span>Generate a permanent access token with whatsapp_business_messaging permission</span>
                        </li>
                      </ol>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="accessToken">Access Token</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="accessToken"
                            type={showAccessToken ? "text" : "password"}
                            placeholder="Enter your permanent access token"
                            value={formData.accessToken}
                            onChange={(e) =>
                              handleInputChange("accessToken", e.target.value)
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={() => setShowAccessToken(!showAccessToken)}
                          >
                            {showAccessToken ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleCopy(formData.accessToken, "Access Token")
                          }
                          disabled={!formData.accessToken}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This token is used to authenticate API requests
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousStep}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={!formData.accessToken}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Webhook Setup */}
            {currentStep === 4 && (
              <>
                <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Webhook className="w-5 h-5 text-gray-600" />
                    <CardTitle>Webhook Configuration</CardTitle>
                  </div>
                    <CardDescription>
                      Set up webhooks to receive incoming messages and status updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          Webhook Requirements
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                          <li>Must be publicly accessible HTTPS URL</li>
                          <li>Must respond to verification requests</li>
                          <li>Should handle POST requests for incoming messages</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Configure Webhook:</h4>
                        <ol className="space-y-3 text-sm text-muted-foreground">
                          <li className="flex gap-3">
                            <span className="font-medium text-foreground">1.</span>
                            <span>In your Meta App, go to WhatsApp → Configuration</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-medium text-foreground">2.</span>
                            <span>Click "Edit" in the Webhook section</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-medium text-foreground">3.</span>
                            <span>Enter your webhook URL and verify token</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="font-medium text-foreground">4.</span>
                            <span>Subscribe to messages, message_status, and other relevant fields</span>
                          </li>
                        </ol>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="webhookUrl">Webhook URL</Label>
                          <div className="flex gap-2">
                            <Input
                              id="webhookUrl"
                              placeholder="https://your-domain.com/webhooks/whatsapp"
                              value={formData.webhookUrl}
                              onChange={(e) =>
                                handleInputChange("webhookUrl", e.target.value)
                              }
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleCopy(formData.webhookUrl, "Webhook URL")
                              }
                              disabled={!formData.webhookUrl}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Your server endpoint to receive webhook events
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="webhookVerifyToken">Verify Token</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                id="webhookVerifyToken"
                                type={showWebhookToken ? "text" : "password"}
                                placeholder="Enter a secure verify token"
                                value={formData.webhookVerifyToken}
                                onChange={(e) =>
                                  handleInputChange("webhookVerifyToken", e.target.value)
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => setShowWebhookToken(!showWebhookToken)}
                              >
                                {showWebhookToken ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleCopy(
                                  formData.webhookVerifyToken,
                                  "Verify Token"
                                )
                              }
                              disabled={!formData.webhookVerifyToken}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            A secret token to verify webhook requests
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePreviousStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleTestConnection}
                        disabled={!formData.webhookUrl || !formData.webhookVerifyToken}
                      >
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration Summary</CardTitle>
                    <CardDescription>
                      Review your WhatsApp Business API configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <span className="text-muted-foreground">Business Account ID:</span>
                        <span className="col-span-2 font-mono text-xs break-all">
                          {formData.businessAccountId || "Not set"}
                        </span>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <span className="text-muted-foreground">Display Name:</span>
                        <span className="col-span-2">{formData.displayName || "Not set"}</span>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <span className="text-muted-foreground">Phone Number:</span>
                        <span className="col-span-2">{formData.phoneNumber || "Not set"}</span>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <span className="text-muted-foreground">Phone Number ID:</span>
                        <span className="col-span-2 font-mono text-xs break-all">
                          {formData.phoneNumberId || "Not set"}
                        </span>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <span className="text-muted-foreground">Webhook URL:</span>
                        <span className="col-span-2 font-mono text-xs break-all">
                          {formData.webhookUrl || "Not set"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full" size="lg" onClick={handleSaveConfiguration}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Save Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Panel - Fixed 1/3 width for Resources */}
          <div className="w-1/3 min-w-[320px] max-w-[400px]">
            <div className="sticky top-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Resources</CardTitle>
                  <CardDescription>
                    Helpful guides and documentation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        getResourceIconColor(resource.type)
                      )}>
                        {resource.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">
                            {resource.title}
                          </p>
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {resource.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Sandbox Trial Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sandbox Trial</CardTitle>
                  <CardDescription>
                      Try out WhatsApp Business API features in Meta's sandbox environment before going live.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
              
                  <div className="space-y-3">
                    <ul className="text-sm text-black space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span>Test messaging without affecting production</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span>Pre-configured test phone numbers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span>No verification required to start</span>
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Start Sandbox Trial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </PageWrapper>
  )
}
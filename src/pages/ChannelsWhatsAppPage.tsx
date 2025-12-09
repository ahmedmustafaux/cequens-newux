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
          {/* Left Panel - 2/3 width - New Sections */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Section 1: Meta Business OAuth */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img 
                    src="/logos/meta.svg" 
                    alt="Meta" 
                    className="w-5 h-5"
                  />
                  <CardTitle>Meta Business Account</CardTitle>
                </div>
                <CardDescription>
                  Connect your Meta Business Account to access WhatsApp Business API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Not authenticated state */}
                {!formData.businessAccountId && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">
                            Authentication Required
                          </p>
                          <p className="text-sm text-gray-700">
                            Connect your Meta Business Account to enable WhatsApp Business API integration. You'll be redirected to Meta's secure authentication page.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <img 
                          src="/logos/meta.svg" 
                          alt="Meta" 
                          className="w-8 h-8"
                        />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold text-lg">Connect to Meta</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Authorize Cequens to access your Meta Business Account and manage WhatsApp Business API
                        </p>
                      </div>
                      <Button 
                        size="lg" 
                        className="mt-4"
                        onClick={() => {
                          // Simulate OAuth - in real app this would redirect to Meta
                          setFormData(prev => ({ 
                            ...prev, 
                            businessAccountId: "123456789012345",
                            displayName: "My Business"
                          }))
                          toast.success("Connected to Meta Business Account")
                        }}
                      >
                        <img 
                          src="/logos/meta.svg" 
                          alt="Meta" 
                          className="w-4 h-4 mr-2"
                        />
                        Authenticate with Meta
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Secure OAuth 2.0 authentication via Meta
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <p className="text-sm font-medium">What you'll need:</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <span>A verified Meta Business Account</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <span>Admin access to the Business Manager</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <span>WhatsApp Business Account created in Meta</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Authenticated state */}
                {formData.businessAccountId && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2 flex-1">
                          <p className="text-sm font-medium text-green-900">
                            Successfully Connected
                          </p>
                          <p className="text-sm text-green-700">
                            Your Meta Business Account is now connected and authorized
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Account Name</p>
                          <p className="text-lg font-semibold">
                            {formData.displayName || "Business Account"}
                          </p>
                        </div>
                        <Badge className="bg-green-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5" />
                          Active
                        </Badge>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Business Account ID</p>
                          <p className="font-mono text-xs break-all">
                            {formData.businessAccountId}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Connected Since</p>
                          <p className="font-medium">
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => window.open('https://business.facebook.com', '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Manage in Meta
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, businessAccountId: "", displayName: "" }))
                            toast.info("Disconnected from Meta Business Account")
                          }}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 2: Channel Health & Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <CardTitle>WhatsApp Channel Status</CardTitle>
                </div>
                <CardDescription>
                  Monitor and manage your WhatsApp Business channel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* No channel configured */}
                {!formData.phoneNumberId && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                    <Phone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      No Channel Configured
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect your Meta Business Account and complete the setup to configure your WhatsApp channel
                    </p>
                    {!formData.businessAccountId && (
                      <p className="text-xs text-muted-foreground">
                        Start by authenticating with Meta above
                      </p>
                    )}
                    {formData.businessAccountId && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          setFormData(prev => ({ 
                            ...prev, 
                            phoneNumberId: "987654321",
                            phoneNumber: "+1234567890"
                          }))
                          toast.success("Channel configured")
                        }}
                      >
                        Configure Channel
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Channel configured */}
                {formData.phoneNumberId && (
                  <div className="space-y-4">
                    {/* Channel Overview */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-gray-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-muted-foreground">Phone Number</p>
                        </div>
                        <p className="text-lg font-semibold">
                          {formData.phoneNumber || "Not set"}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-600" />
                          <p className="text-xs text-muted-foreground">Display Name</p>
                        </div>
                        <p className="text-lg font-semibold">
                          {formData.displayName || "Not set"}
                        </p>
                      </div>
                    </div>

                    {/* Health Status */}
                    <div className="rounded-lg border border-gray-200 p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Channel Health</h4>
                        <Badge className="bg-green-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5" />
                          Healthy
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Quality Rating</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-green-600">High</span>
                              <span className="text-xs text-muted-foreground">95%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }} />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Message Limit</p>
                          <p className="text-2xl font-bold">1K</p>
                          <p className="text-xs text-muted-foreground">per day</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="text-2xl font-bold text-green-600">✓</p>
                          <p className="text-xs text-muted-foreground">Verified</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                      <h4 className="font-medium text-sm">Recent Activity</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Messages Sent (24h)</span>
                          <span className="font-semibold">247</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Messages Received (24h)</span>
                          <span className="font-semibold">189</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Delivery Rate</span>
                          <span className="font-semibold text-green-600">98.5%</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Channel Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Change Number
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setFormData(prev => ({ 
                            ...prev, 
                            phoneNumberId: "",
                            phoneNumber: ""
                          }))
                          toast.info("Channel disconnected")
                        }}
                      >
                        Disconnect Channel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 3: API Testing & Validation */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-gray-600" />
                  <CardTitle>API Testing & Validation</CardTitle>
                </div>
                <CardDescription>
                  Test your WhatsApp API configuration and send test messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(!formData.businessAccountId || !formData.phoneNumberId) && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                    <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Configuration Required
                    </p>
                    <p className="text-sm text-gray-600">
                      Complete the Meta authentication and channel setup to access testing tools
                    </p>
                  </div>
                )}

                {formData.businessAccountId && formData.phoneNumberId && (
                  <div className="space-y-4">
                    {/* Connection Test */}
                    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Connection Test</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Verify API credentials and connectivity
                          </p>
                        </div>
                        <Button size="sm" onClick={handleTestConnection}>
                          Test Connection
                        </Button>
                      </div>
                    </div>

                    {/* Send Test Message */}
                    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                      <h4 className="font-medium text-sm">Send Test Message</h4>
                      <div className="space-y-2">
                        <Label htmlFor="testPhone" className="text-xs">
                          Recipient Phone Number
                        </Label>
                        <Input
                          id="testPhone"
                          placeholder="+1234567890"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testMessage" className="text-xs">
                          Message
                        </Label>
                        <Input
                          id="testMessage"
                          placeholder="Hello from Cequens!"
                          className="text-sm"
                        />
                      </div>
                      <Button size="sm" className="w-full" onClick={() => toast.success("Test message sent!")}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Test Message
                      </Button>
                    </div>

                    {/* Webhook Validation */}
                    <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Webhook Status</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formData.webhookUrl || "Not configured"}
                          </p>
                        </div>
                        {formData.webhookUrl && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      {formData.webhookUrl && (
                        <Button size="sm" variant="outline" className="w-full">
                          Test Webhook
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* Quick Links */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-900">Developer Resources</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs justify-start"
                          onClick={() => window.open('https://developers.facebook.com/docs/whatsapp', '_blank')}
                        >
                          <BookOpen className="w-3 h-3 mr-1.5" />
                          API Docs
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs justify-start"
                          onClick={() => window.open('https://developers.facebook.com/docs/whatsapp/api/webhooks', '_blank')}
                        >
                          <Webhook className="w-3 h-3 mr-1.5" />
                          Webhooks
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs justify-start"
                          onClick={() => toast.info("Opening API console...")}
                        >
                          <Key className="w-3 h-3 mr-1.5" />
                          API Keys
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs justify-start"
                          onClick={() => toast.info("Opening support...")}
                        >
                          <HelpCircle className="w-3 h-3 mr-1.5" />
                          Support
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - 1/3 width - Wizard Steps */}
          <div className="w-1/3 min-w-[320px] max-w-[400px]">
            <div className="sticky top-6 space-y-6">
              {/* Wizard Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Setup Wizard</CardTitle>
                  <CardDescription>
                    Follow these steps to complete your configuration
                  </CardDescription>
                </CardHeader>
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
                                "font-semibold text-sm",
                                step.status === "current"
                                  ? "text-foreground"
                                  : step.status === "completed"
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              )}
                            >
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {step.description}
                          </p>
                          {step.status === "current" && (
                            <Badge className="text-xs mt-2">In Progress</Badge>
                          )}
                          {step.status === "completed" && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600 mt-2">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
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
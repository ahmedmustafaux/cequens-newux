import * as React from "react"
import { useNavigate } from "react-router-dom"
import { usePageTitle } from "@/hooks/use-dynamic-title"
import { Button } from "@/components/ui/button"
import { 
  Field, 
  FieldLabel, 
  FieldContent, 
  FieldDescription 
} from "@/components/ui/field"
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon,
  InputGroupButton
} from "@/components/ui/input-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PageHeaderWithActions } from "@/components/page-header"
import { CardSkeleton } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Tag, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { pageVariants, smoothTransition } from "@/lib/transitions"

interface ContactFormData {
  // Basic Information
  firstName: string
  lastName: string
  email: string
  phone: string
  profileType: "Lead" | "Customer"
  
  // Contact Information
  country: string
  region: string
  address: string
  
  // Company Information (optional)
  company: string
  jobTitle: string
  
  // Additional Information
  tags: string[]
  notes: string
}

export default function ContactsCreatePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [newTag, setNewTag] = React.useState("")
  const [isDirty, setIsDirty] = React.useState(false)
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)
  
  usePageTitle("Create Contact")

  // Simulate initial page loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 400) // Standard 400ms loading time

    return () => clearTimeout(timer)
  }, [])

  const [formData, setFormData] = React.useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileType: "Lead",
    country: "",
    region: "",
    address: "",
    company: "",
    jobTitle: "",
    tags: [],
    notes: ""
  })

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setIsDirty(true)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
      setIsDirty(true)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
    setIsDirty(true)
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // TODO: Implement actual API call to create contact
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Contact created successfully!")
      navigate("/contacts")
    } catch (error) {
      toast.error("Failed to create contact. Please try again.")
      // Handle error appropriately
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDiscard = () => {
    if (isDirty) {
      // TODO: Show confirmation dialog
      const confirmed = window.confirm("Are you sure you want to discard your changes?")
      if (confirmed) {
        navigate("/contacts")
      }
    } else {
      navigate("/contacts")
    }
  }

  const canSave = formData.firstName.trim() !== "" && formData.lastName.trim() !== ""

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
        >
          <PageHeaderWithActions
            title="Create Contact"
            description="Add a new lead or customer to your contacts"
            isLoading={isInitialLoading}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDiscard}
                  disabled={isSubmitting || isInitialLoading}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!canSave || !isDirty || isInitialLoading}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create Contact"}
                </Button>
              </div>
            }
          />
        </motion.div>

        {/* Content */}
        <div className="flex flex-col gap-4 pb-4">
          {isInitialLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
              <div className="space-y-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          ) : (
            <motion.div 
              className="flex flex-col gap-4"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              transition={smoothTransition}
            >
          <div className="px-4 md:px-6">
            <form className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Essential contact details and profile type
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              id="firstName"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              placeholder="Enter first name"
                              required
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              id="lastName"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              placeholder="Enter last name"
                              required
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="profileType">Profile Type *</FieldLabel>
                      <FieldContent>
                        <Select
                          value={formData.profileType}
                          onValueChange={(value: "Lead" | "Customer") => handleInputChange("profileType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lead">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                Lead
                              </div>
                            </SelectItem>
                            <SelectItem value="Customer">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Customer
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                    </Field>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                    <CardDescription>
                      At least one contact method is required
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <Mail className="h-4 w-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              placeholder="Enter email address"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <Phone className="h-4 w-4" />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="country">Country</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              id="country"
                              value={formData.country}
                              onChange={(e) => handleInputChange("country", e.target.value)}
                              placeholder="Enter country"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="region">Region</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              id="region"
                              value={formData.region}
                              onChange={(e) => handleInputChange("region", e.target.value)}
                              placeholder="Enter region/state"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="address">Address</FieldLabel>
                      <FieldContent>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                          <textarea
                            id="address"
                            value={formData.address}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("address", e.target.value)}
                            placeholder="Enter full address"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                          />
                        </div>
                      </FieldContent>
                    </Field>
                  </CardContent>
                </Card>

                {/* Company Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Company Information
                    </CardTitle>
                    <CardDescription>
                      Optional company details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="company">Company</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              id="company"
                              value={formData.company}
                              onChange={(e) => handleInputChange("company", e.target.value)}
                              placeholder="Enter company name"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupInput
                              id="jobTitle"
                              value={formData.jobTitle}
                              onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                              placeholder="Enter job title"
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Tags
                    </CardTitle>
                    <CardDescription>
                      Add tags to categorize this contact
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <InputGroup>
                      <InputGroupInput
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e: React.KeyboardEvent) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={addTag}
                          disabled={!newTag.trim()}
                          variant="outline"
                          size="xs"
                        >
                          <Plus className="h-4 w-4" />
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:bg-gray-200 rounded-full p-0.5 h-auto w-auto"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>
                      Additional information about this contact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={formData.notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("notes", e.target.value)}
                      placeholder="Add any additional notes..."
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
            </form>
          </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

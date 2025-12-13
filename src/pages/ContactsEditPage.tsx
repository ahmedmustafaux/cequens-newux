import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { usePageTitle } from "@/hooks/use-dynamic-title"
import { PageWrapper } from "@/components/page-wrapper"
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
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeaderWithActions } from "@/components/page-header"
import { CardSkeleton } from "@/components/ui/card"
import { User, Mail, Phone, Tag, Plus, X, Search, ChevronDown, Save, Globe, Bot, Users } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { pageVariants, smoothTransition } from "@/lib/transitions"
import { Input } from "@/components/ui/input"
import { CircleFlag } from "react-circle-flags"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { mockContacts } from "@/data/mock-data"
import { validatePhoneNumber } from "@/lib/validation"

interface ContactFormData {
  name: string
  firstName: string
  lastName: string
  phone: string
  email: string
  language: string
  botStatus: string
  countryISO: string
  assignee: string
  conversationStatus: string
  tags: string[]
  notes: string
}

export default function ContactsEditPage() {
  const navigate = useNavigate()
  const params = useParams()
  const contactId = params.id as string
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [newTag, setNewTag] = React.useState("")
  const [isDirty, setIsDirty] = React.useState(false)
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)
  const [countryCode, setCountryCode] = React.useState("+966") // Default to Saudi Arabia
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = React.useState(false)
  const [phoneError, setPhoneError] = React.useState<string>("")
  
  // Find the contact by ID
  const contact = React.useMemo(() => {
    return mockContacts.find(c => c.id === contactId)
  }, [contactId])
  
  const displayName = contact 
    ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Contact'
    : 'Contact'
  usePageTitle(contact ? `Edit ${displayName}` : "Edit Contact")

  // List of common country codes
  const countryCodes = [
    { code: "sa", dialCode: "+966", name: "Saudi Arabia" },
    { code: "us", dialCode: "+1", name: "United States" },
    { code: "gb", dialCode: "+44", name: "United Kingdom" },
    { code: "ae", dialCode: "+971", name: "United Arab Emirates" },
    { code: "eg", dialCode: "+20", name: "Egypt" },
    { code: "in", dialCode: "+91", name: "India" },
    { code: "ca", dialCode: "+1", name: "Canada" },
    { code: "au", dialCode: "+61", name: "Australia" },
    { code: "de", dialCode: "+49", name: "Germany" },
    { code: "fr", dialCode: "+33", name: "France" },
    { code: "it", dialCode: "+39", name: "Italy" },
    { code: "es", dialCode: "+34", name: "Spain" },
    { code: "jp", dialCode: "+81", name: "Japan" },
    { code: "cn", dialCode: "+86", name: "China" },
    { code: "br", dialCode: "+55", name: "Brazil" },
    { code: "ru", dialCode: "+7", name: "Russia" },
    { code: "kr", dialCode: "+82", name: "South Korea" },
    { code: "sg", dialCode: "+65", name: "Singapore" },
    { code: "my", dialCode: "+60", name: "Malaysia" },
    { code: "th", dialCode: "+66", name: "Thailand" },
    { code: "id", dialCode: "+62", name: "Indonesia" },
    { code: "ph", dialCode: "+63", name: "Philippines" },
    { code: "vn", dialCode: "+84", name: "Vietnam" },
    { code: "tr", dialCode: "+90", name: "Turkey" },
    { code: "qa", dialCode: "+974", name: "Qatar" },
    { code: "kw", dialCode: "+965", name: "Kuwait" },
    { code: "bh", dialCode: "+973", name: "Bahrain" },
    { code: "om", dialCode: "+968", name: "Oman" },
    { code: "jo", dialCode: "+962", name: "Jordan" },
    { code: "lb", dialCode: "+961", name: "Lebanon" },
  ]

  // Filter countries based on search query
  const filteredCountries = searchQuery 
    ? countryCodes.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        country.dialCode.includes(searchQuery))
    : countryCodes

  const selectedCountry = countryCodes.find(c => c.dialCode === countryCode) || countryCodes[0]

  // Extract country code from phone number and set countryISO
  React.useEffect(() => {
    if (contact) {
      // Extract country code from phone if it starts with +
      const phone = contact.phone
      if (phone.startsWith('+')) {
        for (let i = 4; i >= 2; i--) {
          const code = phone.substring(0, i)
          const matchedCountry = countryCodes.find(c => c.dialCode === code)
          if (matchedCountry) {
            setCountryCode(matchedCountry.dialCode)
            break
          }
        }
      } else {
        // Try to detect from countryISO
        const country = countryCodes.find(c => c.code === contact.countryISO?.toLowerCase())
        if (country) {
          setCountryCode(country.dialCode)
        }
      }
    }
  }, [contact])

  // Simulate initial page loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 400) // Standard 400ms loading time

    return () => clearTimeout(timer)
  }, [])

  // Initialize form data from contact
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    language: "",
    botStatus: "",
    countryISO: "",
    assignee: "",
    conversationStatus: "unassigned",
    tags: [],
    notes: ""
  })

  // Populate form when contact is loaded
  React.useEffect(() => {
    if (contact) {
      // Extract phone number without country code
      let phoneNumber = contact.phone
      if (phoneNumber.startsWith('+')) {
        // Remove country code
        for (let i = 4; i >= 2; i--) {
          const code = phoneNumber.substring(0, i)
          const matchedCountry = countryCodes.find(c => c.dialCode === code)
          if (matchedCountry) {
            phoneNumber = phoneNumber.substring(i)
            break
          }
        }
      }
      
      // Update country code based on countryISO
      const country = countryCodes.find(c => c.code === contact.countryISO?.toLowerCase())
      if (country) {
        setCountryCode(country.dialCode)
      }
      
      setFormData({
        name: contact.name || "",
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        phone: phoneNumber,
        email: contact.emailAddress || "",
        language: contact.language || "",
        botStatus: contact.botStatus || "",
        countryISO: contact.countryISO || "",
        assignee: contact.assignee || "",
        conversationStatus: contact.conversationStatus || "unassigned",
        tags: contact.tags || [],
        notes: "" // Notes not stored in contact model
      })
    }
  }, [contact])

  // Redirect if contact not found
  React.useEffect(() => {
    if (!isInitialLoading && !contact) {
      toast.error("Contact not found")
      navigate("/contacts")
    }
  }, [contact, isInitialLoading, navigate])

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setIsDirty(true)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '')
    handleInputChange("phone", value)
    setPhoneError("")
    
    // Auto-detect country based on phone number input
    // Detect Egyptian numbers (starting with 010, 011, 012, 015)
    if (value.match(/^0(10|11|12|15)/) && value.length >= 4) {
      setCountryCode('+20') // Egypt
    }
    // Detect Saudi numbers (starting with 05)
    else if (value.match(/^05/) && value.length >= 3 && countryCode !== '+20') {
      setCountryCode('+966') // Saudi Arabia
    }
    // Detect UAE numbers (starting with 05)
    else if (value.match(/^05/) && value.length >= 3 && countryCode !== '+966' && countryCode !== '+20') {
      setCountryCode('+971') // UAE
    }
    // Detect UK numbers (starting with 07)
    else if (value.match(/^07/) && value.length >= 3) {
      setCountryCode('+44') // UK
    }
    // Detect US/Canada numbers (starting with 1 and area code)
    else if (value.match(/^1[2-9]/) && value.length >= 2) {
      setCountryCode('+1') // US/Canada
    }
  }

  const handlePhoneBlur = () => {
    const fullPhone = countryCode + formData.phone
    const validation = validatePhoneNumber(fullPhone)
    if (!validation.isValid) {
      setPhoneError(validation.message || "Please enter a valid phone number")
    } else {
      setPhoneError("")
    }
  }

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value)
    setIsCountryPopoverOpen(false)
    const selectedCountry = countryCodes.find(c => c.dialCode === value)
    if (selectedCountry) {
      handleInputChange("countryISO", selectedCountry.code.toUpperCase())
    }
    setIsDirty(true)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
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
    // Validate phone number before saving
    const fullPhone = countryCode + formData.phone
    const phoneValidation = validatePhoneNumber(fullPhone)
    
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.message || "Please enter a valid phone number")
      toast.error(phoneValidation.message || "Please enter a valid phone number")
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Implement actual API call to update contact
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Contact updated successfully!")
      navigate(`/contacts/${contactId}`)
    } catch (error) {
      toast.error("Failed to update contact. Please try again.")
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
        navigate(`/contacts/${contactId}`)
      }
    } else {
      navigate(`/contacts/${contactId}`)
    }
  }

  const fullPhone = countryCode + formData.phone
  const phoneValidation = validatePhoneNumber(fullPhone)
  const canSave = phoneValidation.isValid && formData.phone.trim() !== ""

  if (!contact && !isInitialLoading) {
    return null // Will redirect in useEffect
  }

  return (
    <PageWrapper isLoading={isInitialLoading}>
      <PageHeaderWithActions
        title={contact ? `Edit ${displayName}` : "Edit Contact"}
        description="Update contact information"
        isLoading={isInitialLoading}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={isSubmitting || isInitialLoading}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!canSave || isInitialLoading}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Updating..." : "Update Contact"}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-4">
        {isInitialLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 grid gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="grid gap-4 auto-rows-min">
              <CardSkeleton />
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
                {/* Basic Information */}
                <Card className="py-5 gap-5">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">First Name</label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="Enter first name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Last Name</label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Enter last name"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Email Address</label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter email address"
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Phone *</label>
                        <div className="flex">
                          <Popover open={isCountryPopoverOpen} onOpenChange={setIsCountryPopoverOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-between font-normal h-9 px-3",
                                  "w-[130px] rounded-r-none border-r-0",
                                  "bg-transparent hover:bg-muted/50"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <CircleFlag 
                                    countryCode={selectedCountry.code} 
                                    height="16" 
                                    width="16" 
                                  />
                                  <span className="text-sm">{selectedCountry.dialCode}</span>
                                </div>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent 
                              className="w-[300px] p-0" 
                              align="start"
                              onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                              <div className="flex flex-col">
                                <div className="flex flex-col">
                                  <div>
                                    <Field>
                                      <FieldContent>
                                        <InputGroup className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none">
                                          <InputGroupAddon>
                                            <Search className="h-3 w-3" />
                                          </InputGroupAddon>
                                          <InputGroupInput
                                            placeholder="Search countries..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className="h-6 text-sm"
                                            autoFocus={false}
                                          />
                                        </InputGroup>
                                      </FieldContent>
                                    </Field>
                                  </div>
                                  <div className="border-t border-border" />
                                </div>
                                
                                <div className="relative">
                                  <div className="max-h-72 overflow-y-auto p-1">
                                    {filteredCountries.length > 0 ? (
                                      filteredCountries.map((country) => (
                                        <div 
                                          key={country.code} 
                                          className={cn(
                                            "flex items-center gap-2 p-2 hover:bg-accent rounded-sm cursor-pointer",
                                            country.dialCode === countryCode && "bg-accent"
                                          )}
                                          onClick={() => handleCountryCodeChange(country.dialCode)}
                                        >
                                          <CircleFlag countryCode={country.code} height="16" width="16" />
                                          <span className="text-sm">{country.name}</span>
                                          <span className="text-sm text-muted-foreground ml-auto">{country.dialCode}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="px-2 py-1 text-sm text-muted-foreground text-center">
                                        No results found
                                      </div>
                                    )}
                                  </div>
                                  
                                  {filteredCountries.length > 6 && (
                                    <div className="absolute bottom-0 inset-x-0 flex justify-center bg-gradient-to-t from-white via-white/80 to-transparent py-1 pointer-events-none">
                                      <ChevronDown className="h-4 w-4 text-muted-foreground animate-bounce" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handlePhoneNumberChange}
                            onBlur={handlePhoneBlur}
                            className={cn(
                              "flex-1 rounded-l-none h-9",
                              phoneError && "border-destructive focus-visible:ring-destructive"
                            )}
                            required
                          />
                        </div>
                        {phoneError && (
                          <p className="text-sm text-destructive mt-1">{phoneError}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Language</label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => handleInputChange("language", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">Arabic</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="it">Italian</SelectItem>
                            <SelectItem value="pt">Portuguese</SelectItem>
                            <SelectItem value="ru">Russian</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                            <SelectItem value="ko">Korean</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Bot Status</label>
                        <Select
                          value={formData.botStatus}
                          onValueChange={(value) => handleInputChange("botStatus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bot status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Last Conversation</label>
                        <Select
                          value={formData.conversationStatus}
                          onValueChange={(value) => handleInputChange("conversationStatus", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select conversation status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Fields */}
                <Card className="py-5 gap-5">
                  <CardHeader>
                    <CardTitle>System Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Contact ID</label>
                        <p className="text-sm font-mono">{contact?.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Country</label>
                        <div className="flex items-center gap-2">
                          {formData.countryISO && (
                            <div className="w-4 h-4 flex-shrink-0 overflow-hidden rounded-full">
                              <CircleFlag countryCode={formData.countryISO.toLowerCase()} className="w-full h-full" />
                            </div>
                          )}
                          <Select
                            value={formData.countryISO || ""}
                            onValueChange={(value) => {
                              handleInputChange("countryISO", value)
                              const country = countryCodes.find(c => c.code === value.toLowerCase())
                              if (country) {
                                setCountryCode(country.dialCode)
                              }
                            }}
                          >
                            <SelectTrigger className="w-auto">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code.toUpperCase()}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Assignee</label>
                        <Input
                          id="assignee"
                          value={formData.assignee}
                          onChange={(e) => handleInputChange("assignee", e.target.value)}
                          placeholder="Enter assignee name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Last Message</label>
                        <p className="text-sm">{contact?.lastMessage || '—'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Created At</label>
                        <p className="text-sm">{contact?.createdAt ? new Date(contact.createdAt).toLocaleString() : '—'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Last Interaction Time</label>
                        <p className="text-sm">{contact?.lastInteractionTime ? new Date(contact.lastInteractionTime).toLocaleString() : '—'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Conversation Opened Time</label>
                        <p className="text-sm">{contact?.conversationOpenedTime ? new Date(contact.conversationOpenedTime).toLocaleString() : '—'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="grid grid-cols-1 gap-4 items-start">
                {/* Tags */}
                <Card className="py-5 gap-5">
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                    <CardDescription>Add tags to categorize this contact</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTag}
                        disabled={!newTag.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card className="py-5 gap-5">
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("notes", e.target.value)}
                      placeholder="Add any additional notes about this contact..."
                      className="min-h-[100px]"
                    />
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

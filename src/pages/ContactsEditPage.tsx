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
import { PageHeaderWithActions } from "@/components/page-header"
import { CardSkeleton } from "@/components/ui/card"
import { User, Mail, Phone, Tag, Plus, X, Search, ChevronDown, Save } from "lucide-react"
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

interface ContactFormData {
  // Essential fields only
  name: string
  phone: string
  email: string
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
  
  // Find the contact by ID
  const contact = React.useMemo(() => {
    return mockContacts.find(c => c.id === contactId)
  }, [contactId])
  
  usePageTitle(contact ? `Edit ${contact.name}` : "Edit Contact")

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

  // Extract country code from phone number
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
        const country = countryCodes.find(c => c.code === contact.countryISO.toLowerCase())
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
    phone: "",
    email: "",
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
      
      setFormData({
        name: contact.name || "",
        phone: phoneNumber,
        email: contact.emailAddress || "",
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
    const value = e.target.value
    handleInputChange("phone", value)
    
    // Auto-detect country based on phone number input
    // If user is typing a full international number with +
    if (value.startsWith('+')) {
      // Extract the country code from the beginning
      for (let i = 4; i >= 2; i--) {
        const code = value.substring(0, i)
        const matchedCountry = countryCodes.find(c => c.dialCode === code)
        if (matchedCountry) {
          setCountryCode(matchedCountry.dialCode)
          // Remove the country code from the phone number
          const phoneWithoutCode = value.substring(i)
          setFormData(prev => ({
            ...prev,
            phone: phoneWithoutCode
          }))
          break
        }
      }
    } 
    // Detect Egyptian numbers (starting with 010, 011, 012, 015)
    else if (value.match(/^0(10|11|12|15)/) && value.length >= 4) {
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

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value)
    setIsCountryPopoverOpen(false)
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

  const canSave = formData.phone.trim() !== ""

  if (!contact && !isInitialLoading) {
    return null // Will redirect in useEffect
  }

  return (
    <PageWrapper isLoading={isInitialLoading}>
      <PageHeaderWithActions
        title={contact ? `Edit ${contact.name}` : "Edit Contact"}
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
            className="max-w-2xl mx-auto"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={smoothTransition}
          >
            {/* Main Form */}
            <div className="grid gap-4">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Update contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <FieldDescription>Optional - will use phone number if not provided</FieldDescription>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupAddon>
                          <User className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter contact name"
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
                    <FieldDescription>Required - include country code</FieldDescription>
                    <FieldContent>
                      <div className="flex">
                        <Popover open={isCountryPopoverOpen} onOpenChange={setIsCountryPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-between font-normal h-9 px-3",
                                "w-[130px] rounded-r-none border-r-0",
                                "bg-transparent hover:bg-muted/50",
                                "text-black hover:text-black"
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
                          autoComplete="tel"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          className="flex-1 rounded-l-none h-9"
                          required
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <FieldDescription>Optional</FieldDescription>
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
                </CardContent>
              </Card>

              {/* Tags & Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags & Notes
                  </CardTitle>
                  <CardDescription>
                    Optional - organize and add context to this contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Field>
                    <FieldLabel>Tags</FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag and press Enter"
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
                        <div className="flex flex-wrap gap-2 mt-2">
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
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Notes</FieldLabel>
                    <FieldContent>
                      <Textarea
                        value={formData.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("notes", e.target.value)}
                        placeholder="Add any additional notes about this contact..."
                        className="min-h-[100px]"
                      />
                    </FieldContent>
                  </Field>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  )
}

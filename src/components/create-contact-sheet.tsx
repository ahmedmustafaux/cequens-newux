import * as React from "react"
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
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { User, Mail, Phone, Tag, Plus, X, Search, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { CircleFlag } from "react-circle-flags"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ContactFormData {
  name: string
  phone: string
  email: string
  tags: string[]
  notes: string
}

interface CreateContactSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateContactSheet({ open, onOpenChange }: CreateContactSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [newTag, setNewTag] = React.useState("")
  const [countryCode, setCountryCode] = React.useState("+966")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = React.useState(false)
  
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    tags: [],
    notes: ""
  })

  // Reset form when sheet closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        tags: [],
        notes: ""
      })
      setNewTag("")
    }
  }, [open])

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

  const filteredCountries = searchQuery 
    ? countryCodes.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        country.dialCode.includes(searchQuery))
    : countryCodes

  const selectedCountry = countryCodes.find(c => c.dialCode === countryCode) || countryCodes[0]

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    handleInputChange("phone", value)
    
    if (value.startsWith('+')) {
      for (let i = 4; i >= 2; i--) {
        const code = value.substring(0, i)
        const matchedCountry = countryCodes.find(c => c.dialCode === code)
        if (matchedCountry) {
          setCountryCode(matchedCountry.dialCode)
          const phoneWithoutCode = value.substring(i)
          setFormData(prev => ({
            ...prev,
            phone: phoneWithoutCode
          }))
          break
        }
      }
    } else if (value.match(/^0(10|11|12|15)/) && value.length >= 4) {
      setCountryCode('+20')
    } else if (value.match(/^05/) && value.length >= 3 && countryCode !== '+20') {
      setCountryCode('+966')
    } else if (value.match(/^07/) && value.length >= 3) {
      setCountryCode('+44')
    } else if (value.match(/^1[2-9]/) && value.length >= 2) {
      setCountryCode('+1')
    }
  }

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value)
    setIsCountryPopoverOpen(false)
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
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async () => {
    if (!formData.phone.trim()) {
      toast.error("Phone number is required")
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Contact created successfully!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to create contact. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSave = formData.phone.trim() !== ""

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg bg-popover flex flex-col p-0 gap-0 [&>button.absolute]:hidden">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle>Create Contact</SheetTitle>
          <SheetDescription>
            Add a new contact to your list. Phone number is required.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-4">
            <div className="mt-4 space-y-6 pb-4">
              {/* Main Fields */}
              <div className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
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
                    <FieldDescription>Optional - will use phone number if not provided</FieldDescription>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
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
                    <FieldDescription>Required - include country code</FieldDescription>
                  </FieldContent>
                </Field>
              </div>

              {/* Additional Details - Always Visible */}
              <div className="border-t pt-4 space-y-4">
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
              </div>
            </div>
          </div>

          {/* Footer - Sticky like segments */}
          <SheetFooter className="sticky bottom-0 border-t bg-popover px-4 py-3 mt-auto z-10 shrink-0">
            <div className="flex gap-3 w-full justify-between">
              <div className="flex gap-2">
                {/* Left side actions can be added here if needed */}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!canSave || isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Contact"}
                </Button>
              </div>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}

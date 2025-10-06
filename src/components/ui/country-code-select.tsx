"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon 
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface CountryCode {
  code: string
  dialCode: string
  flag: string
  name: string
}

// List of common country codes
export const countryCodes: CountryCode[] = [
  { code: "US", dialCode: "+1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dialCode: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "SA", dialCode: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "AE", dialCode: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
  { code: "EG", dialCode: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "IN", dialCode: "+91", flag: "🇮🇳", name: "India" },
  { code: "CA", dialCode: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "AU", dialCode: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "DE", dialCode: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "FR", dialCode: "+33", flag: "🇫🇷", name: "France" },
  { code: "IT", dialCode: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "ES", dialCode: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "JP", dialCode: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "CN", dialCode: "+86", flag: "🇨🇳", name: "China" },
  { code: "BR", dialCode: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "RU", dialCode: "+7", flag: "🇷🇺", name: "Russia" },
  { code: "KR", dialCode: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "SG", dialCode: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "MY", dialCode: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "TH", dialCode: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "ID", dialCode: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "PH", dialCode: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "VN", dialCode: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "TR", dialCode: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "QA", dialCode: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "KW", dialCode: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "BH", dialCode: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "OM", dialCode: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "JO", dialCode: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "LB", dialCode: "+961", flag: "🇱🇧", name: "Lebanon" },
]

interface CountryCodeSelectProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  className?: string
}

export function CountryCodeSelect({
  value,
  onChange,
  onBlur,
  className,
}: CountryCodeSelectProps) {
  // Find the selected country based on the dial code
  const selectedCountry = React.useMemo(() => {
    return countryCodes.find(country => country.dialCode === value) || 
      // Default to Saudi Arabia if not found
      countryCodes.find(country => country.code === "SA") || 
      countryCodes[0]
  }, [value])

  const handleSelect = (dialCode: string) => {
    onChange(dialCode)
    if (onBlur) onBlur()
  }

  return (
    <Select
      value={value}
      onValueChange={handleSelect}
      onOpenChange={() => {
        if (onBlur) onBlur()
      }}
    >
      <SelectTrigger 
        className={cn(
          "flex items-center gap-1 h-full px-2 rounded-l-md rounded-r-none border-r-0 hover:bg-accent w-auto",
          className
        )}
      >
        <SelectValue>
          <div className="flex items-center gap-1">
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {countryCodes.map((country) => (
          <SelectItem key={country.code} value={country.dialCode}>
            <div className="flex items-center gap-2">
              <span className="text-base">{country.flag}</span>
              <span className="text-sm">{country.name}</span>
              <span className="text-sm text-muted-foreground ml-auto">{country.dialCode}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface PhoneInputWithCountryCodeProps {
  value: string
  countryCode: string
  onValueChange: (value: string) => void
  onCountryCodeChange: (code: string) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

export function PhoneInputWithCountryCode({
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  onBlur,
  placeholder = "Enter phone number",
  className,
  id,
  required,
  disabled,
}: PhoneInputWithCountryCodeProps) {
  return (
    <InputGroup className={cn("flex", className)}>
      <CountryCodeSelect 
        value={countryCode} 
        onChange={onCountryCodeChange}
        onBlur={onBlur}
      />
      <InputGroupInput
        id={id}
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onBlur={onBlur}
        autoComplete="tel"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        required={required}
        disabled={disabled}
        className="flex-1 rounded-l-none"
      />
    </InputGroup>
  )
}
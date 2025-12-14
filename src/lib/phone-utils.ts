import { parsePhoneNumberFromString, isValidPhoneNumber, CountryCode } from 'libphonenumber-js'
// @ts-ignore - whatsapp-number-verify doesn't have TypeScript types
import { verifyPhoneNumber } from 'whatsapp-number-verify'
import { phone } from 'phone'
import { findNetworkByPhoneNumber } from 'mobile-carriers'

/**
 * Detects country from phone number input using the 'phone' package
 * This package automatically detects country ISO from network operator
 * and normalizes the phone number by removing operator prefixes if needed
 */
export function detectCountryFromPhoneNumber(phoneInput: string): {
  countryCode: string | null
  countryISO: string | null
  formattedNumber: string | null
  isValid: boolean
  nationalNumber: string
  carrier?: string
} {
  if (!phoneInput || phoneInput.length < 3) {
    return {
      countryCode: null,
      countryISO: null,
      formattedNumber: null,
      isValid: false,
      nationalNumber: phoneInput || ''
    }
  }

  // Remove all non-digit characters for clean input
  const digitsOnly = phoneInput.replace(/\D/g, '')
  
  if (digitsOnly.length < 3) {
    return {
      countryCode: null,
      countryISO: null,
      formattedNumber: null,
      isValid: false,
      nationalNumber: digitsOnly
    }
  }

  try {
    // The phone package needs '+' prefix to detect country from operator numbers
    // Try with '+' prefix - this helps detect from operator prefixes like 010, 05, etc.
    let result = phone('+' + digitsOnly)
    
    if (result.isValid && result.countryIso2) {
      // Try to find the carrier/network operator
      let carrier: string | undefined
      try {
        // findNetworkByPhoneNumber requires phone number and country code
        if (result.countryCode) {
          const network = findNetworkByPhoneNumber(result.phoneNumber, result.countryCode)
          if (network) {
            carrier = network
          }
        }
      } catch {
        // Carrier detection failed, continue without it
      }

      return {
        countryCode: result.countryCode || null,
        countryISO: result.countryIso2?.toUpperCase() || null,
        formattedNumber: result.phoneNumber, // Already in E.164 format
        isValid: true,
        nationalNumber: result.phoneNumber.replace(result.countryCode || '', ''),
        carrier
      }
    }

    // If phone package didn't detect with '+', try common country codes for operator prefixes
    // This handles cases where operator prefix alone might not be enough
    if (digitsOnly.length >= 4) {
      // Common country patterns based on operator prefixes
      const operatorPatterns: Array<{ pattern: RegExp; countryCode: string; countryISO: string }> = [
        { pattern: /^010|^011|^012|^015/, countryCode: '+20', countryISO: 'EG' }, // Egypt
        { pattern: /^05/, countryCode: '+966', countryISO: 'SA' }, // Saudi Arabia
        { pattern: /^07/, countryCode: '+44', countryISO: 'GB' }, // UK
        { pattern: /^1[2-9]/, countryCode: '+1', countryISO: 'US' }, // US/Canada
      ]

      for (const { pattern, countryCode, countryISO } of operatorPatterns) {
        if (pattern.test(digitsOnly)) {
          const testResult = phone(countryCode + digitsOnly)
          if (testResult.isValid && testResult.countryIso2 === countryISO.toLowerCase()) {
            return {
              countryCode: countryCode,
              countryISO: countryISO,
              formattedNumber: testResult.phoneNumber,
              isValid: true,
              nationalNumber: testResult.phoneNumber.replace(countryCode, ''),
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error detecting country from phone number:', error)
  }

  // Fallback to libphonenumber-js if phone package fails
  try {
    // Try with '+' prefix for better detection
    const testInput = phoneInput.startsWith('+') ? phoneInput : '+' + digitsOnly
    const phoneNumber = parsePhoneNumberFromString(testInput)
    
    if (phoneNumber && phoneNumber.country) {
      return {
        countryCode: phoneNumber.countryCallingCode ? `+${phoneNumber.countryCallingCode}` : null,
        countryISO: phoneNumber.country || null,
        formattedNumber: phoneNumber.formatInternational(),
        isValid: phoneNumber.isValid(),
        nationalNumber: phoneNumber.nationalNumber
      }
    }
  } catch (error) {
    console.error('Error with libphonenumber-js fallback:', error)
  }

  return {
    countryCode: null,
    countryISO: null,
    formattedNumber: null,
    isValid: false,
    nationalNumber: digitsOnly
  }
}

/**
 * Validates a phone number using the 'phone' package
 * This automatically normalizes the number and removes operator prefixes
 */
export function validatePhoneNumber(phoneNumber: string, defaultCountry?: CountryCode): {
  isValid: boolean
  formatted?: string
  error?: string
  countryISO?: string
} {
  try {
    if (!phoneNumber.trim()) {
      return { isValid: false, error: 'Phone number is required' }
    }

    // Use 'phone' package for validation and normalization
    const result = phone(phoneNumber, { country: defaultCountry })
    
    if (result.isValid) {
      return {
        isValid: true,
        formatted: result.phoneNumber, // E.164 format
        countryISO: result.countryIso2?.toUpperCase()
      }
    }

    return { isValid: false, error: 'Please enter a valid phone number' }
  } catch (error) {
    // Fallback to libphonenumber-js
    try {
      const parsed = parsePhoneNumberFromString(phoneNumber, defaultCountry)
      
      if (parsed && parsed.isValid()) {
        return {
          isValid: true,
          formatted: parsed.formatInternational(),
          countryISO: parsed.country || undefined
        }
      }
    } catch {
      // Both methods failed
    }

    return { isValid: false, error: 'Invalid phone number format' }
  }
}

/**
 * Checks if a phone number is registered on WhatsApp using whatsapp-number-verify package
 * 
 * @param phoneNumber - Phone number in any format
 * @param apiKey - Wassenger API key (optional, can also be set via VITE_WASSENGER_API_KEY env var)
 * @returns Promise<{ hasWhatsApp: boolean; error?: string }>
 */
export async function checkWhatsAppAvailability(
  phoneNumber: string,
  apiKey?: string
): Promise<{ hasWhatsApp: boolean; error?: string }> {
  try {
    // Normalize the phone number using 'phone' package first
    // This removes operator prefixes and formats to E.164
    const normalized = phone(phoneNumber)
    
    if (!normalized.isValid) {
      return { hasWhatsApp: false, error: 'Invalid phone number format' }
    }

    const formattedNumber = normalized.phoneNumber // Already in E.164 format
    console.log('Checking WhatsApp for formatted number:', formattedNumber)

    // Get API key from parameter or environment variable
    const wassengerApiKey = apiKey || import.meta.env.VITE_WASSENGER_API_KEY

    if (!wassengerApiKey) {
      console.warn('No Wassenger API key provided. Add VITE_WASSENGER_API_KEY to .env or pass apiKey parameter')
      return { hasWhatsApp: false, error: 'WhatsApp check service not configured' }
    }

    // Use the whatsapp-number-verify package
    try {
      // verifyPhoneNumber takes (phoneNumber, options) where options has apiToken
      const result = await verifyPhoneNumber(formattedNumber, { apiToken: wassengerApiKey })
      // The result from Wassenger API typically has 'exists' or 'status' field
      return { hasWhatsApp: result.exists === true || result.status === 'exists' || result.status === 'success' }
    } catch (error: any) {
      console.error('Error checking WhatsApp via whatsapp-number-verify:', error)
      return { 
        hasWhatsApp: false, 
        error: error.message || 'Failed to check WhatsApp availability' 
      }
    }
  } catch (error: any) {
    console.error('Error checking WhatsApp availability:', error)
    return { hasWhatsApp: false, error: 'Failed to check WhatsApp availability' }
  }
}

/**
 * Gets country ISO code from country calling code using 'phone' package
 */
export function getCountryISOFromCallingCode(callingCode: string): string | null {
  try {
    // Use 'phone' package to detect country from calling code
    const codeWithoutPlus = callingCode.replace('+', '')
    const sampleNumber = `+${codeWithoutPlus}1234567890`
    const result = phone(sampleNumber)
    
    if (result.isValid && result.countryIso2) {
      return result.countryIso2.toUpperCase()
    }
  } catch {
    // Fallback to libphonenumber-js
    try {
      const codeWithoutPlus = callingCode.replace('+', '')
      const sampleNumber = `+${codeWithoutPlus}1234567890`
      const parsed = parsePhoneNumberFromString(sampleNumber)
      
      if (parsed && parsed.country) {
        return parsed.country
      }
    } catch {
      // Both methods failed
    }
  }
  
  return null
}

/**
 * Gets carrier/network operator information from phone number
 */
export function getCarrierFromPhoneNumber(phoneNumber: string): string | null {
  try {
    // First normalize the number
    const normalized = phone(phoneNumber)
    
    if (!normalized.isValid) {
      return null
    }

    // Use mobile-carriers package to find the network operator
    // findNetworkByPhoneNumber requires phone number and country code
    if (normalized.countryCode) {
      const carrier = findNetworkByPhoneNumber(normalized.phoneNumber, normalized.countryCode)
      return carrier || null
    }
    return null
  } catch (error) {
    console.error('Error getting carrier from phone number:', error)
    return null
  }
}

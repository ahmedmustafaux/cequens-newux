/**
 * Utility functions for managing active channels
 */

const STORAGE_KEY_ACTIVE_CHANNELS = 'cequens-active-channels'

/**
 * Get active channels from localStorage
 * @returns Array of active channel IDs
 */
export function getActiveChannels(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_CHANNELS)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Failed to load active channels:', error)
    return []
  }
}

/**
 * Set active channels in localStorage
 * @param channelIds Array of channel IDs to mark as active
 */
export function setActiveChannels(channelIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_CHANNELS, JSON.stringify(channelIds))
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('activeChannelsChanged', { 
      detail: { channelIds } 
    }))
  } catch (error) {
    console.error('Failed to save active channels:', error)
  }
}

/**
 * Add a channel to active channels
 * @param channelId Channel ID to add
 */
export function addActiveChannel(channelId: string): void {
  const current = getActiveChannels()
  if (!current.includes(channelId)) {
    setActiveChannels([...current, channelId])
  }
}

/**
 * Remove a channel from active channels
 * @param channelId Channel ID to remove
 */
export function removeActiveChannel(channelId: string): void {
  const current = getActiveChannels()
  setActiveChannels(current.filter(id => id !== channelId))
}

/**
 * Check if a channel is active
 * @param channelId Channel ID to check
 * @returns boolean indicating if channel is active
 */
export function isChannelActive(channelId: string): boolean {
  return getActiveChannels().includes(channelId)
}

/**
 * Check if any channel is active
 * @returns boolean indicating if any channel is active
 */
export function hasActiveChannels(): boolean {
  return getActiveChannels().length > 0
}

// WhatsApp configuration storage
const STORAGE_KEY_WHATSAPP_CONFIG = 'cequens-whatsapp-config'

export interface WhatsAppConfig {
  formData: {
    businessAccountId: string
    accessToken: string
    apiToken: string
    webhookUrl: string
    webhookVerifyToken: string
    about: string
  }
  phoneNumbers: Array<{
    id: string
    phoneNumber: string
    phoneNumberId: string
    displayName: string
    countryISO: string
    qualityRating: number
    messageLimit: number
    status: "verified" | "pending" | "restricted"
    messagesSent24h: number
    messagesReceived24h: number
    deliveryRate: number
  }>
}

/**
 * Save WhatsApp configuration to localStorage
 * @param config WhatsApp configuration object
 */
export function saveWhatsAppConfig(config: WhatsAppConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_WHATSAPP_CONFIG, JSON.stringify(config))
  } catch (error) {
    console.error('Failed to save WhatsApp config:', error)
  }
}

/**
 * Load WhatsApp configuration from localStorage
 * @returns WhatsApp configuration or null if not found
 */
export function loadWhatsAppConfig(): WhatsAppConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WHATSAPP_CONFIG)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Failed to load WhatsApp config:', error)
    return null
  }
}

/**
 * Clear WhatsApp configuration from localStorage
 */
export function clearWhatsAppConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_WHATSAPP_CONFIG)
  } catch (error) {
    console.error('Failed to clear WhatsApp config:', error)
  }
}

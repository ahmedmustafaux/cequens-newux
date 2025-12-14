import { supabase } from '../supabase'
import type { Contact, AppContact } from './types'

/**
 * Converts database Contact to app Contact format
 */
function dbContactToAppContact(dbContact: Contact): AppContact {
  return {
    id: dbContact.id,
    name: dbContact.name,
    firstName: dbContact.first_name || undefined,
    lastName: dbContact.last_name || undefined,
    phone: dbContact.phone,
    emailAddress: dbContact.email_address || undefined,
    countryISO: dbContact.country_iso,
    avatar: dbContact.avatar || dbContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    avatarColor: dbContact.avatar_color || 'bg-blue-500',
    tags: dbContact.tags || [],
    channel: dbContact.channel || 'whatsapp',
    conversationStatus: dbContact.conversation_status || 'unassigned',
    assignee: dbContact.assignee,
    lastMessage: dbContact.last_message || '',
    isSelected: false,
    createdAt: dbContact.created_at ? new Date(dbContact.created_at) : undefined,
    updatedAt: dbContact.updated_at ? new Date(dbContact.updated_at) : undefined,
    lastInteractionTime: dbContact.last_interaction_time ? new Date(dbContact.last_interaction_time) : undefined,
    language: dbContact.language || undefined,
    botStatus: dbContact.bot_status || undefined,
    lastInteractedChannel: dbContact.last_interacted_channel || undefined,
    conversationOpenedTime: dbContact.conversation_opened_time ? new Date(dbContact.conversation_opened_time) : undefined,
  }
}

/**
 * Converts app Contact to database Contact format
 */
function appContactToDbContact(appContact: Partial<AppContact>): Partial<Contact> {
  return {
    name: appContact.name,
    first_name: appContact.firstName || null,
    last_name: appContact.lastName || null,
    phone: appContact.phone,
    email_address: appContact.emailAddress || null,
    country_iso: appContact.countryISO,
    avatar: appContact.avatar || null,
    avatar_color: appContact.avatarColor || null,
    tags: appContact.tags || [],
    channel: appContact.channel || null,
    conversation_status: appContact.conversationStatus,
    assignee: appContact.assignee || null,
    last_message: appContact.lastMessage || null,
    language: appContact.language || null,
    bot_status: appContact.botStatus || null,
    last_interacted_channel: appContact.lastInteractedChannel || null,
    conversation_opened_time: appContact.conversationOpenedTime?.toISOString() || null,
    last_interaction_time: appContact.lastInteractionTime?.toISOString() || null,
  }
}

/**
 * Fetch all contacts
 */
export async function fetchContacts(): Promise<AppContact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    throw error
  }

  return (data || []).map(dbContactToAppContact)
}

/**
 * Fetch a single contact by ID
 */
export async function fetchContactById(id: string): Promise<AppContact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Error fetching contact:', error)
    throw error
  }

  return data ? dbContactToAppContact(data) : null
}

/**
 * Create a new contact
 */
export async function createContact(contact: Partial<AppContact>): Promise<AppContact> {
  const dbContact = appContactToDbContact(contact)

  const { data, error } = await supabase
    .from('contacts')
    .insert(dbContact)
    .select()
    .single()

  if (error) {
    console.error('Error creating contact:', error)
    throw error
  }

  return dbContactToAppContact(data)
}

/**
 * Update an existing contact
 */
export async function updateContact(id: string, contact: Partial<AppContact>): Promise<AppContact> {
  const dbContact = appContactToDbContact(contact)

  const { data, error } = await supabase
    .from('contacts')
    .update(dbContact)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating contact:', error)
    throw error
  }

  return dbContactToAppContact(data)
}

/**
 * Delete a contact
 */
export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting contact:', error)
    throw error
  }
}

/**
 * Filter contacts by conversation status
 */
export async function fetchContactsByStatus(status: string): Promise<AppContact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('conversation_status', status)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts by status:', error)
    throw error
  }

  return (data || []).map(dbContactToAppContact)
}


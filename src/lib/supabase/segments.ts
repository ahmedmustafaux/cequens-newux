import { supabase } from '../supabase'
import type { Segment, SegmentFilter } from './types'
import { fetchContacts } from './contacts'
import type { AppContact } from './types'

/**
 * Fetch all segments
 * @param userId - The ID of the user whose segments to fetch
 */
export async function fetchSegments(userId: string): Promise<Segment[]> {
  if (!userId) {
    throw new Error('userId is required to fetch segments')
  }

  const { data, error } = await supabase
    .from('segments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching segments:', error)
    throw error
  }

  return (data || []).map(segment => ({
    ...segment,
    filters: segment.filters as SegmentFilter[],
  }))
}

/**
 * Fetch a single segment by ID
 * @param userId - The ID of the user who owns the segment
 * @param id - The segment ID
 */
export async function fetchSegmentById(userId: string, id: string): Promise<Segment | null> {
  if (!userId) {
    throw new Error('userId is required to fetch segment')
  }

  const { data, error } = await supabase
    .from('segments')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Error fetching segment:', error)
    throw error
  }

  return data ? {
    ...data,
    filters: data.filters as SegmentFilter[],
  } : null
}

/**
 * Create a new segment
 * @param userId - The ID of the user creating the segment
 * @param segment - The segment data to create
 */
export async function createSegment(userId: string, segment: Omit<Segment, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'contact_ids'>): Promise<Segment> {
  if (!userId) {
    throw new Error('userId is required to create segment')
  }

  const { data, error } = await supabase
    .from('segments')
    .insert({
      user_id: userId,
      name: segment.name,
      description: segment.description || null,
      filters: segment.filters,
      contact_ids: [],
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating segment:', error)
    throw error
  }

  // Update contact_ids based on filters
  const updatedSegment = await updateSegmentContacts(userId, data.id)
  return {
    ...updatedSegment,
    filters: updatedSegment.filters as SegmentFilter[],
  }
}

/**
 * Update an existing segment
 * @param userId - The ID of the user who owns the segment
 * @param id - The segment ID
 * @param segment - The segment data to update
 */
export async function updateSegment(userId: string, id: string, segment: Partial<Omit<Segment, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Segment> {
  if (!userId) {
    throw new Error('userId is required to update segment')
  }

  const updateData: any = {}
  if (segment.name !== undefined) updateData.name = segment.name
  if (segment.description !== undefined) updateData.description = segment.description
  if (segment.filters !== undefined) updateData.filters = segment.filters
  if (segment.contact_ids !== undefined) updateData.contact_ids = segment.contact_ids

  const { data, error } = await supabase
    .from('segments')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating segment:', error)
    throw error
  }

  // Update contact_ids based on filters if filters were updated (and contact_ids wasn't explicitly set)
  if (segment.filters !== undefined && segment.contact_ids === undefined) {
    const updatedSegment = await updateSegmentContacts(userId, id)
    return {
      ...updatedSegment,
      filters: updatedSegment.filters as SegmentFilter[],
    }
  }

  return {
    ...data,
    filters: data.filters as SegmentFilter[],
  }
}

/**
 * Delete a segment
 * @param userId - The ID of the user who owns the segment
 * @param id - The segment ID
 */
export async function deleteSegment(userId: string, id: string): Promise<void> {
  if (!userId) {
    throw new Error('userId is required to delete segment')
  }

  const { error } = await supabase
    .from('segments')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting segment:', error)
    throw error
  }
}

/**
 * Update segment's contact_ids based on filters
 * This function evaluates the segment filters and updates the contact_ids array
 * @param userId - The ID of the user who owns the segment
 * @param segmentId - The segment ID
 */
export async function updateSegmentContacts(userId: string, segmentId: string): Promise<Segment> {
  const segment = await fetchSegmentById(userId, segmentId)
  if (!segment) {
    throw new Error('Segment not found')
  }

  // For now, we'll use a simple approach - in production you might want to
  // use Supabase's PostgREST filters or create a database function
  // For complex filters, you may need to fetch all contacts and filter in memory
  const contacts = await fetchContacts(userId)
  const matchingContactIds = getMatchingContactIds(contacts, segment.filters)

  const { data, error } = await supabase
    .from('segments')
    .update({ contact_ids: matchingContactIds })
    .eq('id', segmentId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating segment contacts:', error)
    throw error
  }

  return {
    ...data,
    filters: data.filters as SegmentFilter[],
  }
}

/**
 * Helper function to match contacts against segment filters
 * This is a simplified version - you may need to enhance this based on your filter logic
 */
function getMatchingContactIds(contacts: AppContact[], filters: SegmentFilter[]): string[] {
  if (filters.length === 0) {
    return []
  }

  return contacts
    .filter(contact => filters.every(filter => contactMatchesFilter(contact, filter)))
    .map(contact => contact.id)
}

/**
 * Check if a contact matches a filter
 * Comprehensive filter matching for all supported fields and operators
 */
function contactMatchesFilter(contact: AppContact, filter: SegmentFilter): boolean {
  const { field, operator, value } = filter

  switch (field) {
    // Country ISO
    case 'countryISO':
      if (operator === 'equals' && typeof value === 'string') {
        return contact.countryISO === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return contact.countryISO !== value
      }
      if (operator === 'in' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === contact.countryISO)
      }
      if (operator === 'notIn' && Array.isArray(value)) {
        return !value.some(v => typeof v === 'string' && v === contact.countryISO)
      }
      if (operator === 'hasAnyOf' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === contact.countryISO)
      }
      return false

    // Tags
    case 'tags':
      if (operator === 'isEmpty') {
        return contact.tags.length === 0
      }
      if (operator === 'isNotEmpty') {
        return contact.tags.length > 0
      }
      if (operator === 'hasAnyOf' && Array.isArray(value)) {
        return value.some(tag => typeof tag === 'string' && contact.tags.includes(tag))
      }
      if (operator === 'hasAllOf' && Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string' && contact.tags.includes(tag))
      }
      if (operator === 'hasNoneOf' && Array.isArray(value)) {
        return !value.some(tag => typeof tag === 'string' && contact.tags.includes(tag))
      }
      if (operator === 'equals' && typeof value === 'string') {
        return contact.tags.includes(value)
      }
      return false

    // Channel
    case 'channel':
      if (operator === 'equals' && typeof value === 'string') {
        return contact.channel === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return contact.channel !== value
      }
      if (operator === 'exists') {
        return contact.channel !== null && contact.channel !== undefined && contact.channel !== ''
      }
      if (operator === 'doesNotExist') {
        return contact.channel === null || contact.channel === undefined || contact.channel === ''
      }
      if (operator === 'hasAnyOf' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === contact.channel)
      }
      if (operator === 'hasAllOf' && Array.isArray(value)) {
        return Array.isArray(value) && value.length > 0 && value.every(v => typeof v === 'string' && v === contact.channel)
      }
      if (operator === 'hasNoneOf' && Array.isArray(value)) {
        return !value.some(v => typeof v === 'string' && v === contact.channel)
      }
      return false

    // Conversation Status
    case 'conversationStatus':
      if (operator === 'equals' && typeof value === 'string') {
        return contact.conversationStatus === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return contact.conversationStatus !== value
      }
      if (operator === 'in' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === contact.conversationStatus)
      }
      if (operator === 'notIn' && Array.isArray(value)) {
        return !value.some(v => typeof v === 'string' && v === contact.conversationStatus)
      }
      if (operator === 'hasAnyOf' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === contact.conversationStatus)
      }
      return false

    // First Name
    case 'firstName':
      const firstName = contact.firstName || ''
      if (operator === 'equals' && typeof value === 'string') {
        return firstName === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return firstName !== value
      }
      if (operator === 'contains' && typeof value === 'string') {
        return firstName.toLowerCase().includes(value.toLowerCase())
      }
      if (operator === 'notContains' && typeof value === 'string') {
        return !firstName.toLowerCase().includes(value.toLowerCase())
      }
      if (operator === 'startsWith' && typeof value === 'string') {
        return firstName.toLowerCase().startsWith(value.toLowerCase())
      }
      if (operator === 'endsWith' && typeof value === 'string') {
        return firstName.toLowerCase().endsWith(value.toLowerCase())
      }
      if (operator === 'isEmpty') {
        return firstName === ''
      }
      if (operator === 'isNotEmpty') {
        return firstName !== ''
      }
      return false

    // Last Name
    case 'lastName':
      const lastName = contact.lastName || ''
      if (operator === 'equals' && typeof value === 'string') {
        return lastName === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return lastName !== value
      }
      if (operator === 'contains' && typeof value === 'string') {
        return lastName.toLowerCase().includes(value.toLowerCase())
      }
      if (operator === 'notContains' && typeof value === 'string') {
        return !lastName.toLowerCase().includes(value.toLowerCase())
      }
      if (operator === 'startsWith' && typeof value === 'string') {
        return lastName.toLowerCase().startsWith(value.toLowerCase())
      }
      if (operator === 'endsWith' && typeof value === 'string') {
        return lastName.toLowerCase().endsWith(value.toLowerCase())
      }
      if (operator === 'isEmpty') {
        return lastName === ''
      }
      if (operator === 'isNotEmpty') {
        return lastName !== ''
      }
      return false

    // Phone Number
    case 'phoneNumber':
      const phone = contact.phone || ''
      if (operator === 'equals' && typeof value === 'string') {
        return phone === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return phone !== value
      }
      if (operator === 'contains' && typeof value === 'string') {
        return phone.includes(value)
      }
      if (operator === 'startsWith' && typeof value === 'string') {
        return phone.startsWith(value)
      }
      if (operator === 'endsWith' && typeof value === 'string') {
        return phone.endsWith(value)
      }
      if (operator === 'exists') {
        return phone !== null && phone !== undefined && phone !== ''
      }
      if (operator === 'doesNotExist') {
        return phone === null || phone === undefined || phone === ''
      }
      return false

    // Email Address
    case 'emailAddress':
      const email = contact.emailAddress || ''
      if (operator === 'equals' && typeof value === 'string') {
        return email === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return email !== value
      }
      if (operator === 'contains' && typeof value === 'string') {
        return email.toLowerCase().includes(value.toLowerCase())
      }
      if (operator === 'startsWith' && typeof value === 'string') {
        return email.toLowerCase().startsWith(value.toLowerCase())
      }
      if (operator === 'endsWith' && typeof value === 'string') {
        return email.toLowerCase().endsWith(value.toLowerCase())
      }
      if (operator === 'exists') {
        return email !== null && email !== undefined && email !== ''
      }
      if (operator === 'doesNotExist') {
        return email === null || email === undefined || email === ''
      }
      return false

    // Language
    case 'language':
      const language = contact.language || ''
      if (operator === 'equals' && typeof value === 'string') {
        return language === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return language !== value
      }
      if (operator === 'in' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === language)
      }
      if (operator === 'notIn' && Array.isArray(value)) {
        return !value.some(v => typeof v === 'string' && v === language)
      }
      if (operator === 'hasAnyOf' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === language)
      }
      return false

    // Bot Status
    case 'botStatus':
      const botStatus = contact.botStatus || ''
      if (operator === 'equals' && typeof value === 'string') {
        return botStatus === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return botStatus !== value
      }
      if (operator === 'in' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === botStatus)
      }
      if (operator === 'notIn' && Array.isArray(value)) {
        return !value.some(v => typeof v === 'string' && v === botStatus)
      }
      if (operator === 'hasAnyOf' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === botStatus)
      }
      return false

    // Assignee
    case 'assignee':
      const assignee = contact.assignee || ''
      if (operator === 'equals' && typeof value === 'string') {
        return assignee === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return assignee !== value
      }
      if (operator === 'in' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === assignee)
      }
      if (operator === 'notIn' && Array.isArray(value)) {
        return !value.some(v => typeof v === 'string' && v === assignee)
      }
      if (operator === 'hasAnyOf' && Array.isArray(value)) {
        return value.some(v => typeof v === 'string' && v === assignee)
      }
      if (operator === 'isEmpty') {
        return assignee === null || assignee === undefined || assignee === ''
      }
      if (operator === 'isNotEmpty') {
        return assignee !== null && assignee !== undefined && assignee !== ''
      }
      return false

    // Last Interacted Channel
    case 'lastInteractedChannel':
      const lastInteractedChannel = contact.lastInteractedChannel || ''
      if (operator === 'equals' && typeof value === 'string') {
        return lastInteractedChannel === value
      }
      if (operator === 'notEquals' && typeof value === 'string') {
        return lastInteractedChannel !== value
      }
      if (operator === 'exists') {
        return lastInteractedChannel !== null && lastInteractedChannel !== undefined && lastInteractedChannel !== ''
      }
      if (operator === 'doesNotExist') {
        return lastInteractedChannel === null || lastInteractedChannel === undefined || lastInteractedChannel === ''
      }
      return false

    // Created At
    case 'createdAt':
      if (!contact.createdAt) {
        return operator === 'doesNotExist' || operator === 'isEmpty'
      }
      const createdAt = contact.createdAt
      if (operator === 'exists') {
        return true
      }
      if (operator === 'doesNotExist') {
        return false
      }
      if (operator === 'isLessThanTime' && typeof value === 'number') {
        const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceCreation < value
      }
      if (operator === 'isGreaterThanTime' && typeof value === 'number') {
        const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceCreation > value
      }
      if (operator === 'isTimestampAfter' && typeof value === 'string') {
        const filterDate = new Date(value)
        return createdAt > filterDate
      }
      if (operator === 'isTimestampBefore' && typeof value === 'string') {
        const filterDate = new Date(value)
        return createdAt < filterDate
      }
      if (operator === 'isTimestampBetween' && typeof value === 'object' && value !== null && 'from' in value && 'to' in value) {
        const fromDate = new Date(value.from)
        const toDate = new Date(value.to)
        return createdAt >= fromDate && createdAt <= toDate
      }
      return false

    // Last Interaction Time
    case 'lastInteractionTime':
      if (!contact.lastInteractionTime) {
        return operator === 'doesNotExist' || operator === 'isEmpty'
      }
      const lastInteractionTime = contact.lastInteractionTime
      if (operator === 'exists') {
        return true
      }
      if (operator === 'doesNotExist') {
        return false
      }
      if (operator === 'isGreaterThanTime' && typeof value === 'number') {
        const daysSinceInteraction = Math.floor((Date.now() - lastInteractionTime.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceInteraction > value
      }
      if (operator === 'isLessThanTime' && typeof value === 'number') {
        const daysSinceInteraction = Math.floor((Date.now() - lastInteractionTime.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceInteraction < value
      }
      if (operator === 'isTimestampAfter' && typeof value === 'string') {
        const filterDate = new Date(value)
        return lastInteractionTime > filterDate
      }
      if (operator === 'isTimestampBefore' && typeof value === 'string') {
        const filterDate = new Date(value)
        return lastInteractionTime < filterDate
      }
      if (operator === 'isTimestampBetween' && typeof value === 'object' && value !== null && 'from' in value && 'to' in value) {
        const fromDate = new Date(value.from)
        const toDate = new Date(value.to)
        return lastInteractionTime >= fromDate && lastInteractionTime <= toDate
      }
      return false

    // Conversation Opened Time
    case 'conversationOpenedTime':
      if (!contact.conversationOpenedTime) {
        return operator === 'doesNotExist' || operator === 'isEmpty'
      }
      const conversationOpenedTime = contact.conversationOpenedTime
      if (operator === 'exists') {
        return true
      }
      if (operator === 'doesNotExist') {
        return false
      }
      if (operator === 'isTimestampAfter' && typeof value === 'string') {
        const filterDate = new Date(value)
        return conversationOpenedTime > filterDate
      }
      if (operator === 'isTimestampBefore' && typeof value === 'string') {
        const filterDate = new Date(value)
        return conversationOpenedTime < filterDate
      }
      if (operator === 'isTimestampBetween' && typeof value === 'object' && value !== null && 'from' in value && 'to' in value) {
        const fromDate = new Date(value.from)
        const toDate = new Date(value.to)
        return conversationOpenedTime >= fromDate && conversationOpenedTime <= toDate
      }
      return false

    // Time Since Last Incoming Message (using lastInteractionTime as proxy)
    case 'timeSinceLastIncomingMessage':
      if (!contact.lastInteractionTime) {
        return operator === 'doesNotExist' || operator === 'isEmpty'
      }
      const lastMessageTime = contact.lastInteractionTime
      if (operator === 'exists') {
        return true
      }
      if (operator === 'doesNotExist') {
        return false
      }
      if (operator === 'isGreaterThanTime' && typeof value === 'number') {
        const daysSince = Math.floor((Date.now() - lastMessageTime.getTime()) / (1000 * 60 * 60 * 24))
        return daysSince > value
      }
      if (operator === 'isLessThanTime' && typeof value === 'number') {
        const daysSince = Math.floor((Date.now() - lastMessageTime.getTime()) / (1000 * 60 * 60 * 24))
        return daysSince < value
      }
      if (operator === 'isTimestampAfter' && typeof value === 'string') {
        const filterDate = new Date(value)
        return lastMessageTime > filterDate
      }
      if (operator === 'isTimestampBefore' && typeof value === 'string') {
        const filterDate = new Date(value)
        return lastMessageTime < filterDate
      }
      if (operator === 'isTimestampBetween' && typeof value === 'object' && value !== null && 'from' in value && 'to' in value) {
        const fromDate = new Date(value.from)
        const toDate = new Date(value.to)
        return lastMessageTime >= fromDate && lastMessageTime <= toDate
      }
      return false

    default:
      return false
  }
}


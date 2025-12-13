import { supabase } from '../supabase'
import type { Segment, SegmentFilter } from './types'
import { fetchContacts } from './contacts'
import type { AppContact } from './types'

/**
 * Fetch all segments
 */
export async function fetchSegments(): Promise<Segment[]> {
  const { data, error } = await supabase
    .from('segments')
    .select('*')
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
 */
export async function fetchSegmentById(id: string): Promise<Segment | null> {
  const { data, error } = await supabase
    .from('segments')
    .select('*')
    .eq('id', id)
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
 */
export async function createSegment(segment: Omit<Segment, 'id' | 'created_at' | 'updated_at' | 'contact_ids'>): Promise<Segment> {
  const { data, error } = await supabase
    .from('segments')
    .insert({
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
  const updatedSegment = await updateSegmentContacts(data.id)
  return {
    ...updatedSegment,
    filters: updatedSegment.filters as SegmentFilter[],
  }
}

/**
 * Update an existing segment
 */
export async function updateSegment(id: string, segment: Partial<Omit<Segment, 'id' | 'created_at' | 'updated_at'>>): Promise<Segment> {
  const updateData: any = {}
  if (segment.name !== undefined) updateData.name = segment.name
  if (segment.description !== undefined) updateData.description = segment.description
  if (segment.filters !== undefined) updateData.filters = segment.filters

  const { data, error } = await supabase
    .from('segments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating segment:', error)
    throw error
  }

  // Update contact_ids based on filters if filters were updated
  if (segment.filters !== undefined) {
    const updatedSegment = await updateSegmentContacts(id)
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
 */
export async function deleteSegment(id: string): Promise<void> {
  const { error } = await supabase
    .from('segments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting segment:', error)
    throw error
  }
}

/**
 * Update segment's contact_ids based on filters
 * This function evaluates the segment filters and updates the contact_ids array
 */
export async function updateSegmentContacts(segmentId: string): Promise<Segment> {
  const segment = await fetchSegmentById(segmentId)
  if (!segment) {
    throw new Error('Segment not found')
  }

  // For now, we'll use a simple approach - in production you might want to
  // use Supabase's PostgREST filters or create a database function
  // For complex filters, you may need to fetch all contacts and filter in memory
  const contacts = await fetchContacts()
  const matchingContactIds = getMatchingContactIds(contacts, segment.filters)

  const { data, error } = await supabase
    .from('segments')
    .update({ contact_ids: matchingContactIds })
    .eq('id', segmentId)
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
 * Simplified version - matches the logic from mock-data.ts
 */
function contactMatchesFilter(contact: AppContact, filter: SegmentFilter): boolean {
  const { field, operator, value } = filter

  switch (field) {
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
      return false

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
      if (operator === 'equals' && typeof value === 'string') {
        return contact.tags.includes(value)
      }
      return false

    case 'channel':
      if (operator === 'equals' && typeof value === 'string') {
        return contact.channel === value
      }
      return false

    case 'conversationStatus':
      if (operator === 'equals' && typeof value === 'string') {
        return contact.conversationStatus === value
      }
      return false

    case 'createdAt':
      if (contact.createdAt && operator === 'isLessThanTime' && typeof value === 'number') {
        const daysSinceCreation = Math.floor((Date.now() - contact.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceCreation < value
      }
      if (contact.createdAt && operator === 'isGreaterThanTime' && typeof value === 'number') {
        const daysSinceCreation = Math.floor((Date.now() - contact.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceCreation > value
      }
      return false

    case 'lastInteractionTime':
      if (!contact.lastInteractionTime) {
        return operator === 'doesNotExist' || operator === 'isEmpty'
      }
      if (operator === 'isGreaterThanTime' && typeof value === 'number') {
        const daysSinceInteraction = Math.floor((Date.now() - contact.lastInteractionTime.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceInteraction > value
      }
      if (operator === 'isLessThanTime' && typeof value === 'number') {
        const daysSinceInteraction = Math.floor((Date.now() - contact.lastInteractionTime.getTime()) / (1000 * 60 * 60 * 24))
        return daysSinceInteraction < value
      }
      return false

    default:
      return false
  }
}


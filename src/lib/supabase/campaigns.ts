import { supabase } from '../supabase'
import type { Campaign } from './types'

/**
 * Fetch all campaigns
 */
export async function fetchCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching campaigns:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch a single campaign by ID
 */
export async function fetchCampaignById(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Error fetching campaign:', error)
    throw error
  }

  return data
}

/**
 * Create a new campaign
 */
export async function createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single()

  if (error) {
    console.error('Error creating campaign:', error)
    throw error
  }

  return data
}

/**
 * Update an existing campaign
 */
export async function updateCampaign(id: string, campaign: Partial<Omit<Campaign, 'id' | 'created_at' | 'updated_at'>>): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .update(campaign)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating campaign:', error)
    throw error
  }

  return data
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting campaign:', error)
    throw error
  }
}


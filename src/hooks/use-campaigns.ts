import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCampaigns, fetchCampaignById, createCampaign, updateCampaign, deleteCampaign } from '@/lib/supabase/campaigns'
import type { Campaign } from '@/lib/supabase/types'

// Query keys
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...campaignKeys.lists(), filters] as const,
  details: () => [...campaignKeys.all, 'detail'] as const,
  detail: (id: string) => [...campaignKeys.details(), id] as const,
}

/**
 * Fetch all campaigns
 */
export function useCampaigns() {
  return useQuery({
    queryKey: campaignKeys.lists(),
    queryFn: fetchCampaigns,
  })
}

/**
 * Fetch a single campaign by ID
 */
export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: campaignKeys.detail(id || ''),
    queryFn: () => fetchCampaignById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new campaign
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
    },
  })
}

/**
 * Update an existing campaign
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, campaign }: { id: string; campaign: Partial<Omit<Campaign, 'id' | 'created_at' | 'updated_at'>> }) =>
      updateCampaign(id, campaign),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(data.id) })
    },
  })
}

/**
 * Delete a campaign
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
    },
  })
}


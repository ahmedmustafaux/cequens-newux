import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSegments, fetchSegmentById, createSegment, updateSegment, deleteSegment, updateSegmentContacts } from '@/lib/supabase/segments'
import type { Segment } from '@/lib/supabase/types'

// Query keys
export const segmentKeys = {
  all: ['segments'] as const,
  lists: () => [...segmentKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...segmentKeys.lists(), filters] as const,
  details: () => [...segmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...segmentKeys.details(), id] as const,
}

/**
 * Fetch all segments
 */
export function useSegments() {
  return useQuery({
    queryKey: segmentKeys.lists(),
    queryFn: fetchSegments,
  })
}

/**
 * Fetch a single segment by ID
 */
export function useSegment(id: string | undefined) {
  return useQuery({
    queryKey: segmentKeys.detail(id || ''),
    queryFn: () => fetchSegmentById(id!),
    enabled: !!id,
  })
}

/**
 * Create a new segment
 */
export function useCreateSegment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: segmentKeys.lists() })
    },
  })
}

/**
 * Update an existing segment
 */
export function useUpdateSegment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, segment }: { id: string; segment: Partial<Omit<Segment, 'id' | 'created_at' | 'updated_at'>> }) =>
      updateSegment(id, segment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: segmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: segmentKeys.detail(data.id) })
    },
  })
}

/**
 * Delete a segment
 */
export function useDeleteSegment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: segmentKeys.lists() })
    },
  })
}

/**
 * Update segment contacts
 */
export function useUpdateSegmentContacts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSegmentContacts,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: segmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: segmentKeys.detail(data.id) })
    },
  })
}


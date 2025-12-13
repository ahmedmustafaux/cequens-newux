import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchContacts, fetchContactById, createContact, updateContact, deleteContact, fetchContactsByStatus } from '@/lib/supabase/contacts'
import type { AppContact } from '@/lib/supabase/types'

// Query keys
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...contactKeys.lists(), filters] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
}

/**
 * Fetch all contacts
 */
export function useContacts() {
  return useQuery({
    queryKey: contactKeys.lists(),
    queryFn: fetchContacts,
  })
}

/**
 * Fetch a single contact by ID
 */
export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: contactKeys.detail(id || ''),
    queryFn: () => fetchContactById(id!),
    enabled: !!id,
  })
}

/**
 * Fetch contacts by status
 */
export function useContactsByStatus(status: string) {
  return useQuery({
    queryKey: [...contactKeys.lists(), 'status', status],
    queryFn: () => fetchContactsByStatus(status),
  })
}

/**
 * Create a new contact
 */
export function useCreateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
    },
  })
}

/**
 * Update an existing contact
 */
export function useUpdateContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: Partial<AppContact> }) =>
      updateContact(id, contact),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(data.id) })
    },
  })
}

/**
 * Delete a contact
 */
export function useDeleteContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
    },
  })
}


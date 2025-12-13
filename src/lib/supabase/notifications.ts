import { supabase } from '../supabase'
import type { Notification } from './types'

/**
 * Fetch all notifications
 */
export async function fetchNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch unread notifications
 */
export async function fetchUnreadNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('read', false)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching unread notifications:', error)
    throw error
  }

  return data || []
}

/**
 * Create a new notification
 */
export async function createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    throw error
  }

  return data
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(id: string): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error marking notification as read:', error)
    throw error
  }

  return data
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('read', false)

  if (error) {
    console.error('Error marking all notifications as read:', error)
    throw error
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting notification:', error)
    throw error
  }
}


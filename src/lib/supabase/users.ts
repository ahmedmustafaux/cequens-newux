import { supabase } from '../supabase'

export type User = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company_name: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type CreateUserInput = {
  email: string
  password_hash: string
  first_name?: string
  last_name?: string
  company_name?: string
}

// Simple password hashing using SHA-256
// Note: In production, consider using server-side password hashing (bcrypt) 
// or Supabase Auth for better security
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

/**
 * Create a new user
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  const password_hash = await hashPassword(input.password_hash) // input.password_hash is actually the plain password
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: input.email,
      password_hash: password_hash,
      first_name: input.first_name || null,
      last_name: input.last_name || null,
      company_name: input.company_name || null,
      onboarding_completed: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    throw error
  }

  // Don't return password_hash
  const { password_hash: _, ...userWithoutPassword } = data
  return userWithoutPassword as User
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, company_name, onboarding_completed, created_at, updated_at')
    .eq('email', email)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    console.error('Error finding user:', error)
    throw error
  }

  return data as User
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // First get the user with password hash
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) {
    return null
  }

  // Verify password
  const isValid = await verifyPassword(password, data.password_hash)
  if (!isValid) {
    return null
  }

  // Return user without password_hash
  const { password_hash: _, ...userWithoutPassword } = data
  return userWithoutPassword as User
}

/**
 * Update user onboarding status
 */
export async function updateUserOnboarding(userId: string, completed: boolean): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update({ onboarding_completed: completed })
    .eq('id', userId)
    .select('id, email, first_name, last_name, company_name, onboarding_completed, created_at, updated_at')
    .single()

  if (error) {
    console.error('Error updating user onboarding:', error)
    throw error
  }

  return data as User
}

/**
 * Check if email already exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email)
  return user !== null
}


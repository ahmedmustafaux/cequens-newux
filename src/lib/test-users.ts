import { getAppName } from "./config"

// Get the app name for email addresses
const appName = getAppName().toLowerCase()

export interface TestUser {
  email: string
  password: string
  firstName: string
  lastName: string
  requiresPhoneVerification: boolean
  requiresOtp: boolean
}

// Test users for development and testing
export const testUsers: Record<string, TestUser> = {
  demo: {
    email: `demo@${appName}.com`,
    password: "Demo123!@#",
    firstName: "Ahmed",
    lastName: "Mustafa",
    requiresPhoneVerification: false,
    requiresOtp: true
  },
  ahmed: {
    email: `ahmed@${appName}.com`,
    password: "Demo123!@#",
    firstName: "Ahmed",
    lastName: "Mustafa",
    requiresPhoneVerification: true,
    requiresOtp: false
  }
}

// Helper function to get a test user by key
export function getTestUser(key: keyof typeof testUsers): TestUser {
  return testUsers[key]
}

// Helper function to check if an email belongs to a test user
export function isTestUser(email: string): boolean {
  return Object.values(testUsers).some(user => user.email === email)
}

// Helper function to get a test user by email
export function getTestUserByEmail(email: string): TestUser | undefined {
  return Object.values(testUsers).find(user => user.email === email)
}
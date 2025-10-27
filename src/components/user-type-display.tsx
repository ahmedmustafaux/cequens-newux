import * as React from "react"
import { useAuth } from "@/hooks/use-auth"
import { useNewUserFeature, useExistingUserFeature } from "@/lib/user-utils"
import { Badge } from "@/components/ui/badge"

/**
 * Component to display user type information
 */
export function UserTypeDisplay() {
  const { user } = useAuth()
  const isNewUser = useNewUserFeature()
  const isExistingUser = useExistingUserFeature()
  
  if (!user) {
    return null
  }
  
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg">
      <div className="flex items-center gap-2">
        <span className="font-medium">User:</span>
        <span>{user.email}</span>
        {user.userType === "newUser" ? (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            New User
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Existing User
          </Badge>
        )}
      </div>
      
      {isNewUser && (
        <div className="mt-2 p-3 bg-blue-50 text-blue-700 rounded border border-blue-200">
          <p className="text-sm font-medium">New User Features</p>
          <p className="text-xs mt-1">You're seeing this because you're a new user.</p>
        </div>
      )}
      
      {isExistingUser && (
        <div className="mt-2 p-3 bg-green-50 text-green-700 rounded border border-green-200">
          <p className="text-sm font-medium">Existing User Features</p>
          <p className="text-xs mt-1">You're seeing this because you're an existing user.</p>
        </div>
      )}
    </div>
  )
}

/**
 * Component to display content only for new users
 */
export function NewUserFeature({ children }: { children: React.ReactNode }) {
  const isNewUser = useNewUserFeature()
  
  if (!isNewUser) {
    return null
  }
  
  return (
    <div className="p-3 bg-blue-50 text-blue-700 rounded border border-blue-200">
      {children}
    </div>
  )
}

/**
 * Component to display content only for existing users
 */
export function ExistingUserFeature({ children }: { children: React.ReactNode }) {
  const isExistingUser = useExistingUserFeature()
  
  if (!isExistingUser) {
    return null
  }
  
  return (
    <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200">
      {children}
    </div>
  )
}
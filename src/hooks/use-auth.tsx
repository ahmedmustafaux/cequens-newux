import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

interface User {
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, name?: string, redirectTo?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const navigate = useNavigate()

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Check for existing authentication on mount
    const checkAuthStatus = () => {
      try {
        const isAuthenticated = localStorage.getItem("isAuthenticated")
        const userEmail = localStorage.getItem("userEmail")
        const userName = localStorage.getItem("userName")

        if (isAuthenticated === "true" && userEmail) {
          setUser({
            email: userEmail,
            name: userName || undefined
          })
        } else {
          // Clear any partial auth data if invalid
          localStorage.removeItem("isAuthenticated")
          localStorage.removeItem("userEmail")
          localStorage.removeItem("userName")
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Listen for storage changes (logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isAuthenticated" && e.newValue === null) {
        // User logged out in another tab
        setUser(null)
        navigate("/login")
      } else if (e.key === "isAuthenticated" && e.newValue === "true") {
        // User logged in another tab, refresh auth state
        checkAuthStatus()
      }
    }

    // Small delay to prevent hydration issues
    const timeoutId = setTimeout(checkAuthStatus, 100)
    
    // Add storage event listener for cross-tab auth sync
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange)
    }
    
    return () => {
      clearTimeout(timeoutId)
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [navigate, isClient])

  const login = (email: string, name?: string, redirectTo?: string) => {
    try {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)
      if (name) {
        localStorage.setItem("userName", name)
      }
      
      setUser({ email, name })
      
      // Navigate to intended page or dashboard
      const destination = redirectTo || "/"
      navigate(destination, { replace: true })
    } catch (error) {
      console.error("Error during login:", error)
      // Handle login error if needed
    }
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    setUser(null)
    navigate("/login")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

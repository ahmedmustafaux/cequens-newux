/**
 * Utility function to clear all authentication data from localStorage
 * Useful for debugging or starting fresh
 */
export function clearAuthState() {
  localStorage.removeItem("isAuthenticated")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userName")
  localStorage.removeItem("userType")
  localStorage.removeItem("userId")
  localStorage.removeItem("onboardingCompleted")
  
  // Also clear onboarding-related localStorage
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith('onboarding-completed-') || 
        key.startsWith('onboarding-data-') ||
        key.startsWith('getting-started-seen-')) {
      localStorage.removeItem(key)
    }
  })
  
  console.log("Auth state cleared")
}

// Make it available in browser console for easy access
if (typeof window !== 'undefined') {
  (window as any).clearAuth = clearAuthState
}


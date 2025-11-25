import { Toaster as Sonner, ToasterProps } from "sonner"
import { useEffect, useState } from "react"

const Toaster = ({ ...props }: ToasterProps) => {
  // Default position is top-right, but check localStorage for saved preference
  const [position, setPosition] = useState<ToasterProps["position"]>("top-right")
  
  useEffect(() => {
    // Get position from localStorage on component mount
    const savedPosition = localStorage.getItem("toast-position")
    if (savedPosition) {
      setPosition(savedPosition as ToasterProps["position"])
    }
    
    // Listen for storage changes (when position is updated in settings)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "toast-position" && e.newValue) {
        setPosition(e.newValue as ToasterProps["position"])
      }
    }
    
    // Listen for custom event (for same-tab updates)
    const handlePositionChange = (e: CustomEvent) => {
      if (e.detail) {
        setPosition(e.detail as ToasterProps["position"])
      }
    }
    
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("toast-position-changed" as any, handlePositionChange as any)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("toast-position-changed" as any, handlePositionChange as any)
    }
  }, [])
  
  return (
    <Sonner
      theme="light"
      position={position}
      className="toaster"
      toastOptions={{
        duration: 4000,
        closeButton: false,
      }}
      {...props}
    />
  )
}
export { Toaster }

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

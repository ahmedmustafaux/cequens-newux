import { Toaster as Sonner, ToasterProps } from "sonner"
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
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

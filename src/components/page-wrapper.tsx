import { ReactNode } from "react"
import { useNavigationContext } from "@/hooks/use-navigation-context"
import { motion, AnimatePresence } from "framer-motion"
interface PageWrapperProps {
  children: ReactNode
  isLoading?: boolean
}
export function PageWrapper({ 
  children, 
  isLoading: propIsLoading = false 
}: PageWrapperProps) {
  const { isLoading: contextIsLoading } = useNavigationContext()
  const isLoading = propIsLoading || contextIsLoading
  return (
    <div className="min-h-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Loading skeleton */}
            <div className="space-y-2">
              <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-md" />
              <div className="h-4 w-96 bg-gray-200 animate-pulse rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md" />
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded-md" />
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md" />
              </div>
            </div>
            
            {/* Card skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
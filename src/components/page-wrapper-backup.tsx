"use client"

import { useState } from "react"
import { useNavigationContext } from "@/hooks/use-navigation-context"
import { motion, AnimatePresence } from "framer-motion"
import { pageWrapperLoadingVariants, skeletonStaggerVariants, skeletonItemVariants } from "@/lib/transitions"
import { CardSkeleton } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

interface PageWrapperProps {
  children: React.ReactNode
  isLoading?: boolean
  showFixedHeader?: boolean
  headerTitle?: string
  headerDescription?: string
  showHeaderSearch?: boolean
  headerSearchPlaceholder?: string
}

export function PageWrapper({ 
  children, 
  isLoading: propIsLoading = false,
  showFixedHeader = false,
  headerTitle,
  headerDescription,
  showHeaderSearch = true,
  headerSearchPlaceholder = "Search..."
}: PageWrapperProps) {
  const { isLoading: contextIsLoading } = useNavigationContext()
  const isLoading = propIsLoading || contextIsLoading
  
  const [searchValue, setSearchValue] = useState("")
  const [isActionCenterOpen, setIsActionCenterOpen] = useState(false)

  const handleGlobalSearch = (value: string) => {
    setSearchValue(value)
    // Handle global search functionality here
  }

  const handleSearchFocus = () => {
    setIsActionCenterOpen(true)
  }

  const handleActionCenterClose = () => {
    setIsActionCenterOpen(false)
  }

  return (
    <motion.div 
      className="sidebar-content-transition h-full flex flex-col max-w-full overflow-x-hidden"
      variants={pageWrapperLoadingVariants}
      initial="initial"
      animate={isLoading ? "loading" : "loaded"}
    >
      {showFixedHeader && (
        <div className="sticky top-0 z-50 bg-white border-b border-border rounded-b-xl shadow-sm">
          <PageHeader 
            title={headerTitle}
            description={headerDescription}
            showBreadcrumbs={true} 
            showSearch={showHeaderSearch}
            searchPlaceholder={headerSearchPlaceholder}
            searchValue={searchValue}
            onSearchChange={handleGlobalSearch}
            onSearchFocus={handleSearchFocus}
            isActionCenterOpen={isActionCenterOpen}
            onActionCenterClose={handleActionCenterClose}
            isLoading={isLoading} 
          />
        </div>
      )}
      <div className="sidebar-content-transition flex-1 flex flex-col min-h-0 min-w-0">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              className="space-y-4 px-[var(--dashboard-padding)] sm:px-[var(--dashboard-padding-sm)] md:px-[var(--dashboard-padding-md)] py-[var(--dashboard-padding)] max-w-full pb-[calc(var(--header-height-mobile)+var(--dashboard-padding-lg))] md:pb-[var(--dashboard-padding-md)]"
              variants={skeletonStaggerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <motion.div variants={skeletonItemVariants}>
                <div className="h-8 w-64 bg-muted animate-pulse rounded-md" />
              </motion.div>
              <motion.div variants={skeletonItemVariants}>
                <div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
              </motion.div>
              <div className="space-y-2">
                <motion.div variants={skeletonItemVariants}>
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                </motion.div>
                <motion.div variants={skeletonItemVariants}>
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                </motion.div>
                <motion.div variants={skeletonItemVariants}>
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md" />
                </motion.div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="flex-1 flex flex-col max-w-full min-w-0 px-[var(--dashboard-padding)] sm:px-[var(--dashboard-padding-sm)] md:px-[var(--dashboard-padding-md)] py-[var(--dashboard-padding)] pb-[calc(var(--header-height-mobile)+var(--dashboard-padding-lg))] md:pb-[var(--dashboard-padding-md)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </motion.div>
  )
}

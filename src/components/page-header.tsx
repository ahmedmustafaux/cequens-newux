import { Link, useLocation } from "react-router-dom"
import React, { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { motion } from "framer-motion"
import { skeletonStaggerVariants, skeletonItemVariants } from "@/lib/transitions"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NotificationBell } from "@/components/notification-bell"
import { ArrowLeft, Search } from "lucide-react"
import { mockContacts } from "@/data/mock-data"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Field, 
  FieldContent 
} from "@/components/ui/field"
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon 
} from "@/components/ui/input-group"
import { ActionCenter } from "@/components/action-center"
import { useIsMobile } from "@/hooks/use-mobile"
interface BreadcrumbItem {
  label: string
  href: string
  isCurrent: boolean
}
// Action button configuration
interface ActionButton {
  label: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  href?: string
  disabled?: boolean
  icon?: ReactNode
}
// Main page header props
interface PageHeaderProps {
  // Basic content
  title?: string
  description?: string
  
  // Navigation
  showBreadcrumbs?: boolean
  customBreadcrumbs?: BreadcrumbItem[]
  
  // Search functionality
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearchFocus?: () => void
  isActionCenterOpen?: boolean
  onActionCenterClose?: () => void
  
  // Filters
  showFilters?: boolean
  filters?: ReactNode
  
  
  // Actions (1-3 buttons with priority)
  primaryAction?: ActionButton
  secondaryAction?: ActionButton
  tertiaryAction?: ActionButton
  
  // Custom actions (for complex scenarios)
  customActions?: ReactNode
  
  // Layout options
  className?: string
  isLoading?: boolean
  
  // Responsive behavior
  stackOnMobile?: boolean
}
export function PageHeader({
  // Basic content
  title,
  description,
  
  // Navigation
  showBreadcrumbs = true,
  customBreadcrumbs,
  
  // Search
  showSearch = false,
  searchPlaceholder = "Find contacts, create campaigns, or discover actions",
  searchValue = "",
  onSearchChange,
  onSearchFocus,
  isActionCenterOpen = false,
  onActionCenterClose,
  
  // Filters
  showFilters = false,
  filters,
  
  
  // Actions
  primaryAction,
  secondaryAction,
  tertiaryAction,
  customActions,
  
  // Layout
  className = "",
  isLoading = false,
  stackOnMobile = true,
}: PageHeaderProps) {
  const location = useLocation()
  const pathname = location.pathname
  const isMobile = useIsMobile()
  
  // Component-level skeleton state for breadcrumbs
  const [showBreadcrumbSkeleton, setShowBreadcrumbSkeleton] = React.useState(true)
  
  React.useEffect(() => {
    // Show skeleton briefly on initial load and pathname changes
    setShowBreadcrumbSkeleton(true)
    const timer = setTimeout(() => {
      setShowBreadcrumbSkeleton(false)
    }, 400) // 400ms delay to show skeleton
    
    return () => clearTimeout(timer)
  }, [pathname])
  
  // Generate breadcrumbs based on pathname - memoized to prevent hydration issues
  const breadcrumbs = React.useMemo((): BreadcrumbItem[] => {
    if (customBreadcrumbs) return customBreadcrumbs
    
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    // For root path, show "Overview"
    if (pathname === "/") {
      breadcrumbs.push({
        label: "Overview",
        href: "/",
        isCurrent: true
      })
      return breadcrumbs
    }
    
    // Add segments
    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      
      // Special handling for contact pages
      if (segments[0] === "contacts" && segments.length === 2 && isLast) {
        // Check if it's a create page or contact detail page
        if (segment === "create") {
          breadcrumbs.push({
            label: "Create new contact",
            href: currentPath,
            isCurrent: isLast
          })
        } else {
          // This is a contact detail page, show "Contact Details"
          breadcrumbs.push({
            label: "Contact details",
            href: currentPath,
            isCurrent: isLast
          })
        }
      } else {
        // Capitalize segment for display
        const label = segment.charAt(0).toUpperCase() + segment.slice(1)
        
        breadcrumbs.push({
          label,
          href: currentPath,
          isCurrent: isLast
        })
      }
    })
    
    return breadcrumbs
  }, [pathname, customBreadcrumbs])
  
  // Render action button
  const renderActionButton = (action: ActionButton, key: string) => {
    const buttonContent = (
      <>
        {action.icon && <span className="mr-2">{action.icon}</span>}
        {action.label}
      </>
    )
    
    if (action.href) {
      return (
        <Button
          key={key}
          variant={action.variant || "default"}
          size={action.size || "default"}
          disabled={action.disabled}
          asChild
        >
          <Link to={action.href}>{buttonContent}</Link>
        </Button>
      )
    }
    
    return (
      <Button
        key={key}
        variant={action.variant || "default"}
        size={action.size || "default"}
        onClick={action.onClick}
        disabled={action.disabled}
      >
        {buttonContent}
      </Button>
    )
  }
  // Loading state
  if (isLoading) {
    return (
      <motion.div 
        className={`flex flex-col gap-3 px-3 py-2 md:flex-row md:items-end md:justify-between ${className}`}
        variants={skeletonStaggerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Left side - Title and Description */}
        <motion.div 
          className="space-y-1"
          variants={skeletonItemVariants}
        >
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </motion.div>
        
        {/* Right side - Search, Filters, and Actions */}
        <motion.div 
          className="flex items-center gap-2"
          variants={skeletonItemVariants}
        >
          {showSearch && <Skeleton className="h-9 w-48" />}
          {showFilters && <Skeleton className="h-9 w-32" />}
          {(primaryAction || secondaryAction || tertiaryAction) && (
            <>
              {Array.from({ length: [primaryAction, secondaryAction, tertiaryAction].filter(Boolean).length }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-24" />
              ))}
            </>
          )}
        </motion.div>
      </motion.div>
    )
  }
  
  // If no title/description, render breadcrumb-only header
  if (!title && !description) {
    // Loading state for breadcrumb-only header
    if (isLoading) {
      return (
        <motion.header 
          className="flex h-(--header-height) shrink-0 items-center border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) relative max-w-full overflow-x-hidden rounded-t-xl overflow-hidden"
          variants={skeletonStaggerVariants}
          initial="initial"
          animate="animate"
        >
          <div className="flex w-full items-center px-4 lg:px-6 py-3 min-w-0">
            {/* Left side - Sidebar trigger and breadcrumbs skeleton */}
            <motion.div 
              className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
              variants={skeletonItemVariants}
            >
              <Skeleton className="h-8 w-8 rounded-md" />
              <div className="h-4 w-px bg-border" />
              
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-16 rounded-sm" />
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-sm" />
              </div>
            </motion.div>
            {/* Center - Search Bar skeleton (Hidden on mobile, absolute positioning for perfect centering on desktop) */}
            {!isMobile && (
              <motion.div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-3 pointer-events-none"
                variants={skeletonItemVariants}
              >
                <div className="relative w-full pointer-events-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              </motion.div>
            )}
            
            {/* Right side - Mobile Search Icon & Notification Bell skeleton */}
            <motion.div 
              className="flex items-center gap-2 flex-shrink-0 ml-auto"
              variants={skeletonItemVariants}
            >
              {/* Mobile Search Icon Skeleton */}
              {isMobile && showSearch && (
                <Skeleton className="h-8 w-8 rounded-md" />
              )}
              {/* Notification Bell Skeleton */}
              <Skeleton className="h-8 w-8 rounded-full" />
            </motion.div>
          </div>
        </motion.header>
      )
    }
    return (
      <>
        <header className="flex h-(--header-height) shrink-0 items-center border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) relative max-w-full overflow-x-hidden rounded-t-xl overflow-hidden">
          <div className="flex w-full items-center px-4 lg:px-6 py-4 min-w-0">
            {/* Left side - Sidebar trigger and breadcrumbs */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="-ml-1" />
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p>Toggle sidebar</p>
                </TooltipContent>
              </Tooltip>
              <Separator
                orientation="vertical"
                className="h-4"
              />
              
              {showBreadcrumbs && (
                showBreadcrumbSkeleton ? (
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-16 rounded-sm" />
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-sm" />
                  </div>
                ) : (
                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map((breadcrumb, index) => (
                        <div key={breadcrumb.href} className="flex items-center">
                          <BreadcrumbItem>
                            {breadcrumb.isCurrent ? (
                              <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link to={breadcrumb.href}>{breadcrumb.label}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                        </div>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                )
              )}
            </div>
            {/* Center - Search Bar (Hidden on mobile, absolute positioning for perfect centering on desktop) */}
            {!isMobile && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-4 lg:px-6 pointer-events-none">
                {showSearch ? (
                  <div className="w-full pointer-events-auto">
                    <Field>
                      <FieldContent>
                        <InputGroup className="bg-muted/50 border-muted-foreground/20 focus-visible:bg-background focus-visible:border-ring transition-all duration-200 w-full cursor-pointer">
                          <InputGroupAddon>
                            <Search className="h-4 w-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            onFocus={onSearchFocus}
                            className="pr-20 h-8 text-sm cursor-pointer"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <KbdGroup className="opacity-60">
                              <Kbd className="text-xs h-5">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
                              <Kbd className="text-xs h-5">K</Kbd>
                            </KbdGroup>
                          </div>
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  </div>
                ) : (
                  <div className="w-full pointer-events-auto">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Search className="h-4 w-4" />
                      </div>
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Right side - Mobile Search Icon & Notification Bell */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              {/* Mobile Search Icon */}
              {isMobile && showSearch && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={onSearchFocus}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    <p>Search</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {/* Notification Bell */}
              <NotificationBell isLoading={isLoading} />
            </div>
          </div>
        </header>
        
        {/* Action Center Dialog */}
        {showSearch && (
          <ActionCenter
            isOpen={isActionCenterOpen || false}
            onClose={onActionCenterClose || (() => {})}
            searchValue={searchValue}
            onSearchChange={onSearchChange || (() => {})}
          />
        )}
      </>
    )
  }
  
  // Main content header
  return (
    <div className={`flex flex-col gap-4 px-4 lg:px-6 py-6 md:flex-row md:items-end md:justify-between max-w-full ${className}`}>
      {/* Left side - Title and Description */}
      <div className="space-y-1">
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      
      {/* Right side - Search, Filters, and Actions */}
      {(showSearch || showFilters || customActions || primaryAction || secondaryAction || tertiaryAction) && (
        <div className={`flex items-center gap-2 min-w-0 ${stackOnMobile ? 'flex-col items-start w-full md:flex-row md:items-center md:w-auto' : 'flex-row'}`}>
          {/* Search Bar */}
          {showSearch && (
            <div className="relative w-full md:w-64 max-w-md">
              <Field>
                <FieldContent>
                  <InputGroup className="cursor-pointer">
                    <InputGroupAddon>
                      <Search className="h-4 w-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchValue}
                      onChange={(e) => onSearchChange?.(e.target.value)}
                      className="pr-20"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <KbdGroup className="opacity-60">
                        <Kbd className="text-xs h-5">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
                        <Kbd className="text-xs h-5">K</Kbd>
                      </KbdGroup>
                    </div>
                  </InputGroup>
                </FieldContent>
              </Field>
            </div>
          )}
          
          {/* Filters */}
          {showFilters && filters && (
            <div className="flex items-center gap-2">
              {filters}
            </div>
          )}
          
          {/* Custom Actions */}
          {customActions && (
            <div className="flex items-center gap-2">
              {customActions}
            </div>
          )}
          
          {/* Standard Actions */}
          {(primaryAction || secondaryAction || tertiaryAction) && (
            <div className="flex items-center gap-2">
              {primaryAction && renderActionButton(primaryAction, "primary")}
              {secondaryAction && renderActionButton(secondaryAction, "secondary")}
              {tertiaryAction && renderActionButton(tertiaryAction, "tertiary")}
            </div>
          )}
        </div>
      )}
      
    </div>
  )
}
// Legacy component for backward compatibility
export function PageHeaderWithFilters({ 
  title, 
  description, 
  filters, 
  className = "",
  isLoading = false
}: {
  title: string
  description: string
  filters: ReactNode
  className?: string
  isLoading?: boolean
}) {
  return (
    <PageHeader
      title={title}
      description={description}
      showFilters={true}
      filters={filters}
      className={className}
      isLoading={isLoading}
    />
  )
}
export function PageHeaderWithActions({ 
  title, 
  description, 
  actions, 
  className = "",
  isLoading = false
}: {
  title: string
  description: string
  actions: ReactNode
  className?: string
  isLoading?: boolean
}) {
  return (
    <PageHeader
      title={title}
      description={description}
      customActions={actions}
      className={className}
      isLoading={isLoading}
    />
  )
}
// Profile Header Variant - with back button and avatar
interface PageHeaderProfileProps {
  title: string
  description?: string
  avatar?: {
    src?: string
    fallback: string
    alt?: string
  }
  onBack: () => void
  actions?: ReactNode
  className?: string
  isLoading?: boolean
}
export function PageHeaderProfile({
  title,
  description,
  avatar,
  onBack,
  actions,
  className = "",
  isLoading = false
}: PageHeaderProfileProps) {
  if (isLoading) {
    return (
      <motion.div 
        className={`flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between ${className}`}
        variants={skeletonStaggerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Left side - Back button, Avatar, Title and Description */}
        <motion.div 
          className="flex items-center gap-4"
          variants={skeletonItemVariants}
        >
          {/* Back button skeleton */}
          <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
          
          {/* Avatar skeleton */}
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          
          {/* Title and description skeleton */}
          <div className="space-y-2 min-w-0 flex-1">
            <Skeleton className="h-6 w-48 max-w-full" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
        </motion.div>
        
        {/* Right side - Actions skeleton */}
        {actions && (
          <motion.div 
            className="flex items-center gap-2 flex-shrink-0"
            variants={skeletonItemVariants}
          >
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-8" />
          </motion.div>
        )}
      </motion.div>
    )
  }
  return (
    <div className={`flex flex-col gap-4 px-6 py-6 md:flex-row md:items-end md:justify-between ${className}`}>
      {/* Left side - Back button, Avatar, Title and Description */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 w-8 p-0 flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        {avatar && (
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={avatar.src} alt={avatar.alt} />
            <AvatarFallback className="text-lg">
              {avatar.fallback}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="space-y-1 min-w-0">
          <h1 className="text-xl font-semibold tracking-wide truncate">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground truncate">{description}</p>
          )}
        </div>
      </div>
      
      {/* Right side - Actions */}
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

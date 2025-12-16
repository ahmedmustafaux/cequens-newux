import * as React from "react"
import { type DateRange } from "react-day-picker"
import { SectionCards } from "@/components/section-cards"
import { DashboardChart } from "@/components/dashboard-chart"
import { DashboardPieChart } from "@/components/dashboard-pie-chart"
import { TableSkeleton } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { TimeFilter } from "@/components/time-filter"
import { useTimeRangeTitle } from "@/hooks/use-dynamic-title"
import { useAuth } from "@/hooks/use-auth"
import { GettingStartedGuideFloating, Persona } from "@/components/getting-started-guide-floating"
import { useOnboarding } from "@/contexts/onboarding-context"
import { FeaturedContentCard } from "@/components/featured-content-card"
import { RecommendedTemplates } from "@/components/recommended-templates"

export default function DashboardPage() {
  const { user } = useAuth()
  const { onboardingData } = useOnboarding()
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    const today = new Date();
    return {
      from: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    };
  })
  const [isDataLoading, setIsDataLoading] = React.useState(true)
  
  // Check if user is a new user (just signed up)
  const isNewUser = user?.userType === "newUser"

  // Persona state with localStorage persistence (same as GettingStartedPage)
  const STORAGE_KEY_PERSONA = 'cequens-setup-guide-persona'
  const [persona, setPersona] = React.useState<Persona>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PERSONA)
      return (saved === "business" || saved === "api") ? saved : "business"
    } catch {
      return "business"
    }
  })

  // Sync persona from localStorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PERSONA)
        if (saved === "business" || saved === "api") {
          setPersona(saved)
        }
      } catch {
        // Ignore errors
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also check on interval to catch local changes
    const interval = setInterval(handleStorageChange, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  // Convert DateRange to timeRange string for components
  const getTimeRangeFromDateRange = (range: DateRange | undefined): string => {
    if (!range || !range.from || !range.to) return "30d"
    
    const diffTime = Math.abs(range.to.getTime() - range.from.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 7) return "7d"
    if (diffDays <= 30) return "30d"
    return "90d"
  }
  
  const timeRange = getTimeRangeFromDateRange(dateRange)
  
  // Dynamic title based on date range
  useTimeRangeTitle(timeRange)

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true)
    const timer = setTimeout(() => {
      setIsDataLoading(false)
    }, 400) // Simulate 400ms loading time for server data

    return () => clearTimeout(timer)
  }, [])

  // Simulate data loading when date range changes
  React.useEffect(() => {
    if (dateRange) {
      setIsDataLoading(true)
      const timer = setTimeout(() => {
        setIsDataLoading(false)
      }, 250) // Simulate 250ms loading time for date range change

      return () => clearTimeout(timer)
    }
  }, [dateRange])


  return (
    <>
      <PageWrapper isLoading={isDataLoading}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2/3: Header, Statistics Cards and Recommended Templates */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <PageHeader
              title="Home"
              description="Monitor your communication platform performance"
              showBreadcrumbs={false}
              showFilters={true}
              filters={<TimeFilter value={dateRange} onValueChange={(value) => {
                if (value && typeof value === 'object') {
                  setDateRange(value as DateRange)
                }
              }} isLoading={isDataLoading} mode="advanced" />}
              isLoading={isDataLoading}
            />

            {/* Statistics Cards */}
            {isDataLoading ? (
              <TableSkeleton rows={4} columns={4} />
            ) : (
              <SectionCards timeRange={timeRange} isLoading={isDataLoading} isEmpty={isNewUser} />
            )}

            {/* Recommended Templates */}
            <RecommendedTemplates />
          </div>

          {/* Right 1/3: Case Studies (Featured Content) */}
          <div className="lg:col-span-1">
            <FeaturedContentCard showDismiss={false} />
          </div>
        </div>
      </PageWrapper>

      {/* Floating Guide Steps Card - Outside PageWrapper to avoid parent animations */}
      <GettingStartedGuideFloating
        industry={onboardingData?.industry || "ecommerce"}
        channels={onboardingData?.channels || []}
        goals={onboardingData?.goals || []}
        persona={persona}
      />
    </>
  )
}
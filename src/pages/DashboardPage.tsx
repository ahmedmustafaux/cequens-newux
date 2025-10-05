import * as React from "react"
import { type DateRange } from "react-day-picker"
import { SectionCards } from "@/components/section-cards"
import { DashboardChart } from "@/components/dashboard-chart"
import { DashboardPieChart } from "@/components/dashboard-pie-chart"
import { TableSkeleton } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import { TimeFilter } from "@/components/time-filter"
import { useTimeRangeTitle } from "@/hooks/use-dynamic-title"

export default function DashboardPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    const today = new Date();
    return {
      from: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      to: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    };
  })
  const [isDataLoading, setIsDataLoading] = React.useState(true)

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
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <PageHeader
          title="Overview"
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

        <div className="flex flex-col gap-4 pb-4">
          {isDataLoading ? (
            <>
              <TableSkeleton rows={4} columns={4} />
              <TableSkeleton rows={1} columns={1} className="h-[400px]" />
            </>
          ) : (
            <>
              <SectionCards timeRange={timeRange} isLoading={isDataLoading} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-6">
                <DashboardChart timeRange={timeRange} isLoading={isDataLoading} className="lg:col-span-2" />
                <DashboardPieChart timeRange={timeRange} isLoading={isDataLoading} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

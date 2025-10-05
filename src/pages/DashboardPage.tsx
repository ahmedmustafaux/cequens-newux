import * as React from "react"
import { type DateRange } from "react-day-picker"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
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

  // Dynamic title based on date range
  useTimeRangeTitle("30d") // Keep using the hook for now

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
            <TableSkeleton rows={4} columns={4} />
          ) : (
            <SectionCards timeRange="30d" isLoading={isDataLoading} />
          )}
          
          {isDataLoading ? (
            <TableSkeleton rows={4} columns={4} />
          ) : (
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive timeRange="30d" isLoading={isDataLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

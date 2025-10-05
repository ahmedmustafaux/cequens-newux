import { Empty } from "@/components/ui/empty";
import { Construction } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { TimeFilter } from "@/components/time-filter";
import { TableSkeleton } from "@/components/ui/table";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import * as React from "react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [isDataLoading, setIsDataLoading] = React.useState(true);

  // Dynamic page title
  usePageTitle("Analytics");

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 400); // Standard 400ms loading time for server data

    return () => clearTimeout(timer);
  }, []);

  // Simulate data loading when time range changes
  React.useEffect(() => {
    if (timeRange) {
      setIsDataLoading(true);
      const timer = setTimeout(() => {
        setIsDataLoading(false);
      }, 300); // Standard 300ms loading time for time range change

      return () => clearTimeout(timer);
    }
  }, [timeRange]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <PageHeader
          title="Analytics"
          description="Analyze your communication platform performance"
          showBreadcrumbs={false}
          showFilters={true}
          filters={<TimeFilter value={timeRange} onValueChange={(value) => {
            if (typeof value === 'string') {
              setTimeRange(value)
            }
          }} isLoading={isDataLoading} mode="simple" />}
          isLoading={isDataLoading}
        />

        <div className="flex flex-col gap-4 pb-4">
          {isDataLoading ? (
            <>
              <TableSkeleton rows={4} columns={4} />
              <TableSkeleton rows={4} columns={4} />
            </>
          ) : (
            <div className="px-4 md:px-6">
              <Empty
                title="Coming Soon"
                description="We are working on this feature. Check back shortly for updates."
                icon={<Construction className="h-8 w-8" />}
                isLoading={isDataLoading}
                variant="default"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

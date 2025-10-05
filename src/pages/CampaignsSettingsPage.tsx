import ComingSoon from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import * as React from "react";

export default function CampaignsSettingsPage() {
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  
  // Dynamic page title
  usePageTitle("Campaign Settings");

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 400); // Standard 400ms loading time for server data

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <PageHeader
          title="Campaign Settings"
          description="Configure campaign preferences and defaults"
          showBreadcrumbs={false}
          isLoading={isDataLoading}
        />
        <ComingSoon isLoading={isDataLoading} />
      </div>
    </div>
  );
}

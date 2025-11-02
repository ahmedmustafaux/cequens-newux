import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { PageWrapper } from "@/components/page-wrapper";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import * as React from "react";

export default function SettingsPreferencesPage() {
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  
  // Dynamic page title
  usePageTitle("System Preferences");

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 400); // Standard 400ms loading time for server data

    return () => clearTimeout(timer);
  }, []);

  return (
    <PageWrapper isLoading={isDataLoading}>
      <PageHeader
        title="System Preferences"
        description="Configure system-wide settings and preferences"
        showBreadcrumbs={true}
        customBreadcrumbs={[
          { label: "Settings", href: "/settings", isCurrent: false },
          { label: "System Preferences", href: "/settings/preferences", isCurrent: true },
        ]}
        isLoading={isDataLoading}
      />
      <ComingSoon />
    </PageWrapper>
  );
}
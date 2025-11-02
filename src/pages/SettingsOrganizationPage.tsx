import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { PageWrapper } from "@/components/page-wrapper";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import * as React from "react";

export default function SettingsOrganizationPage() {
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  
  // Dynamic page title
  usePageTitle("Organization & Team Management");

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
        title="Organization & Team Management"
        description="Manage your organization structure and team members"
        showBreadcrumbs={true}
        customBreadcrumbs={[
          { label: "Settings", href: "/settings", isCurrent: false },
          { label: "Organization & Team", href: "/settings/organization", isCurrent: true },
        ]}
        isLoading={isDataLoading}
      />
      <ComingSoon />
    </PageWrapper>
  );
}
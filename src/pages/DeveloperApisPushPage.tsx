import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { PageWrapper } from "@/components/page-wrapper";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import * as React from "react";

export default function DeveloperApisPushPage() {
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  
  // Dynamic page title
  usePageTitle("Push Notification API");

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
        title="Push Notification API"
        description="Send push notifications to mobile and web applications"
        showBreadcrumbs={true}
        customBreadcrumbs={[
          { label: "Developer APIs", href: "/developer-apis", isCurrent: false },
          { label: "Push Notification API", href: "/developer-apis/push", isCurrent: true },
        ]}
        isLoading={isDataLoading}
      />
      <ComingSoon />
    </PageWrapper>
  );
}
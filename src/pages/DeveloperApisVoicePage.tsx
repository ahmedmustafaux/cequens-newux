import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { PageWrapper } from "@/components/page-wrapper";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import * as React from "react";

export default function DeveloperApisVoicePage() {
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  
  // Dynamic page title
  usePageTitle("Voice API");

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
        title="Voice API"
        description="Integrate voice calling capabilities into your applications"
        showBreadcrumbs={true}
        customBreadcrumbs={[
          { label: "Developer APIs", href: "/developer-apis", isCurrent: false },
          { label: "Voice API", href: "/developer-apis/voice", isCurrent: true },
        ]}
        isLoading={isDataLoading}
      />
      <ComingSoon />
    </PageWrapper>
  );
}
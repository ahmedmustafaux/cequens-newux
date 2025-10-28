import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function AutomationPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Automation Hub"
        description="Manage your automation workflows"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
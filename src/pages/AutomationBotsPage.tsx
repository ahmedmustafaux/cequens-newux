import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function AutomationBotsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Automation / CEQ Bots"
        description="Manage your automation bots"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
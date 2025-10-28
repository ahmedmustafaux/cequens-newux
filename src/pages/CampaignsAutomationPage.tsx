import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function CampaignsAutomationPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Campaign Automation"
        description="Automate your campaign workflows"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
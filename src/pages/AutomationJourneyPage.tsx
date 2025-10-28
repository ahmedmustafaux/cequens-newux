import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function AutomationJourneyPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Journey Builder"
        description="Create and manage customer journeys"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
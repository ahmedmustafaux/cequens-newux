import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsApplePage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Apple Messages Channel"
        description="Manage your Apple Messages communications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
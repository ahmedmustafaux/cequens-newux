import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsRcsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="RCS Channel"
        description="Manage your RCS communications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
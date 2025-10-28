import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsSmsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="SMS Channel"
        description="Manage your SMS communications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
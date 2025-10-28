import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Channels"
        description="Manage your communication channels"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
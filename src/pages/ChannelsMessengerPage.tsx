import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsMessengerPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Messenger Channel"
        description="Manage your Messenger communications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
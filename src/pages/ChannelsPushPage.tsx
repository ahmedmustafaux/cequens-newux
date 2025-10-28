import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsPushPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Push Notifications Channel"
        description="Manage your Push Notifications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
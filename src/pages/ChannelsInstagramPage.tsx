import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsInstagramPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Instagram Channel"
        description="Manage your Instagram communications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
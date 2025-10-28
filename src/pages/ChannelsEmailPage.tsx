import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsEmailPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Email Channel"
        description="Manage your Email communications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
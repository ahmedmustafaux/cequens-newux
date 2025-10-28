import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsCallPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Call Channel"
        description="Manage your Call communications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
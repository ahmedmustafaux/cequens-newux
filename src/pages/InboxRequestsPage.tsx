import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function InboxRequestsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Inbox Requests"
        description="Manage your incoming requests"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
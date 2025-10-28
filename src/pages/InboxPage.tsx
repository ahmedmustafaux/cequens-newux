import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function InboxPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Inbox"
        description="Manage your messages and requests"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
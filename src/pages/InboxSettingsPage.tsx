import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function InboxSettingsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Inbox Settings"
        description="Configure your inbox preferences"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
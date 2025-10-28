import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function AutomationTemplatesPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Automation Templates"
        description="Manage your automation templates"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
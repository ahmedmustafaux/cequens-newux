import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ContactsSegmentsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Audience Segments"
        description="Manage your audience segments"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
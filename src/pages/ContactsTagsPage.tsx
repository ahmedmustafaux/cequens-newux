import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ContactsTagsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Tags & Attributes"
        description="Manage your contact tags and attributes"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { ComingSoon } from "@/components/coming-soon"

export default function ChannelsWhatsAppPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="WhatsApp Channel"
        description="Manage your WhatsApp communications"
      />
      <ComingSoon />
    </PageWrapper>
  )
}
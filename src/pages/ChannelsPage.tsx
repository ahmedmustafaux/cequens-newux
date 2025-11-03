import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { FileQuestion } from "lucide-react"

export default function ChannelsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Channels"
        description="Manage your communication channels"
      />
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion />
          </EmptyMedia>
          <EmptyTitle>Coming Soon</EmptyTitle>
          <EmptyDescription>
            This feature is currently under development and will be available soon.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageWrapper>
  )
}
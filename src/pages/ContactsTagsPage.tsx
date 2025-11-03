import { PageHeader } from "@/components/page-header"
import { PageWrapper } from "@/components/page-wrapper"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Tag, Plus } from "lucide-react"

export default function ContactsTagsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Tags & Attributes"
        description="Manage your audience tags and attributes"
      />
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Tag />
          </EmptyMedia>
          <EmptyTitle>No tags yet</EmptyTitle>
          <EmptyDescription>
            Create tags to organize and segment your audience. Tags help you
            categorize contacts and create targeted campaigns.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>
            <Plus />
            Create Tag
          </Button>
        </EmptyContent>
      </Empty>
    </PageWrapper>
  )
}
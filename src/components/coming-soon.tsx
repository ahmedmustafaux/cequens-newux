import * as React from "react"
import { IconTools } from "@tabler/icons-react"
import { Empty } from "@/components/ui/empty"

export function ComingSoon() {
  return (
    <Empty
      icon={<IconTools className="h-10 w-10 text-muted-foreground" />}
      title="Coming Soon"
      description="We are working on this feature. Check back shortly for updates."
    />
  )
}
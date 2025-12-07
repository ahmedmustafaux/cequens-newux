import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CardSkeleton } from "@/components/ui/card"
import { getDashboardMetrics } from "@/data/mock-data"

interface SectionCardsProps {
  timeRange: string
  isLoading?: boolean
  isEmpty?: boolean
}

export function SectionCards({ timeRange, isLoading = false, isEmpty = false }: SectionCardsProps) {
  const getTimePeriodText = (range: string) => {
    switch (range) {
      case "7d":
        return "7 days"
      case "30d":
        return "30 days"
      case "90d":
        return "3 months"
      default:
        return "30 days"
    }
  }

  /**
   * Get metrics data from mock data
   * This function is a wrapper around getDashboardMetrics to maintain the same interface
   * while delegating the actual data generation to the mock data module
   */
  const getMetricsData = () => {
    return getDashboardMetrics()
  }

  const timePeriodText = getTimePeriodText(timeRange)
  const metrics = getMetricsData()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    )
  }

  // Empty state values for new users
  const emptyMetrics = {
    messagesSent: { value: "0", change: "0%", trend: "up" as const },
    deliveryRate: { value: "0%", change: "0%", trend: "up" as const },
    activeSenders: { value: "0", change: "0%", trend: "up" as const },
    responseRate: { value: "0%", change: "0%", trend: "up" as const },
  }

  const displayMetrics = isEmpty ? emptyMetrics : metrics
  const cardClassName = isEmpty ? "@container/card opacity-50" : "@container/card"

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className={cardClassName}>
        <CardHeader>
          <CardDescription>Messages Sent</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {displayMetrics.messagesSent.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {displayMetrics.messagesSent.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {displayMetrics.messagesSent.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Across all channels ({timePeriodText})
          </div>
        </CardFooter>
      </Card>
      <Card className={cardClassName}>
        <CardHeader>
          <CardDescription>Delivery Rate</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {displayMetrics.deliveryRate.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {displayMetrics.deliveryRate.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {displayMetrics.deliveryRate.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Monitor carrier/ESP performance
          </div>
        </CardFooter>
      </Card>
      <Card className={cardClassName}>
        <CardHeader>
          <CardDescription>Active Senders</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {displayMetrics.activeSenders.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {displayMetrics.activeSenders.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {displayMetrics.activeSenders.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className={cardClassName}>
        <CardHeader>
          <CardDescription>Response Rate</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {displayMetrics.responseRate.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {displayMetrics.responseRate.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {displayMetrics.responseRate.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}

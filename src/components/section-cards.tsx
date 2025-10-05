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
}

export function SectionCards({ timeRange, isLoading = false }: SectionCardsProps) {
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
      <div className="grid grid-cols-1 gap-3 px-2 lg:px-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Messages Sent</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {metrics.messagesSent.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {metrics.messagesSent.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {metrics.messagesSent.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Volume {metrics.messagesSent.trend === "up" ? "up" : "down"} this period{" "}
            {metrics.messagesSent.trend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Across all channels ({timePeriodText})
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Delivery Rate</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {metrics.deliveryRate.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {metrics.deliveryRate.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {metrics.deliveryRate.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {metrics.deliveryRate.trend === "up" ? "Improving delivery" : "Slight dip this period"}{" "}
            {metrics.deliveryRate.trend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Monitor carrier/ESP performance
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Senders</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {metrics.activeSenders.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {metrics.activeSenders.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {metrics.activeSenders.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Teams actively sending{" "}
            {metrics.activeSenders.trend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Response Rate</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {metrics.responseRate.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {metrics.responseRate.trend === "up" ? <IconTrendingUp /> : <IconTrendingDown />}
              {metrics.responseRate.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Improving replies{" "}
            {metrics.responseRate.trend === "up" ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}

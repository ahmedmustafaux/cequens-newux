import * as React from "react"
import { motion } from "framer-motion"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardSkeleton } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { loadingVariants, smoothTransition } from "@/lib/transitions"
import { getDashboardChartData } from "@/data/mock-data"

interface DashboardChartProps {
  timeRange: string
  isLoading?: boolean
  className?: string
}

export function DashboardChart({ timeRange, isLoading = false, className }: DashboardChartProps) {
  const [activeMetric, setActiveMetric] = React.useState<"messages" | "senders">("messages")
  
  // Get chart data from mock data
  const data = getDashboardChartData(timeRange)

  if (isLoading) {
    return <CardSkeleton className="h-[400px]" />
  }

  // Calculate totals for the summary
  const messagesTotal = data.reduce((sum, item) => sum + item.messages, 0)
  const sendersTotal = data.reduce((sum, item) => sum + item.senders, 0)

  const totals = {
    messages: messagesTotal,
    senders: sendersTotal
  }

  return (
    <motion.div
      variants={loadingVariants}
      animate={isLoading ? "loading" : "animate"}
      transition={smoothTransition}
      className={`${className || ""}`}
    >
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-4 pt-4 pb-3 sm:!py-6">
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Showing total messages and active senders
            </CardDescription>
          </div>
          <div className="flex">
            {["messages", "senders"].map((key) => {
              const metric = key as keyof typeof totals
              return (
                <button
                  key={metric}
                  data-active={activeMetric === metric}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-4 sm:py-6 min-w-[160px] cursor-pointer hover:bg-muted/50 transition"
                  onClick={() => setActiveMetric(metric)}
                >
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {metric === "messages" ? "Messages Sent" : "Active Senders"}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-xl">
                    {totals[metric].toLocaleString()}
                  </span>
                </button>
              )
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="h-[250px] w-full">
            <ChartContainer 
              config={{
                messages: {
                  label: "Messages Sent",
                  color: "hsl(var(--primary))"
                },
                senders: {
                  label: "Active Senders",
                  color: "hsl(var(--primary))"
                }
              }}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={data}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey="period" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={timeRange === "7d" ? 0 : timeRange === "30d" ? 4 : 9} // Adjust interval based on time range
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        // Find the corresponding data point to get the full date
                        const dataPoint = data.find(d => d.period === value)
                        if (dataPoint) {
                          const date = new Date(dataPoint.date)
                          return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        }
                        return value
                      }}
                    />
                  }
                />
                <Bar 
                  dataKey={activeMetric} 
                  fill="#1d4ed8" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// Chart components removed - using recharts directly
import { getChartData } from "@/data/mock-data"
import { CardSkeleton } from "@/components/ui/card"

export const description = "Messages volume by channel"

// Chart data function removed - now imported from @/data/mock-data

// Custom tooltip component using ShadCN styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background text-foreground border rounded-md px-3 py-1.5 text-xs shadow-md z-50 w-fit">
        <p className="font-medium mb-2">
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-muted-foreground capitalize">
                  {entry.dataKey}
                </span>
              </div>
              <span className="font-medium">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

const chartConfig = {
  views: {
    label: "Messages",
  },
  whatsapp: {
    label: "WhatsApp",
    color: "var(--chart-1)",
  },
  sms: {
    label: "SMS",
    color: "var(--chart-2)",
  },
}

interface ChartAreaInteractiveProps {
  timeRange: string
  isLoading?: boolean
}

export function ChartAreaInteractive({ timeRange, isLoading = false }: ChartAreaInteractiveProps) {
  const chartData = React.useMemo(() => getChartData(timeRange), [timeRange])

  const total = React.useMemo(
    () => ({
      whatsapp: chartData.reduce((acc, curr) => acc + curr.whatsapp, 0),
      sms: chartData.reduce((acc, curr) => acc + curr.sms, 0),
    }),
    [chartData]
  )

  if (isLoading) {
    return <CardSkeleton />
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Message Volume</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Total messages for the selected time period
            </span>
            <span className="@[540px]/card:hidden">Message volume</span>
          </CardDescription>
        </div>
        <div className="flex">
          {["whatsapp", "sms"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <div
                key={chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-sm font-semibold leading-none sm:text-base">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
            <CartesianGrid 
              vertical={false} 
              stroke="#f3f4f6" 
              strokeOpacity={1}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              dataKey="whatsapp"
              type="monotone"
              stroke="#25D366"
              strokeWidth={2}
              strokeOpacity={0.8}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#25D366",
                stroke: "#ffffff",
                strokeWidth: 2,
                style: {
                  filter: "drop-shadow(0 2px 4px rgba(37, 211, 102, 0.3))",
                  transition: "all 0.2s ease-in-out"
                }
              }}
              animationDuration={800}
              animationEasing="ease-out"
              isAnimationActive={true}
            />
            <Line
              dataKey="sms"
              type="monotone"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeOpacity={0.8}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                stroke: "#ffffff",
                strokeWidth: 2,
                style: {
                  filter: "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))",
                  transition: "all 0.2s ease-in-out"
                }
              }}
              animationDuration={800}
              animationEasing="ease-out"
              isAnimationActive={true}
            />
          </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

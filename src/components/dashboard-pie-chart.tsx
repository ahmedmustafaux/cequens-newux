import * as React from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CardSkeleton } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { loadingVariants, smoothTransition } from "@/lib/transitions"
import { getChartData } from "@/data/mock-data"

interface DashboardPieChartProps {
  timeRange: string
  isLoading?: boolean
}

export function DashboardPieChart({ timeRange, isLoading = false }: DashboardPieChartProps) {
  // Get chart data from mock data
  const chartData = getChartData(timeRange)
  
  if (isLoading) {
    return <CardSkeleton className="h-[250px]" />
  }

  // Calculate totals for WhatsApp and SMS
  const whatsappTotal = chartData.reduce((sum, item) => sum + item.whatsapp, 0)
  const smsTotal = chartData.reduce((sum, item) => sum + item.sms, 0)

  // Prepare data for pie chart - using only blue colors
  const pieData = [
    { name: 'WhatsApp', value: whatsappTotal, color: '#1d4ed8' }, // Darker blue
    { name: 'SMS', value: smsTotal, color: '#93c5fd' }, // Lighter blue
  ]

  return (
    <motion.div
      variants={loadingVariants}
      animate={isLoading ? "loading" : "animate"}
      transition={smoothTransition}
    >
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-4 pt-4 pb-3 sm:!py-6">
            <CardTitle>Message Distribution</CardTitle>
            <CardDescription>
              WhatsApp vs SMS message distribution
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="h-[250px] w-full">
            <ChartContainer 
              config={{
                whatsapp: {
                  label: "WhatsApp",
                  color: "#1d4ed8"
                },
                sms: {
                  label: "SMS",
                  color: "#93c5fd"
                }
              }}
              className="aspect-auto h-[250px] w-full"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="name"
                    />
                  }
                />
                <Legend />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
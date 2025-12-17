import * as React from "react"
import { Megaphone, Inbox, Bot, GitBranch } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const products: Product[] = [
  {
    id: "campaigns",
    name: "Campaigns",
    description: "Automated campaigns",
    icon: Megaphone,
  },
  {
    id: "inbox",
    name: "Inbox",
    description: "Automated inbox",
    icon: Inbox,
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    description: "Automated agents",
    icon: Bot,
  },
  {
    id: "flow-builder",
    name: "Flow Builder",
    description: "Automated flows",
    icon: GitBranch,
  },
]

export function ProductList({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-xl font-semibold mb-4">Start from scratch</h2>
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => {
          const IconComponent = product.icon
          return (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 flex items-center gap-3">
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-md bg-orange-500 border border-orange-600 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-6 h-6 text-white" strokeWidth={2.5} fill="currentColor" />
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col min-w-0">
                  <h3 className="text-base font-bold font-serif text-foreground leading-tight mb-0.5">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-tight">
                    {product.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

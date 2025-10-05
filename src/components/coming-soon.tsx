import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardSkeleton } from "@/components/ui/card"
import { Construction } from "lucide-react"

interface ComingSoonProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  isLoading?: boolean
}

export default function ComingSoon({ 
  title = "Coming Soon",
  description = "We are working on this feature. Check back shortly for updates.",
  icon = <Construction className="h-8 w-8 text-black" />,
  isLoading = false
}: ComingSoonProps) {
  if (isLoading) {
    return (
      <div className="px-4 md:px-6">
        <CardSkeleton />
      </div>
    )
  }
  return (
    <div className="px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">This section is under construction.</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Coming soon
        </Badge>
      </div>
      
      <Card>
        <CardHeader className="gap-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-full p-6">
              {icon}
            </div>
          </div>
          
          <div className="text-center">
            <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1 w-60 mx-auto">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

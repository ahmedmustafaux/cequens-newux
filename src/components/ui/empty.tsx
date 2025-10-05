import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { CardSkeleton } from "./card"

const emptyVariants = cva(
  "flex min-h-[400px] flex-col items-center justify-center rounded-md border p-8 text-center",
  {
    variants: {
      variant: {
        default: "border-dashed",
        card: "border-none bg-card text-card-foreground shadow-sm",
      },
      size: {
        default: "px-4 py-10",
        sm: "px-3 py-8",
        lg: "px-6 py-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EmptyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {
  icon?: React.ReactNode
  title: string
  description?: string
  isLoading?: boolean
}

function Empty({
  className,
  variant,
  size,
  icon,
  title,
  description,
  isLoading = false,
  ...props
}: EmptyProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div
      className={cn(emptyVariants({ variant, size }), className)}
      {...props}
    >
      {icon && (
        <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          {description}
        </p>
      )}
      {props.children && <div className="mt-6">{props.children}</div>}
    </div>
  )
}

export { Empty, emptyVariants }
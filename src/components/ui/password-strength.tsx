import * as React from "react"
import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: "", color: "" }
    
    let score = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    }
    
    score = Object.values(checks).filter(Boolean).length
    
    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" }
    if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500" }
    if (score <= 4) return { score, label: "Good", color: "bg-blue-500" }
    return { score, label: "Strong", color: "bg-green-500" }
  }
  
  const strength = getPasswordStrength(password)
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">Password strength:</span>
        <span className={cn(
          "font-medium",
          strength.score <= 2 ? "text-red-600" : 
          strength.score <= 3 ? "text-yellow-600" : 
          strength.score <= 4 ? "text-blue-600" : "text-green-600"
        )}>
          {strength.label}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              level <= strength.score ? strength.color : "bg-slate-200"
            )}
          />
        ))}
      </div>
      
      <div className="text-xs text-slate-500 space-y-1">
        <div className="flex items-center gap-1">
          <div className={cn("w-1 h-1 rounded-full", password.length >= 8 ? "bg-green-500" : "bg-slate-300")} />
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("w-1 h-1 rounded-full", /[a-z]/.test(password) ? "bg-green-500" : "bg-slate-300")} />
          <span>One lowercase letter</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("w-1 h-1 rounded-full", /[A-Z]/.test(password) ? "bg-green-500" : "bg-slate-300")} />
          <span>One uppercase letter</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("w-1 h-1 rounded-full", /\d/.test(password) ? "bg-green-500" : "bg-slate-300")} />
          <span>One number</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("w-1 h-1 rounded-full", /[@$!%*?&]/.test(password) ? "bg-green-500" : "bg-slate-300")} />
          <span>One special character (@$!%*?&)</span>
        </div>
      </div>
    </div>
  )
}

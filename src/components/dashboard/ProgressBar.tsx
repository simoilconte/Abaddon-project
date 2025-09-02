'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  label: string
  description?: string
  colorScheme?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  animated?: boolean
}

const colorSchemes = {
  blue: {
    bg: 'bg-blue-100',
    fill: 'bg-gradient-to-r from-blue-500 to-blue-600',
    text: 'text-blue-700',
    glow: 'shadow-blue-200'
  },
  green: {
    bg: 'bg-green-100',
    fill: 'bg-gradient-to-r from-green-500 to-green-600',
    text: 'text-green-700',
    glow: 'shadow-green-200'
  },
  yellow: {
    bg: 'bg-yellow-100',
    fill: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    text: 'text-yellow-700',
    glow: 'shadow-yellow-200'
  },
  red: {
    bg: 'bg-red-100',
    fill: 'bg-gradient-to-r from-red-500 to-red-600',
    text: 'text-red-700',
    glow: 'shadow-red-200'
  },
  purple: {
    bg: 'bg-purple-100',
    fill: 'bg-gradient-to-r from-purple-500 to-purple-600',
    text: 'text-purple-700',
    glow: 'shadow-purple-200'
  }
}

const sizes = {
  sm: { height: 'h-2', text: 'text-sm' },
  md: { height: 'h-3', text: 'text-base' },
  lg: { height: 'h-4', text: 'text-lg' }
}

export function ProgressBar({
  value,
  max,
  label,
  description,
  colorScheme = 'blue',
  size = 'md',
  showPercentage = true,
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)
  const colors = colorSchemes[colorScheme]
  const sizeConfig = sizes[size]
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className={cn("font-semibold", colors.text, sizeConfig.text)}>
            {label}
          </div>
          {description && (
            <div className="text-sm text-gray-600">{description}</div>
          )}
        </div>
        {showPercentage && (
          <div className={cn("font-bold", colors.text, sizeConfig.text)}>
            {value}/{max} ({percentage}%)
          </div>
        )}
      </div>
      
      {/* Progress Bar Container */}
      <div className={cn(
        "w-full rounded-full overflow-hidden",
        colors.bg,
        sizeConfig.height
      )}>
        {/* Progress Fill */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colors.fill,
            animated && "animate-pulse-subtle",
            percentage >= 100 && "shadow-lg",
            percentage >= 100 && colors.glow
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer Effect */}
          {animated && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
      
      {/* Achievement Badge */}
      {percentage >= 100 && (
        <div className="mt-2 text-center">
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            colors.fill,
            "text-white shadow-lg animate-bounce"
          )}>
            🎉 Obiettivo Raggiunto!
          </span>
        </div>
      )}
    </div>
  )
}


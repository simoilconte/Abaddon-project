'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from './ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  description?: string
  icon: LucideIcon
  current: number
  target: number
  unit?: string
  colorScheme?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  achievements?: string[]
  priority?: 'low' | 'medium' | 'high'
}

const priorityStyles = {
  low: 'border-green-200 bg-green-50',
  medium: 'border-yellow-200 bg-yellow-50', 
  high: 'border-red-200 bg-red-50'
}

export function KPICard({
  title,
  description,
  icon: Icon,
  current,
  target,
  unit = '',
  colorScheme = 'blue',
  trend,
  achievements = [],
  priority = 'medium'
}: KPICardProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100)
  const isCompleted = percentage >= 100
  
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      priorityStyles[priority],
      isCompleted && "ring-2 ring-green-400 ring-opacity-50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              colorScheme === 'blue' && "bg-blue-100 text-blue-600",
              colorScheme === 'green' && "bg-green-100 text-green-600",
              colorScheme === 'yellow' && "bg-yellow-100 text-yellow-600",
              colorScheme === 'red' && "bg-red-100 text-red-600",
              colorScheme === 'purple' && "bg-purple-100 text-purple-600"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          {/* Priority Badge */}
          <Badge 
            variant={
              priority === 'high' ? 'danger' : 
              priority === 'medium' ? 'warning' : 'success'
            }
            size="sm"
          >
            {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Bassa'} Priorità
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Progress */}
        <ProgressBar
          value={current}
          max={target}
          label={`Progresso ${unit ? `(${unit})` : ''}`}
          colorScheme={colorScheme}
          animated={true}
        />
        
        {/* Stats essenziali */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{current} / {target} {unit}</span>
          {trend && (
            <span className={cn(
              "font-medium flex items-center",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        
        {/* Achievements semplificati */}
        {achievements.length > 0 && (
          <div className="mt-2">
            <Badge variant="success" size="sm">
              🏆 {achievements[0]}
            </Badge>
          </div>
        )}
        
        {/* Completion Celebration */}
        {isCompleted && (
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-green-700 font-medium">🎉 Obiettivo Completato!</div>
            <div className="text-green-600 text-sm">Fantastico lavoro! Continua così!</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { 
  AlertTriangle, 
  Clock, 
  Zap, 
  MessageSquare,
  ArrowRight,
  Timer
} from 'lucide-react'

interface Ticket {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  slaStatus: 'overdue' | 'critical' | 'warning' | 'on_time'
  timeRemaining: string
  category: string
  requester: string
  comments: number
  estimatedMinutes?: number
}

interface SLAAlertProps {
  tickets: Ticket[]
  onTicketClick?: (ticketId: string) => void
}

const slaConfig = {
  overdue: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'danger',
    priority: 4
  },
  critical: {
    icon: Timer,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'warning',
    priority: 3
  },
  warning: {
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'warning',
    priority: 2
  },
  on_time: {
    icon: Clock,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'success',
    priority: 1
  }
} as const

const priorityLabels = {
  urgent: 'Urgente',
  high: 'Alta',
  medium: 'Media',
  low: 'Bassa'
}

export function SLAAlert({ tickets, onTicketClick }: SLAAlertProps) {
  // Ordina per priorità SLA e poi per priorità ticket
  const sortedTickets = [...tickets].sort((a, b) => {
    const aSLAPriority = slaConfig[a.slaStatus].priority
    const bSLAPriority = slaConfig[b.slaStatus].priority
    
    if (aSLAPriority !== bSLAPriority) {
      return bSLAPriority - aSLAPriority
    }
    
    // Se SLA uguale, ordina per priorità ticket
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  const overdueCount = tickets.filter(t => t.slaStatus === 'overdue').length
  const criticalCount = tickets.filter(t => t.slaStatus === 'critical').length
  const warningCount = tickets.filter(t => t.slaStatus === 'warning').length

  if (tickets.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="text-green-600 mb-2">
            <Clock className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-1">
            Tutti i ticket rispettano gli SLA! 🎉
          </h3>
          <p className="text-green-600">
            Ottimo lavoro! Nessun ticket richiede attenzione immediata.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "transition-all duration-200",
      overdueCount > 0 ? "border-red-300 bg-red-50 shadow-red-100" :
      criticalCount > 0 ? "border-orange-300 bg-orange-50 shadow-orange-100" :
      "border-yellow-300 bg-yellow-50 shadow-yellow-100"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "flex items-center text-lg",
            overdueCount > 0 ? "text-red-800" :
            criticalCount > 0 ? "text-orange-800" :
            "text-yellow-800"
          )}>
            <Zap className="h-5 w-5 mr-2" />
            Ticket che Richiedono Attenzione
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {overdueCount > 0 && (
              <Badge variant="danger" size="sm">
                {overdueCount} Scaduti
              </Badge>
            )}
            {criticalCount > 0 && (
              <Badge variant="warning" size="sm">
                {criticalCount} Critici
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="warning" size="sm">
                {warningCount} In Scadenza
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedTickets.map((ticket) => {
            const config = slaConfig[ticket.slaStatus]
            const Icon = config.icon
            
            return (
              <div
                key={ticket.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer",
                  config.bg,
                  config.border,
                  "hover:scale-[1.02]"
                )}
                onClick={() => onTicketClick?.(ticket.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-1.5 rounded-full bg-white", config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="default" size="sm">{ticket.id}</Badge>
                        <Badge 
                          variant={config.badge as any}
                          size="sm"
                        >
                          {ticket.slaStatus === 'overdue' ? 'SCADUTO' :
                           ticket.slaStatus === 'critical' ? 'CRITICO' :
                           ticket.slaStatus === 'warning' ? 'IN SCADENZA' : 'IN ORARIO'}
                        </Badge>
                        <Badge 
                          variant={ticket.priority === 'urgent' ? 'danger' : 'default'}
                          size="sm"
                        >
                          {priorityLabels[ticket.priority]}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {ticket.title}
                      </h4>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    Gestisci
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                
                {/* Info essenziali */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">📁 {ticket.category}</span>
                  <div className={cn(
                    "font-medium flex items-center",
                    config.color
                  )}>
                    <Clock className="h-3 w-3 mr-1" />
                    {ticket.timeRemaining}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {tickets.length} ticket richiedono attenzione
            </span>
            <Button size="sm">
              Prendi in carico
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

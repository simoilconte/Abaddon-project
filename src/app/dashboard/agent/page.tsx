'use client'

import React, { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useRole } from '@/providers/RoleProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { KPICard } from '@/components/dashboard/KPICard'
import { SLAAlert } from '@/components/dashboard/SLAAlert'
import { 
  Target,
  Clock,
  Star,
  Trophy,
  Zap,
  Filter,
  RefreshCw,
  MessageSquare,
  Calendar,
  CheckCircle,
  Timer,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'

// Mock data - in produzione verrebbe da Convex
const mockAgentData = {
  kpis: {
    ticketsResolved: { current: 47, target: 60 },
    avgResolutionTime: { current: 2.3, target: 4.0 }, // ore
    customerRating: { current: 4.7, target: 4.5 }, // stelle
  },
  stats: {
    totalAssigned: 23,
    inProgress: 8,
    resolved: 47,
    overdueTickets: 3,
    todayResolved: 6,
    thisWeekResolved: 28
  },
  achievements: ['Velocità Lightning', 'Cliente Felice', 'SLA Master'],
  trends: {
    resolution: { value: 15, isPositive: true, period: 'questa settimana' },
    rating: { value: 8, isPositive: true, period: 'questo mese' },
    speed: { value: 12, isPositive: true, period: 'questa settimana' }
  }
}

const mockSLATickets = [
  {
    id: '#1234',
    title: 'Sistema prenotazioni offline - Urgente riparazione',
    priority: 'urgent' as const,
    slaStatus: 'overdue' as const,
    timeRemaining: 'SCADUTO da 2h 15min',
    category: 'Software Critico',
    requester: 'Dr. Martinelli',
    comments: 5,
    estimatedMinutes: 45
  },
  {
    id: '#1237',
    title: 'Stampante reparto cardiologia non risponde',
    priority: 'high' as const,
    slaStatus: 'critical' as const,
    timeRemaining: '45 minuti rimanenti',
    category: 'Hardware',
    requester: 'Inf. Rossi',
    comments: 2,
    estimatedMinutes: 30
  },
  {
    id: '#1238',
    title: 'Accesso database pazienti bloccato',
    priority: 'high' as const,
    slaStatus: 'warning' as const,
    timeRemaining: '2h 30min rimanenti',
    category: 'Sicurezza',
    requester: 'Dr. Bianchi',
    comments: 3,
    estimatedMinutes: 60
  }
]

const mockAssignedTickets = [
  {
    id: '#1235',
    title: 'Configurazione nuovo utente sistema',
    status: 'in_progress',
    priority: 'medium',
    timeRemaining: '1 giorno rimanente',
    category: 'Account',
    requester: 'Segreteria',
    comments: 1,
    progress: 70
  },
  {
    id: '#1239',
    title: 'Aggiornamento software gestionale',
    status: 'open',
    priority: 'low',
    timeRemaining: '3 giorni rimanenti',
    category: 'Manutenzione',
    requester: 'IT Manager',
    comments: 0,
    progress: 0
  }
]

export default function AgentDashboardPage() {
  const { user } = useRole()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleTicketClick = (ticketId: string) => {
    console.log('Navigate to ticket:', ticketId)
    // Implementare navigazione al ticket
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header con gamification */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Agente</h1>
              <Badge variant="info" size="lg">
                <Trophy className="h-4 w-4 mr-1" />
                Livello Pro
              </Badge>
            </div>
            <p className="text-gray-600">
              Benvenuto, {user.name} • Focus sui tuoi ticket assegnati
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center">
                <Target className="h-4 w-4 mr-1 text-blue-500" />
                {mockAgentData.stats.totalAssigned} ticket assegnati
              </span>
              <span className="flex items-center">
                <Activity className="h-4 w-4 mr-1 text-green-500" />
                {mockAgentData.stats.inProgress} in lavorazione
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-purple-500" />
                {mockAgentData.stats.todayResolved} risolti oggi
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Aggiorna
            </Button>
            <Button>
              <Filter className="w-4 h-4 mr-2" />
              Filtri Avanzati
            </Button>
          </div>
        </div>

        {/* SLA Critical Alerts - Priorità massima */}
        <SLAAlert 
          tickets={mockSLATickets}
          onTicketClick={handleTicketClick}
        />

        {/* KPI Gamification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Ticket Risolti"
            description="Obiettivo mensile"
            icon={CheckCircle}
            current={mockAgentData.kpis.ticketsResolved.current}
            target={mockAgentData.kpis.ticketsResolved.target}
            unit="ticket"
            colorScheme="green"
            trend={mockAgentData.trends.resolution}
            achievements={mockAgentData.achievements.filter(a => a.includes('Velocità'))}
            priority="high"
          />
          
          <KPICard
            title="Tempo Medio Risoluzione"
            description="Target: sotto 4 ore"
            icon={Timer}
            current={mockAgentData.kpis.avgResolutionTime.current}
            target={mockAgentData.kpis.avgResolutionTime.target}
            unit="ore"
            colorScheme="blue"
            trend={mockAgentData.trends.speed}
            achievements={mockAgentData.achievements.filter(a => a.includes('Lightning'))}
            priority="medium"
          />
          
          <KPICard
            title="Rating Cliente"
            description="Soddisfazione utenti"
            icon={Star}
            current={mockAgentData.kpis.customerRating.current}
            target={mockAgentData.kpis.customerRating.target}
            unit="⭐"
            colorScheme="purple"
            trend={mockAgentData.trends.rating}
            achievements={mockAgentData.achievements.filter(a => a.includes('Cliente'))}
            priority="high"
          />
        </div>

        {/* Focus principale: Solo ticket in scadenza */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-blue-800">
                  <Zap className="h-5 w-5 mr-2" />
                  I Tuoi Ticket in Lavorazione
                </CardTitle>
                <CardDescription className="text-blue-600">
                  {mockAgentData.stats.inProgress} ticket attivi
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAssignedTickets.filter(t => t.status === 'in_progress').map((ticket) => (
                <div key={ticket.id} className="bg-white border-2 border-blue-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" size="sm">{ticket.id}</Badge>
                      <Badge variant="warning" size="sm">In Lavorazione</Badge>
                    </div>
                    <Button size="sm">Continua</Button>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{ticket.title}</h4>
                  
                  {/* Progress Bar semplificata */}
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${ticket.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>📁 {ticket.category}</span>
                    <span className="flex items-center text-blue-600 font-medium">
                      <Clock className="h-4 w-4 mr-1" />
                      {ticket.timeRemaining}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

// Ticket statuses
export const TICKET_STATUSES = {
  NEW: 'new',
  OPEN: 'open', 
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const

export const TICKET_STATUS_LABELS = {
  [TICKET_STATUSES.NEW]: 'Nuovo',
  [TICKET_STATUSES.OPEN]: 'Aperto',
  [TICKET_STATUSES.IN_PROGRESS]: 'In Lavorazione',
  [TICKET_STATUSES.RESOLVED]: 'Risolto',
  [TICKET_STATUSES.CLOSED]: 'Chiuso'
} as const

// Priorities
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Bassa',
  [PRIORITIES.MEDIUM]: 'Media',
  [PRIORITIES.HIGH]: 'Alta',
  [PRIORITIES.URGENT]: 'Urgente'
} as const

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: 'bg-gray-100 text-gray-800',
  [PRIORITIES.MEDIUM]: 'bg-blue-100 text-blue-800',
  [PRIORITIES.HIGH]: 'bg-orange-100 text-orange-800',
  [PRIORITIES.URGENT]: 'bg-red-100 text-red-800'
} as const

// Roles
export const ROLES = {
  USER: 'user',
  AGENT: 'agent',
  ADMIN: 'admin'
} as const

export const ROLE_LABELS = {
  [ROLES.USER]: 'Utente',
  [ROLES.AGENT]: 'Agente',
  [ROLES.ADMIN]: 'Amministratore'
} as const

// Permissions
export const RESOURCES = {
  TICKETS: 'tickets',
  USERS: 'users',
  CLINICS: 'clinics',
  CATEGORIES: 'categories',
  SETTINGS: 'settings',
  REPORTS: 'reports'
} as const

export const ACTIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  APPROVE: 'approve'
} as const

export const SCOPES = {
  OWN: 'own',
  CLINIC: 'clinic',
  GLOBAL: 'global'
} as const

// UI Constants
export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const
export const DEFAULT_ITEMS_PER_PAGE = 25

// SLA Constants
export const SLA_WARNING_HOURS = 2 // Hours before deadline to show warning
export const DEFAULT_SLA_HOURS = 24
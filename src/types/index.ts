// Core entity types
export interface User {
  _id: string
  email: string
  name: string
  clinicId: string
  roleId: string
  auth0Id: string
  isActive: boolean
  lastLoginAt?: number
  preferences: UserPreferences
  _creationTime: number
}

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
  }
  dashboard: {
    defaultView: string
    itemsPerPage: number
  }
}

export interface Clinic {
  _id: string
  name: string
  code: string
  address: string
  phone: string
  email: string
  settings: ClinicSettings
  isActive: boolean
  _creationTime: number
}

export interface ClinicSettings {
  allowPublicTickets: boolean
  requireApprovalForCategories: boolean
  defaultSlaHours: number
}

export interface Ticket {
  _id: string
  title: string
  description: string
  status: TicketStatus
  priority: Priority
  categoryId: string
  clinicId: string
  creatorId: string
  assigneeId?: string
  visibility: 'public' | 'private'
  customFields: Record<string, unknown>
  slaDeadline?: number
  tags: string[]
  _creationTime: number
}

export type TicketStatus = 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Role {
  _id: string
  name: string
  description: string
  clinicId?: string
  permissions: Permission[]
  isSystem: boolean
  _creationTime: number
}

export interface Permission {
  _id: string
  resource: string
  action: string
  scope: 'own' | 'clinic' | 'global'
}

export interface Category {
  _id: string
  name: string
  description?: string
  clinicId: string
  departmentId?: string
  visibility: 'public' | 'private'
  requiresApproval: boolean
  isActive: boolean
  _creationTime: number
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Form types
export interface CreateTicketData {
  title: string
  description: string
  categoryId: string
  priority: Priority
  visibility: 'public' | 'private'
  customFields?: Record<string, unknown>
}

export interface UpdateTicketData {
  title?: string
  description?: string
  status?: TicketStatus
  priority?: Priority
  categoryId?: string
  assigneeId?: string
  customFields?: Record<string, unknown>
}

// Filter and search types
export interface TicketFilters {
  status?: TicketStatus[]
  priority?: Priority[]
  assigneeId?: string
  creatorId?: string
  categoryId?: string
  clinicId?: string
  search?: string
  dateFrom?: number
  dateTo?: number
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}
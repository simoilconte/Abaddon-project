import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    name: v.string(),
    clinicId: v.id("clinics"),
    roleId: v.id("roles"),
    auth0Id: v.string(),
    isActive: v.boolean(),
    lastLoginAt: v.optional(v.number()),
    preferences: v.object({
      notifications: v.object({
        email: v.boolean(),
        push: v.boolean(),
      }),
      dashboard: v.object({
        defaultView: v.string(),
        itemsPerPage: v.number(),
      }),
    }),
  })
    .index("by_clinic", ["clinicId"])
    .index("by_auth0", ["auth0Id"])
    .index("by_email", ["email"])
    .index("by_role", ["roleId"]),

  // Clinics table
  clinics: defineTable({
    name: v.string(),
    code: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    settings: v.object({
      allowPublicTickets: v.boolean(),
      requireApprovalForCategories: v.boolean(),
      defaultSlaHours: v.number(),
    }),
    isActive: v.boolean(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"]),

  // Roles table
  roles: defineTable({
    name: v.string(),
    description: v.string(),
    clinicId: v.optional(v.id("clinics")),
    permissions: v.array(v.id("permissions")),
    isSystem: v.boolean(),
  })
    .index("by_clinic", ["clinicId"])
    .index("by_system", ["isSystem"]),

  // Permissions table
  permissions: defineTable({
    resource: v.string(),
    action: v.string(),
    scope: v.union(v.literal("own"), v.literal("clinic"), v.literal("global")),
  })
    .index("by_resource", ["resource"])
    .index("by_resource_action", ["resource", "action"]),

  // Departments table
  departments: defineTable({
    name: v.string(),
    clinicId: v.id("clinics"),
    managerId: v.optional(v.id("users")),
    isActive: v.boolean(),
  })
    .index("by_clinic", ["clinicId"])
    .index("by_manager", ["managerId"]),

  // Categories table
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    clinicId: v.id("clinics"),
    departmentId: v.optional(v.id("departments")),
    visibility: v.union(v.literal("public"), v.literal("private")),
    requiresApproval: v.boolean(),
    isActive: v.boolean(),
  })
    .index("by_clinic", ["clinicId"])
    .index("by_department", ["departmentId"])
    .index("by_visibility", ["visibility"])
    .index("by_clinic_visibility", ["clinicId", "visibility"]),

  // Tickets table
  tickets: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    categoryId: v.id("categories"),
    clinicId: v.id("clinics"),
    creatorId: v.id("users"),
    assigneeId: v.optional(v.id("users")),
    visibility: v.union(v.literal("public"), v.literal("private")),
    customFields: v.any(),
    slaDeadline: v.optional(v.number()),
    tags: v.array(v.string()),
  })
    .index("by_clinic", ["clinicId"])
    .index("by_creator", ["creatorId"])
    .index("by_assignee", ["assigneeId"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_category", ["categoryId"])
    .index("by_sla", ["slaDeadline"])
    .index("by_clinic_status", ["clinicId", "status"])
    .index("by_assignee_status", ["assigneeId", "status"]),

  // Comments table
  comments: defineTable({
    ticketId: v.id("tickets"),
    authorId: v.id("users"),
    content: v.string(),
    isInternal: v.boolean(),
    attachments: v.array(v.string()),
  })
    .index("by_ticket", ["ticketId"])
    .index("by_author", ["authorId"]),

  // Attachments table
  attachments: defineTable({
    ticketId: v.optional(v.id("tickets")),
    commentId: v.optional(v.id("comments")),
    uploaderId: v.id("users"),
    fileName: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    storageId: v.string(),
  })
    .index("by_ticket", ["ticketId"])
    .index("by_comment", ["commentId"])
    .index("by_uploader", ["uploaderId"]),

  // Audit logs table
  auditLogs: defineTable({
    entityType: v.string(),
    entityId: v.string(),
    action: v.string(),
    userId: v.id("users"),
    changes: v.any(),
    metadata: v.optional(v.any()),
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_user", ["userId"])
    .index("by_action", ["action"]),

  // SLA rules table
  slaRules: defineTable({
    name: v.string(),
    clinicId: v.id("clinics"),
    conditions: v.any(),
    targetHours: v.number(),
    isActive: v.boolean(),
  })
    .index("by_clinic", ["clinicId"])
    .index("by_active", ["isActive"]),

  // Triggers table
  triggers: defineTable({
    name: v.string(),
    clinicId: v.id("clinics"),
    conditions: v.any(),
    actions: v.any(),
    isActive: v.boolean(),
    requiresApproval: v.boolean(),
    createdBy: v.id("users"),
  })
    .index("by_clinic", ["clinicId"])
    .index("by_creator", ["createdBy"])
    .index("by_active", ["isActive"]),

  // Macros table
  macros: defineTable({
    name: v.string(),
    clinicId: v.id("clinics"),
    actions: v.any(),
    isActive: v.boolean(),
    requiresApproval: v.boolean(),
    createdBy: v.id("users"),
  })
    .index("by_clinic", ["clinicId"])
    .index("by_creator", ["createdBy"])
    .index("by_active", ["isActive"]),
})
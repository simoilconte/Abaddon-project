import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"
import { getCurrentUser } from "./lib/utils"

// Query per ottenere tutti i permessi disponibili
export const getAllPermissions = query({
  handler: async (ctx) => {
    return await ctx.db.query("permissions").collect()
  }
})

// Query per ottenere tutti i ruoli
export const getAllRoles = query({
  args: { 
    clinicId: v.optional(v.id("clinics")),
    includeSystem: v.optional(v.boolean())
  },
  handler: async (ctx, { clinicId, includeSystem = true }) => {
    let roles
    
    if (clinicId) {
      roles = await ctx.db
        .query("roles")
        .withIndex("by_clinic", (q) => q.eq("clinicId", clinicId))
        .collect()
    } else {
      roles = await ctx.db.query("roles").collect()
    }
    
    if (!includeSystem) {
      return roles.filter(role => !role.isSystem)
    }
    
    return roles
  }
})

// Query per ottenere un ruolo per ID
export const getRoleById = query({
  args: { roleId: v.id("roles") },
  handler: async (ctx, { roleId }) => {
    const role = await ctx.db.get(roleId)
    if (!role) {
      throw new ConvexError("Role not found")
    }
    
    // Popola i permessi
    const permissions = await Promise.all(
      role.permissions.map(permId => ctx.db.get(permId))
    )
    
    return {
      ...role,
      permissionDetails: permissions.filter(Boolean)
    }
  }
})

// Mutation per creare i permessi di base del sistema
export const createSystemPermissions = mutation({
  handler: async (ctx) => {
    // Verifica se i permessi esistono già
    const existingPermissions = await ctx.db.query("permissions").collect()
    if (existingPermissions.length > 0) {
      return existingPermissions
    }
    
    const permissions = [
      // Permessi per ticket
      { resource: "tickets", action: "read", scope: "own" as const },
      { resource: "tickets", action: "read", scope: "clinic" as const },
      { resource: "tickets", action: "read", scope: "global" as const },
      { resource: "tickets", action: "write", scope: "own" as const },
      { resource: "tickets", action: "write", scope: "clinic" as const },
      { resource: "tickets", action: "write", scope: "global" as const },
      { resource: "tickets", action: "delete", scope: "own" as const },
      { resource: "tickets", action: "delete", scope: "clinic" as const },
      { resource: "tickets", action: "delete", scope: "global" as const },
      
      // Permessi per utenti
      { resource: "users", action: "read", scope: "clinic" as const },
      { resource: "users", action: "read", scope: "global" as const },
      { resource: "users", action: "write", scope: "clinic" as const },
      { resource: "users", action: "write", scope: "global" as const },
      { resource: "users", action: "delete", scope: "clinic" as const },
      { resource: "users", action: "delete", scope: "global" as const },
      
      // Permessi per cliniche
      { resource: "clinics", action: "read", scope: "global" as const },
      { resource: "clinics", action: "write", scope: "global" as const },
      { resource: "clinics", action: "delete", scope: "global" as const },
      
      // Permessi per categorie
      { resource: "categories", action: "read", scope: "clinic" as const },
      { resource: "categories", action: "write", scope: "clinic" as const },
      { resource: "categories", action: "delete", scope: "clinic" as const },
      { resource: "categories", action: "approve", scope: "clinic" as const },
      
      // Permessi per impostazioni
      { resource: "settings", action: "read", scope: "clinic" as const },
      { resource: "settings", action: "read", scope: "global" as const },
      { resource: "settings", action: "write", scope: "clinic" as const },
      { resource: "settings", action: "write", scope: "global" as const },
      
      // Permessi per report
      { resource: "reports", action: "read", scope: "clinic" as const },
      { resource: "reports", action: "read", scope: "global" as const },
    ]
    
    const permissionIds = await Promise.all(
      permissions.map(permission => ctx.db.insert("permissions", permission))
    )
    
    return permissionIds
  }
})

// Mutation per creare i ruoli di base del sistema
export const createSystemRoles = mutation({
  handler: async (ctx) => {
    // Verifica se i ruoli esistono già
    const existingRoles = await ctx.db
      .query("roles")
      .withIndex("by_system", (q) => q.eq("isSystem", true))
      .collect()
      
    if (existingRoles.length > 0) {
      return existingRoles
    }
    
    // Ottieni tutti i permessi
    const allPermissions = await ctx.db.query("permissions").collect()
    
    // Permessi per ruolo Utente
    const userPermissions = allPermissions.filter(p => 
      (p.resource === "tickets" && p.scope === "own") ||
      (p.resource === "tickets" && p.action === "read" && p.scope === "clinic") ||
      (p.resource === "categories" && p.action === "read")
    ).map(p => p._id)
    
    // Permessi per ruolo Agente
    const agentPermissions = allPermissions.filter(p => 
      p.scope === "clinic" || 
      (p.resource === "tickets" && p.scope === "own")
    ).map(p => p._id)
    
    // Permessi per ruolo Admin (tutti)
    const adminPermissions = allPermissions.map(p => p._id)
    
    // Crea i ruoli
    const userRoleId = await ctx.db.insert("roles", {
      name: "Utente",
      description: "Utente base che può creare e gestire i propri ticket",
      permissions: userPermissions,
      isSystem: true,
    })
    
    const agentRoleId = await ctx.db.insert("roles", {
      name: "Agente",
      description: "Agente che può gestire ticket della propria clinica",
      permissions: agentPermissions,
      isSystem: true,
    })
    
    const adminRoleId = await ctx.db.insert("roles", {
      name: "Amministratore",
      description: "Amministratore con accesso completo al sistema",
      permissions: adminPermissions,
      isSystem: true,
    })
    
    return [userRoleId, agentRoleId, adminRoleId]
  }
})

// Mutation per creare un nuovo ruolo personalizzato
export const createRole = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    clinicId: v.optional(v.id("clinics")),
    permissions: v.array(v.id("permissions")),
  },
  handler: async (ctx, args) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Validazioni
    if (args.name.length < 2) {
      throw new ConvexError("Role name must be at least 2 characters long")
    }
    
    // Verifica che i permessi esistano
    const permissionChecks = await Promise.all(
      args.permissions.map(permId => ctx.db.get(permId))
    )
    
    if (permissionChecks.some(perm => !perm)) {
      throw new ConvexError("One or more permissions not found")
    }
    
    // Crea il ruolo
    const roleId = await ctx.db.insert("roles", {
      name: args.name,
      description: args.description,
      clinicId: args.clinicId,
      permissions: args.permissions,
      isSystem: false,
    })
    
    return roleId
  }
})

// Mutation per aggiornare un ruolo
export const updateRole = mutation({
  args: {
    roleId: v.id("roles"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    permissions: v.optional(v.array(v.id("permissions"))),
  },
  handler: async (ctx, { roleId, ...updates }) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Verifica che il ruolo esista
    const role = await ctx.db.get(roleId)
    if (!role) {
      throw new ConvexError("Role not found")
    }
    
    // Non permettere modifica dei ruoli di sistema
    if (role.isSystem) {
      throw new ConvexError("Cannot modify system roles")
    }
    
    // Validazioni
    if (updates.name && updates.name.length < 2) {
      throw new ConvexError("Role name must be at least 2 characters long")
    }
    
    // Verifica che i permessi esistano se forniti
    if (updates.permissions) {
      const permissionChecks = await Promise.all(
        updates.permissions.map(permId => ctx.db.get(permId))
      )
      
      if (permissionChecks.some(perm => !perm)) {
        throw new ConvexError("One or more permissions not found")
      }
    }
    
    // Aggiorna il ruolo
    await ctx.db.patch(roleId, updates)
    
    return roleId
  }
})

// Mutation per eliminare un ruolo personalizzato
export const deleteRole = mutation({
  args: { roleId: v.id("roles") },
  handler: async (ctx, { roleId }) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Verifica che il ruolo esista
    const role = await ctx.db.get(roleId)
    if (!role) {
      throw new ConvexError("Role not found")
    }
    
    // Non permettere eliminazione dei ruoli di sistema
    if (role.isSystem) {
      throw new ConvexError("Cannot delete system roles")
    }
    
    // Verifica che non ci siano utenti con questo ruolo
    const usersWithRole = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("roleId", roleId))
      .collect()
      
    if (usersWithRole.length > 0) {
      throw new ConvexError("Cannot delete role: users are still assigned to this role")
    }
    
    // Elimina il ruolo
    await ctx.db.delete(roleId)
    
    return roleId
  }
})
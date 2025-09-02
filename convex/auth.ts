import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"

// Query per ottenere o creare un utente da Auth0
export const getOrCreateUser = mutation({
  args: {
    auth0Id: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { auth0Id, email, name }) => {
    // Cerca l'utente esistente
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_auth0", (q) => q.eq("auth0Id", auth0Id))
      .unique()
    
    if (existingUser) {
      // Aggiorna l'ultimo accesso
      await ctx.db.patch(existingUser._id, { 
        lastLoginAt: Date.now() 
      })
      return existingUser
    }

    // Se non trovato per auth0Id, prova ad associare per email (per utenti creati manualmente)
    const userByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique()

    if (userByEmail) {
      await ctx.db.patch(userByEmail._id, {
        auth0Id,
        name: userByEmail.name || name,
        lastLoginAt: Date.now(),
      })
      const patched = await ctx.db.get(userByEmail._id)
      return patched
    }
    
    // Se l'utente non esiste, verifica se abbiamo una clinica di default
    const defaultClinic = await ctx.db
      .query("clinics")
      .withIndex("by_code", (q) => q.eq("code", "DEMO001"))
      .unique()
    
    if (!defaultClinic) {
      throw new ConvexError("No default clinic found. Please initialize the database first.")
    }
    
    // Ottieni il ruolo utente di default
    const userRole = await ctx.db
      .query("roles")
      .withIndex("by_system", (q) => q.eq("isSystem", true))
      .filter((q) => q.eq(q.field("name"), "Utente"))
      .unique()
    
    if (!userRole) {
      throw new ConvexError("Default user role not found. Please initialize the database first.")
    }
    
    // Crea il nuovo utente
    const userId = await ctx.db.insert("users", {
      email,
      name,
      auth0Id,
      clinicId: defaultClinic._id,
      roleId: userRole._id,
      isActive: true,
      lastLoginAt: Date.now(),
      preferences: {
        notifications: {
          email: true,
          push: true,
        },
        dashboard: {
          defaultView: "my-tickets",
          itemsPerPage: 25,
        },
      },
    })
    
    const newUser = await ctx.db.get(userId)
    return newUser
  }
})

// Query per verificare i permessi di un utente
export const checkUserPermission = query({
  args: {
    resource: v.string(),
    action: v.string(),
    targetId: v.optional(v.string()),
  },
  handler: async (ctx, { resource, action, targetId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return false
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth0", (q) => q.eq("auth0Id", identity.subject))
      .unique()
    
    if (!user || !user.isActive) {
      return false
    }
    
    // Ottieni il ruolo dell'utente
    const role = await ctx.db.get(user.roleId)
    if (!role) {
      return false
    }
    
    // Ottieni tutti i permessi del ruolo
    const permissions = await Promise.all(
      role.permissions.map(permId => ctx.db.get(permId))
    )
    
    // Verifica se l'utente ha il permesso richiesto
    for (const permission of permissions) {
      if (!permission) continue
      
      if (permission.resource === resource && permission.action === action) {
        // Verifica lo scope del permesso
        switch (permission.scope) {
          case "global":
            return true
          case "clinic":
            // Per scope clinic, verifica che l'utente appartenga alla stessa clinica
            if (targetId) {
              // Se targetId è fornito, verifica che appartenga alla stessa clinica
              // Questo richiede logica specifica per ogni tipo di risorsa
              return true // Semplificato per ora
            }
            return true
          case "own":
            // Per scope own, verifica che l'utente sia il proprietario
            if (targetId) {
              return targetId === user._id
            }
            return true
        }
      }
    }
    
    return false
  }
})

// Mutation per aggiornare il profilo utente
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
    preferences: v.optional(v.object({
      notifications: v.object({
        email: v.boolean(),
        push: v.boolean(),
      }),
      dashboard: v.object({
        defaultView: v.string(),
        itemsPerPage: v.number(),
      }),
    }))
  },
  handler: async (ctx, updates) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Authentication required")
    }
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth0", (q) => q.eq("auth0Id", identity.subject))
      .unique()
    
    if (!user) {
      throw new ConvexError("User not found")
    }
    
    // Validazioni
    if (updates.name && updates.name.length < 2) {
      throw new ConvexError("Name must be at least 2 characters long")
    }
    
    // Aggiorna l'utente
    await ctx.db.patch(user._id, updates)
    
    return user._id
  }
})
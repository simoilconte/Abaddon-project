import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"
import { getCurrentUser, isValidClinicCode } from "./lib/utils"

// Query per ottenere tutte le cliniche attive
export const getAllClinics = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("clinics")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect()
  }
})

// Query per ottenere una clinica per ID
export const getClinicById = query({
  args: { clinicId: v.id("clinics") },
  handler: async (ctx, { clinicId }) => {
    const clinic = await ctx.db.get(clinicId)
    if (!clinic) {
      throw new ConvexError("Clinic not found")
    }
    return clinic
  }
})

// Query per ottenere una clinica per codice
export const getClinicByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    return await ctx.db
      .query("clinics")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique()
  }
})

// Mutation per creare una nuova clinica
export const createClinic = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    settings: v.optional(v.object({
      allowPublicTickets: v.boolean(),
      requireApprovalForCategories: v.boolean(),
      defaultSlaHours: v.number(),
    }))
  },
  handler: async (ctx, args) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Validazioni
    if (args.name.length < 2) {
      throw new ConvexError("Clinic name must be at least 2 characters long")
    }
    
    if (!isValidClinicCode(args.code)) {
      throw new ConvexError("Clinic code must be 3-10 alphanumeric characters")
    }
    
    // Verifica che il codice non esista già
    const existingClinic = await ctx.db
      .query("clinics")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique()
      
    if (existingClinic) {
      throw new ConvexError("Clinic code already exists")
    }
    
    // Crea la clinica con impostazioni di default
    const clinicId = await ctx.db.insert("clinics", {
      name: args.name,
      code: args.code,
      address: args.address,
      phone: args.phone,
      email: args.email,
      settings: args.settings || {
        allowPublicTickets: true,
        requireApprovalForCategories: false,
        defaultSlaHours: 24,
      },
      isActive: true,
    })
    
    return clinicId
  }
})

// Mutation per aggiornare una clinica
export const updateClinic = mutation({
  args: {
    clinicId: v.id("clinics"),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    settings: v.optional(v.object({
      allowPublicTickets: v.boolean(),
      requireApprovalForCategories: v.boolean(),
      defaultSlaHours: v.number(),
    })),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { clinicId, ...updates }) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Verifica che la clinica esista
    const clinic = await ctx.db.get(clinicId)
    if (!clinic) {
      throw new ConvexError("Clinic not found")
    }
    
    // Validazioni
    if (updates.name && updates.name.length < 2) {
      throw new ConvexError("Clinic name must be at least 2 characters long")
    }
    
    // Aggiorna la clinica
    await ctx.db.patch(clinicId, updates)
    
    return clinicId
  }
})

// Mutation per disattivare una clinica
export const deactivateClinic = mutation({
  args: { clinicId: v.id("clinics") },
  handler: async (ctx, { clinicId }) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Verifica che la clinica esista
    const clinic = await ctx.db.get(clinicId)
    if (!clinic) {
      throw new ConvexError("Clinic not found")
    }
    
    // Disattiva la clinica
    await ctx.db.patch(clinicId, { isActive: false })
    
    return clinicId
  }
})

// Query per ottenere statistiche di una clinica
export const getClinicStats = query({
  args: { clinicId: v.id("clinics") },
  handler: async (ctx, { clinicId }) => {
    // Verifica che la clinica esista
    const clinic = await ctx.db.get(clinicId)
    if (!clinic) {
      throw new ConvexError("Clinic not found")
    }
    
    // Conta utenti attivi
    const activeUsers = await ctx.db
      .query("users")
      .withIndex("by_clinic", (q) => q.eq("clinicId", clinicId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect()
    
    // Conta ticket totali
    const totalTickets = await ctx.db
      .query("tickets")
      .withIndex("by_clinic", (q) => q.eq("clinicId", clinicId))
      .collect()
    
    // Conta ticket aperti
    const openTickets = await ctx.db
      .query("tickets")
      .withIndex("by_clinic_status", (q) => 
        q.eq("clinicId", clinicId).eq("status", "open")
      )
      .collect()
    
    return {
      activeUsers: activeUsers.length,
      totalTickets: totalTickets.length,
      openTickets: openTickets.length,
    }
  }
})
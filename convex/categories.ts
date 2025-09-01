import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { ConvexError } from "convex/values"
import { getCurrentUser } from "./lib/utils"

// Query per ottenere tutte le categorie di una clinica
export const getCategoriesByClinic = query({
  args: { 
    clinicId: v.id("clinics"),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    isActive: v.optional(v.boolean())
  },
  handler: async (ctx, { clinicId, visibility, isActive }) => {
    let query = ctx.db
      .query("categories")
      .withIndex("by_clinic", (q) => q.eq("clinicId", clinicId))
    
    const categories = await query.collect()
    
    // Applica filtri
    let filteredCategories = categories
    
    if (visibility) {
      filteredCategories = filteredCategories.filter(cat => cat.visibility === visibility)
    }
    
    if (isActive !== undefined) {
      filteredCategories = filteredCategories.filter(cat => cat.isActive === isActive)
    }
    
    // Popola i dati del dipartimento se presente
    const categoriesWithDepartments = await Promise.all(
      filteredCategories.map(async (category) => {
        const department = category.departmentId 
          ? await ctx.db.get(category.departmentId)
          : null
        return { ...category, department }
      })
    )
    
    return categoriesWithDepartments
  }
})

// Query per ottenere una categoria per ID
export const getCategoryById = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, { categoryId }) => {
    const category = await ctx.db.get(categoryId)
    if (!category) {
      throw new ConvexError("Category not found")
    }
    
    // Popola i dati del dipartimento se presente
    const department = category.departmentId 
      ? await ctx.db.get(category.departmentId)
      : null
    
    return { ...category, department }
  }
})

// Query per ottenere categorie pubbliche di una clinica (per utenti)
export const getPublicCategories = query({
  args: { clinicId: v.id("clinics") },
  handler: async (ctx, { clinicId }) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_clinic", (q) => q.eq("clinicId", clinicId))
      .filter((q) => 
        q.and(
          q.eq(q.field("visibility"), "public"),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect()
  }
})

// Mutation per creare una nuova categoria
export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    clinicId: v.id("clinics"),
    departmentId: v.optional(v.id("departments")),
    visibility: v.union(v.literal("public"), v.literal("private")),
  },
  handler: async (ctx, args) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Validazioni
    if (args.name.length < 2) {
      throw new ConvexError("Category name must be at least 2 characters long")
    }
    
    // Verifica che la clinica esista
    const clinic = await ctx.db.get(args.clinicId)
    if (!clinic) {
      throw new ConvexError("Clinic not found")
    }
    
    // Verifica che il dipartimento esista se fornito
    if (args.departmentId) {
      const department = await ctx.db.get(args.departmentId)
      if (!department) {
        throw new ConvexError("Department not found")
      }
      
      // Verifica che il dipartimento appartenga alla stessa clinica
      if (department.clinicId !== args.clinicId) {
        throw new ConvexError("Department does not belong to the specified clinic")
      }
    }
    
    // Verifica che non esista già una categoria con lo stesso nome nella clinica
    const existingCategory = await ctx.db
      .query("categories")
      .withIndex("by_clinic", (q) => q.eq("clinicId", args.clinicId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique()
      
    if (existingCategory) {
      throw new ConvexError("A category with this name already exists in this clinic")
    }
    
    // Determina se richiede approvazione
    const requiresApproval = clinic.settings.requireApprovalForCategories
    
    // Crea la categoria
    const categoryId = await ctx.db.insert("categories", {
      name: args.name,
      description: args.description,
      clinicId: args.clinicId,
      departmentId: args.departmentId,
      visibility: args.visibility,
      requiresApproval,
      isActive: !requiresApproval, // Se richiede approvazione, inizia come inattiva
    })
    
    return categoryId
  }
})

// Mutation per aggiornare una categoria
export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    departmentId: v.optional(v.id("departments")),
    visibility: v.optional(v.union(v.literal("public"), v.literal("private"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { categoryId, ...updates }) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Verifica che la categoria esista
    const category = await ctx.db.get(categoryId)
    if (!category) {
      throw new ConvexError("Category not found")
    }
    
    // Validazioni
    if (updates.name && updates.name.length < 2) {
      throw new ConvexError("Category name must be at least 2 characters long")
    }
    
    // Verifica che il dipartimento esista se fornito
    if (updates.departmentId) {
      const department = await ctx.db.get(updates.departmentId)
      if (!department) {
        throw new ConvexError("Department not found")
      }
      
      // Verifica che il dipartimento appartenga alla stessa clinica
      if (department.clinicId !== category.clinicId) {
        throw new ConvexError("Department does not belong to the same clinic")
      }
    }
    
    // Verifica unicità del nome se viene cambiato
    if (updates.name && updates.name !== category.name) {
      const existingCategory = await ctx.db
        .query("categories")
        .withIndex("by_clinic", (q) => q.eq("clinicId", category.clinicId))
        .filter((q) => q.eq(q.field("name"), updates.name))
        .unique()
        
      if (existingCategory) {
        throw new ConvexError("A category with this name already exists in this clinic")
      }
    }
    
    // Aggiorna la categoria
    await ctx.db.patch(categoryId, updates)
    
    return categoryId
  }
})

// Mutation per approvare una categoria
export const approveCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, { categoryId }) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Verifica che la categoria esista
    const category = await ctx.db.get(categoryId)
    if (!category) {
      throw new ConvexError("Category not found")
    }
    
    // Attiva la categoria
    await ctx.db.patch(categoryId, { 
      isActive: true,
      requiresApproval: false 
    })
    
    return categoryId
  }
})

// Mutation per rifiutare una categoria
export const rejectCategory = mutation({
  args: { 
    categoryId: v.id("categories"),
    reason: v.optional(v.string())
  },
  handler: async (ctx, { categoryId, reason }) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Verifica che la categoria esista
    const category = await ctx.db.get(categoryId)
    if (!category) {
      throw new ConvexError("Category not found")
    }
    
    // Elimina la categoria rifiutata
    await ctx.db.delete(categoryId)
    
    // TODO: Inviare notifica al creatore con il motivo del rifiuto
    
    return categoryId
  }
})

// Mutation per eliminare una categoria
export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, { categoryId }) => {
    // Verifica autenticazione
    const currentUser = await getCurrentUser(ctx)
    
    // Verifica che la categoria esista
    const category = await ctx.db.get(categoryId)
    if (!category) {
      throw new ConvexError("Category not found")
    }
    
    // Verifica che non ci siano ticket associati a questa categoria
    const ticketsWithCategory = await ctx.db
      .query("tickets")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .collect()
      
    if (ticketsWithCategory.length > 0) {
      throw new ConvexError("Cannot delete category: there are tickets associated with it")
    }
    
    // Elimina la categoria
    await ctx.db.delete(categoryId)
    
    return categoryId
  }
})

// Query per ottenere categorie in attesa di approvazione
export const getPendingCategories = query({
  args: { clinicId: v.optional(v.id("clinics")) },
  handler: async (ctx, { clinicId }) => {
    let categories
    
    if (clinicId) {
      categories = await ctx.db
        .query("categories")
        .withIndex("by_clinic", (q) => q.eq("clinicId", clinicId))
    } else {
      categories = await ctx.db.query("categories")
    }
    
    const allCategories = await categories
      .filter((q) => 
        q.and(
          q.eq(q.field("requiresApproval"), true),
          q.eq(q.field("isActive"), false)
        )
      )
      .collect()
    
    // Popola i dati della clinica e del dipartimento
    const categoriesWithDetails = await Promise.all(
      allCategories.map(async (category) => {
        const [clinic, department] = await Promise.all([
          ctx.db.get(category.clinicId),
          category.departmentId ? ctx.db.get(category.departmentId) : null
        ])
        return { ...category, clinic, department }
      })
    )
    
    return categoriesWithDetails
  }
})
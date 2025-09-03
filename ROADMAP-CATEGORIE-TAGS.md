# 🏗️ Roadmap Categorie e Tag System

## ✅ **Completato**

### Backend Foundation
- [x] Schema Convex esteso con tabelle `tags` e `ticketTags`
- [x] Funzioni CRUD complete per categorie con alberatura
- [x] Funzioni CRUD complete per tag con ricerca semantica
- [x] 9 categorie base inizializzate (Manutenzioni, Elettromedicali, etc.)
- [x] Supporto sinonimi per ricerca AI futura

### UI Admin
- [x] Pagina `/admin/categories` per gestione categorie e tag
- [x] Link nella sidebar (solo per admin)
- [x] Visualizzazione categorie con statistiche
- [x] Visualizzazione tag con colori e utilizzi
- [x] Form di creazione categorie/tag (mock UI)

---

## 🚧 **Da Implementare - Priorità Alta**

### 1. **Integrazione Backend-Frontend**
- [ ] Connettere pagina admin alle funzioni Convex reali
- [ ] Implementare form creazione/modifica funzionanti
- [ ] Gestione errori e validazioni UI
- [ ] Loading states e feedback utente

### 2. **Sistema di Autenticazione**
- [ ] Riattivare controlli autenticazione nelle funzioni Convex
- [ ] Verificare permessi admin per accesso pagina
- [ ] Protezione route `/admin/*` con middleware

### 3. **Tag nei Form Ticket**
- [ ] Componente `TagSelector` per form nuovo ticket
- [ ] Auto-suggest tag basato su categoria selezionata
- [ ] Creazione tag al volo durante inserimento ticket
- [ ] Visualizzazione tag nei dettagli ticket

### 4. **Ricerca e Filtri Avanzati**
- [ ] Filtro ticket per tag multipli
- [ ] Ricerca full-text in categorie/tag/sinonimi
- [ ] Filtri combinati categoria + tag
- [ ] Salvataggio filtri preferiti

---

## 🔮 **Funzionalità AI Future - Priorità Media**

### 1. **Agent Intelligente per Categorizzazione**
- [ ] Analisi testo ticket con NLP
- [ ] Suggerimento automatico categoria + tag
- [ ] Confidence score per suggerimenti
- [ ] Human-in-the-loop per approvazione suggerimenti
- [ ] Learning da feedback admin/agenti

### 2. **Tag Auto-Generation**
- [ ] Estrazione automatica tag da descrizioni ticket
- [ ] Clustering ticket simili per suggerire nuovi tag
- [ ] Analisi trend tag più utilizzati per categoria
- [ ] Pulizia automatica tag poco utilizzati

### 3. **Routing Intelligente**
- [ ] Tabella `agentCompetences` per mapping competenze
- [ ] Assegnazione automatica ticket basata su categoria/tag
- [ ] Bilanciamento carico agenti
- [ ] Prioritizzazione per SLA e urgenza

---

## 🎨 **Miglioramenti UX - Priorità Bassa**

### 1. **Dashboard Analytics**
- [ ] Grafici utilizzo categorie/tag nel tempo
- [ ] Heatmap categorie più problematiche
- [ ] Trend efficacia tag AI vs manuali
- [ ] Report performance agenti per categoria

### 2. **Gestione Avanzata Tag**
- [ ] Drag & drop per riordinare categorie
- [ ] Bulk operations (attiva/disattiva multipli)
- [ ] Import/export configurazioni categoria/tag
- [ ] Template categorie per nuove cliniche

### 3. **Integrazione Knowledge Base**
- [ ] Link articoli KB a categorie specifiche
- [ ] Suggerimenti KB automatici basati su tag
- [ ] Creazione articoli da ticket ricorrenti
- [ ] Tag comuni tra ticket e articoli KB

---

## 🔧 **Dettagli Tecnici**

### Schema Database (Convex)
```typescript
// Già implementato
categories: {
  name, slug, description, clinicId, parentId, 
  path[], depth, order, synonyms[], isActive
}

tags: {
  name, slug, description, clinicId, categoryId?,
  color, usageCount, synonyms[], aiGenerated, isActive
}

ticketTags: {
  ticketId, tagId
}

// Da implementare per AI
agentCompetences: {
  agentId, clinicId, categoryId?, tagId?,
  weight, autoAssignable
}

aiSuggestions: {
  ticketId, model, suggestedCategoryId?, 
  suggestedTagIds[], score, status, rationale?
}
```

### API Endpoints Prioritari
```typescript
// Categorie
categories.getTree(clinicId) ✅
categories.create(name, description, ...) ✅
categories.update(categoryId, updates) ✅

// Tag
tags.search(clinicId, searchTerm) ✅
tags.create(name, categoryId?, color?, ...) ✅
tags.getStatsByCategory(clinicId) ✅

// Da implementare
tickets.assignBestAgent(ticketId)
ai.suggestForTicket(ticketId)
ai.acceptSuggestion(suggestionId)
```

### Componenti UI Prioritari
```typescript
// Da implementare
<CategoryTreePicker />     // Selezione gerarchica categorie
<TagCombobox />           // Input tag con auto-complete
<AIsuggestionBox />      // Mostra suggerimenti AI con accept/reject
<TagCloud />              // Visualizzazione tag più usati
<CategoryStats />         // Metriche per categoria
```

---

## 🎯 **Milestone Suggerite**

### **Milestone 1: Core Integration (1-2 settimane)**
- Connessione backend-frontend completa
- Form funzionanti per CRUD categorie/tag
- Tag nei form ticket

### **Milestone 2: Search & Filter (1 settimana)**
- Ricerca avanzata e filtri
- Tag selector nei form
- Miglioramenti UX

### **Milestone 3: AI Foundation (2-3 settimane)**
- Struttura base per AI suggestions
- Competenze agenti e routing
- Primi esperimenti NLP

### **Milestone 4: Intelligence (3-4 settimane)**
- Agent AI per categorizzazione
- Auto-generation tag
- Analytics e insights

---

## 📝 **Note di Implementazione**

### Priorità Immediate
1. **Testare il backend** - Verificare funzioni Convex con dati reali
2. **Collegare UI** - Far funzionare i form di creazione
3. **Tag nei ticket** - Implementare selezione tag nei form

### Considerazioni Tecniche
- **Performance**: Indicizzazione ottimale per ricerche tag
- **Scalabilità**: Gestione migliaia di tag per clinica
- **Consistenza**: Validazioni slug univoci e riferimenti
- **Migrazione**: Script per convertire tag esistenti in tickets

### Integrazione AI
- **Modello consigliato**: OpenAI GPT-4o-mini per classificazione
- **Embedding**: Sentence-transformers per similarità semantica
- **Feedback loop**: Tracciare accuracy suggerimenti per migliorare

---

*Documento aggiornato: 9 Gennaio 2025*

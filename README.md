# Abaddon Project - Healthcare Ticket System

**Heresy project against the system** 🔥

Sistema di gestione ticket altamente personalizzato per un network di cliniche sanitarie.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Convex (Backend-as-a-Service)
- **Database**: Convex Database (NoSQL)
- **Autenticazione**: Auth0
- **Real-time**: Convex Subscriptions

## 📋 Features

- ✅ Autenticazione tramite Auth0
- ✅ Gestione ruoli granulari (Utente, Agente, Admin)
- ✅ Sistema ticket con campi personalizzabili
- ✅ Dashboard personalizzate per ogni ruolo
- ✅ Automazioni avanzate (Trigger e Macro)
- ✅ Sistema SLA e notifiche
- ✅ Audit logging completo
- ✅ Scalabilità fino a 3000 utenti

## 🛠️ Setup Sviluppo

### Prerequisiti

- Node.js 18+
- npm o yarn

### Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Configura le variabili d'ambiente:
   ```bash
   cp .env.local.example .env.local
   ```
   
4. Configura Auth0:
   - Crea un'applicazione Auth0
   - Aggiorna le variabili AUTH0_* in .env.local

5. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

Questo comando avvierà sia Next.js che Convex in parallelo.

## 📁 Struttura Progetto

```
src/
├── app/                 # Next.js App Router
├── components/          # Componenti React
│   ├── ui/             # Componenti UI base
│   ├── layout/         # Componenti layout
│   └── features/       # Componenti specifici per feature
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── providers/          # Context providers
├── types/              # TypeScript types
└── constants/          # Costanti applicazione

convex/
├── schema.ts           # Schema database Convex
├── users.ts           # Functions per gestione utenti
├── tickets.ts         # Functions per gestione ticket
└── ...                # Altre functions Convex
```

## 🔧 Scripts Disponibili

- `npm run dev` - Avvia sviluppo (Next.js + Convex)
- `npm run build` - Build per produzione
- `npm run start` - Avvia server produzione
- `npm run lint` - Linting del codice
- `npm run format` - Formattazione con Prettier
- `npm run type-check` - Controllo tipi TypeScript

## 🌟 Branch Strategy

Il progetto è configurato per sviluppo in team:

- `main` - Branch principale (produzione)
- `develop` - Branch di sviluppo
- `feature/*` - Branch per nuove feature
- `bugfix/*` - Branch per correzioni
- `hotfix/*` - Branch per fix urgenti

## 📚 Documentazione

- [Specifiche Progetto](.kiro/specs/healthcare-ticket-system/)
- [Requirements](.kiro/specs/healthcare-ticket-system/requirements.md)
- [Design](.kiro/specs/healthcare-ticket-system/design.md)
- [Tasks](.kiro/specs/healthcare-ticket-system/tasks.md)

## 🤝 Contribuire

1. Crea un branch per la tua feature
2. Implementa le modifiche
3. Aggiungi test se necessario
4. Crea una Pull Request

## 📄 Licenza

Questo progetto è proprietario e riservato.

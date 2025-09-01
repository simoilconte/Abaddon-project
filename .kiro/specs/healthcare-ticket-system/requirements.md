# Requirements Document

## Introduction

Sistema di gestione ticket altamente personalizzato per un network di cliniche sanitarie. L'applicazione supporta tre ruoli principali (Utente, Agente, Admin) con autenticazione Auth0, gestione granulare dei permessi, automazioni avanzate tipo Zendesk, e architettura scalabile fino a 3000 utenti con oltre 1500 attivi contemporaneamente. Il sistema è progettato per essere modulare e integrabile con piattaforme esterne.

## Requirements

### Requirement 1

**User Story:** Come amministratore del sistema, voglio gestire l'autenticazione e i ruoli degli utenti in modo granulare, così da poter controllare l'accesso alle diverse funzionalità del sistema.

#### Acceptance Criteria

1. WHEN un utente accede al sistema THEN il sistema SHALL autenticare tramite Auth0
2. WHEN un admin crea un nuovo ruolo THEN il sistema SHALL permettere l'assegnazione di permessi granulari di lettura e scrittura per ogni sezione
3. WHEN un admin configura i ruoli THEN il sistema SHALL supportare i tre ruoli base: Utente, Agente, Admin
4. WHEN un admin gestisce gli agenti THEN il sistema SHALL permettere la differenziazione tra agenti senior e junior
5. IF l'integrazione API esterna è disponibile THEN il sistema SHALL importare cliniche e utenti automaticamente

### Requirement 2

**User Story:** Come utente di una clinica, voglio che i miei ticket siano organizzati per clinica e categoria, così da mantenere la privacy e l'organizzazione appropriata.

#### Acceptance Criteria

1. WHEN un utente crea un ticket THEN il sistema SHALL associarlo automaticamente alla sua clinica
2. WHEN un agente gestisce reparti e categorie THEN il sistema SHALL richiedere eventuale approvazione admin
3. WHEN si crea una categoria THEN il sistema SHALL permettere di impostarla come Pubblica o Privata
4. IF una categoria è Privata THEN il sistema SHALL renderla visibile solo all'autore
5. IF una categoria è Pubblica THEN il sistema SHALL renderla visibile a tutta la clinica

### Requirement 3

**User Story:** Come utente, voglio creare e gestire ticket con campi personalizzabili e allegati, così da poter descrivere accuratamente le mie richieste.

#### Acceptance Criteria

1. WHEN un utente crea un ticket THEN il sistema SHALL includere i campi base: titolo, descrizione, categoria, stato, creatore, assegnatario, clinica, visibilità
2. WHEN un agente aggiunge campi custom THEN il sistema SHALL richiedere eventuale approvazione admin
3. WHEN si gestisce un ticket THEN il sistema SHALL supportare gli stati: Nuovo, Aperto, In lavorazione, Risolto, Chiuso
4. WHEN un admin configura il sistema THEN il sistema SHALL permettere l'aggiunta di nuovi stati
5. WHEN un utente allega file THEN il sistema SHALL supportare allegati e tagging di altri utenti
6. IF l'utente è il creatore del ticket THEN il sistema SHALL permettere la modifica di titolo e descrizione
7. IF l'utente non è il creatore THEN il sistema SHALL impedire la modifica di titolo e descrizione

### Requirement 4

**User Story:** Come utente, voglio una dashboard personalizzata per visualizzare e gestire i miei ticket, così da avere una panoramica chiara del mio lavoro.

#### Acceptance Criteria

1. WHEN un utente accede alla dashboard THEN il sistema SHALL mostrare due pannelli: "I miei ticket" e "Ticket della mia clinica"
2. WHEN si visualizzano i ticket della clinica THEN il sistema SHALL mostrare solo quelli pubblici
3. WHEN un utente ordina i ticket THEN il sistema SHALL supportare ordinamento per alfabetico, data, stato, SLA
4. WHEN un utente cerca THEN il sistema SHALL permettere ricerca globale per numero, descrizione, oggetto, creatore
5. WHEN un utente accede alla sidebar THEN il sistema SHALL fornire accesso a Knowledge Base, creazione ticket, filtri salvati e impostazioni account

### Requirement 5

**User Story:** Come agente, voglio una dashboard avanzata per gestire i ticket assegnati e collaborare con il team, così da ottimizzare il mio workflow.

#### Acceptance Criteria

1. WHEN un agente accede alla dashboard THEN il sistema SHALL mostrare i ticket assegnati con evidenza SLA scaduti e in scadenza
2. WHEN un agente visualizza i ticket THEN il sistema SHALL fornire vista globale di tutti i ticket della clinica/organizzazione
3. WHEN un agente gestisce ticket THEN il sistema SHALL permettere cambio stato, categoria, riassegnazione, aggiunta commenti
4. WHEN un agente accede alla sidebar THEN il sistema SHALL fornire accesso a trigger, macro, pannello SLA, categorie, utenti
5. WHEN un agente visualizza i propri ticket THEN il sistema SHALL mostrare anche i ticket aperti dall'agente stesso

### Requirement 6

**User Story:** Come amministratore, voglio configurare automazioni avanzate per ottimizzare il workflow del team, così da ridurre il lavoro manuale ripetitivo.

#### Acceptance Criteria

1. WHEN un admin crea trigger THEN il sistema SHALL supportare condizioni complesse con logica AND/OR multi-condizione
2. WHEN un agente usa macro THEN il sistema SHALL eseguire azioni predefinite per aggiornare campi e inviare risposte
3. WHEN si configurano risposte automatiche THEN il sistema SHALL richiedere approvazione admin
4. WHEN si gestiscono automazioni THEN il sistema SHALL supportare stati: attivo/in attesa di approvazione
5. WHEN si assegnano ticket THEN il sistema SHALL supportare assegnazione manuale o automatica tramite trigger

### Requirement 7

**User Story:** Come amministratore, voglio un pannello di controllo completo per gestire utenti, configurazioni e monitorare le performance, così da mantenere il sistema efficiente.

#### Acceptance Criteria

1. WHEN un admin gestisce il sistema THEN il sistema SHALL fornire gestione utenti, ruoli, permessi
2. WHEN un admin configura SLA THEN il sistema SHALL permettere creazione e modifica di SLA personalizzati
3. WHEN un admin gestisce comunicazioni THEN il sistema SHALL permettere gestione template email personalizzabili
4. WHEN un admin supervisiona THEN il sistema SHALL richiedere approvazione per trigger, macro, categorie e campi custom
5. WHEN un admin visualizza statistiche THEN il sistema SHALL mostrare ticket per clinica, SLA rispettati/scaduti, carico per agente

### Requirement 8

**User Story:** Come utente del sistema, voglio ricevere notifiche tempestive e avere uno storico completo delle modifiche, così da rimanere sempre aggiornato.

#### Acceptance Criteria

1. WHEN si verifica un evento rilevante THEN il sistema SHALL inviare notifiche push e email
2. WHEN si personalizzano le comunicazioni THEN il sistema SHALL utilizzare template email personalizzabili
3. WHEN si modifica un ticket THEN il sistema SHALL registrare ogni modifica nell'audit log dettagliato
4. WHEN si visualizza lo storico THEN il sistema SHALL mostrare cronologia completa delle modifiche con timestamp e autore

### Requirement 9

**User Story:** Come stakeholder tecnico, voglio un sistema scalabile e performante che supporti crescita futura e integrazioni, così da garantire continuità operativa.

#### Acceptance Criteria

1. WHEN il sistema è in produzione THEN il sistema SHALL supportare fino a 3000 utenti totali
2. WHEN gli utenti sono attivi THEN il sistema SHALL gestire oltre 1500 utenti contemporaneamente senza degradazione performance
3. WHEN si sviluppano integrazioni THEN il sistema SHALL fornire architettura predisposta per API esterne
4. WHEN si accede da dispositivi diversi THEN il sistema SHALL essere completamente responsive
5. WHEN si scala il sistema THEN il sistema SHALL mantenere performance ottimali con backend e database ottimizzati
# HomeRisk AI

**Prezicem riscurile locuinței înainte să apară.**

SaaS complet, construit cu Next.js 15 (App Router), TypeScript, TailwindCSS, Framer
Motion, Supabase (Auth + PostgreSQL + Row Level Security) și Stripe. Gata de deploy pe
Vercel.

## 1. Configurare Supabase

1. Creează un proiect nou pe [supabase.com](https://supabase.com).
2. În **SQL Editor**, rulează în ordine fișierele din `supabase/migrations/`:
   - `0001_init.sql` — toate tabelele, indexurile, trigger-ul de auto-creare profil și
     politicile de Row Level Security.
   - `0002_rpc_helpers.sql` — funcțiile `log_activity` și `mark_notification_read`.
   - `0003_profile_extras.sql` — coloanele `phone`/`address`/`notify_email` și bucket-ul
     Storage `avatars` (upload de poză de profil), cu RLS pe `storage.objects`.
   - `0004_risk_results_upsert_fix.sql` — politică RLS lipsă, descoperită în auditul de
     verificare Supabase (vezi „Ce s-a verificat și corectat” mai jos).
3. În **Authentication → URL Configuration**, setează:
   - Site URL: `http://localhost:3000` (sau domeniul de producție)
   - Redirect URLs: `http://localhost:3000/auth/callback`, `.../update-password`
4. Copiază `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` și
   `SUPABASE_SERVICE_ROLE_KEY` din **Project Settings → API**.

## 2. Configurare Stripe (opțional — aplicația funcționează și fără)

1. Creează un produs „HomeRisk AI Premium” cu un preț recurent lunar în Stripe Dashboard.
2. Copiază `price_id`-ul în `STRIPE_PREMIUM_PRICE_ID`.
3. Copiază cheia secretă în `STRIPE_SECRET_KEY` și cea publică în
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Creează un webhook îndreptat spre `<domeniul-tău>/api/stripe/webhook`, cu evenimentele:
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
5. Copiază secretul webhook-ului în `STRIPE_WEBHOOK_SECRET`.
6. Activează **Customer Portal** în Stripe Dashboard (Settings → Billing → Customer
   portal) — folosit de butonul „Gestionează abonamentul”.

Fără acești pași, `/premium` și `/api/stripe/*` rămân dormante (răspund 503) — restul
aplicației funcționează normal.

## 3. Configurare locală

```bash
cp .env.example .env.local
# completează .env.local cu valorile din Supabase (și Stripe, dacă îl activezi)

npm install
npm run dev
```

Aplicația pornește pe `http://localhost:3000`.

```bash
npm run build       # build de producție
npm run start       # rulează build-ul
npm run type-check  # verificare TypeScript, fără emitere
```

## 4. Deploy pe Vercel

1. Conectează repo-ul în Vercel.
2. Adaugă aceleași variabile de mediu din `.env.local` în **Project Settings → Environment
   Variables** (inclusiv `SUPABASE_SERVICE_ROLE_KEY` și `STRIPE_SECRET_KEY`, marcate
   doar pentru mediul server).
3. Setează `NEXT_PUBLIC_SITE_URL` la domeniul de producție, actualizează Redirect URLs
   în Supabase și endpoint-ul webhook-ului în Stripe.
4. Deploy. `middleware.ts` protejează automat toate rutele autentificate.

## Structura proiectului

```
app/
  (marketing)/           Landing, prețuri, autentificare — layout cu Navbar public
  (app)/                 Dashboard, Evaluare, Istoric, Profil, Setări, Premium —
                          layout comun cu Sidebar + Header (app/(app)/layout.tsx)
  api/
    stripe/checkout/      Creează o sesiune Stripe Checkout
    stripe/portal/        Creează o sesiune Customer Portal
    stripe/webhook/       Sincronizează abonamentul + plățile cu Supabase
    account/delete/       Șterge contul (Auth Admin API)
    reports/pdf/           Generează raportul PDF (Premium)
  robots.ts, sitemap.ts  SEO
  error.tsx, not-found.tsx, global-error.tsx, loading.tsx

components/
  ui/                    Primitive (Button, Card, Input, Avatar, ScoreGauge, Skeleton...)
  layout/                Navbar (public), Sidebar + AppHeader (aplicație)
  providers/             UserProvider — o singură subscripție Supabase, partajată
                          prin context de toate paginile autentificate
  landing/, auth/, assessment/, dashboard/, profile/, settings/

lib/
  supabase/              Clienți Supabase (browser, server, admin, middleware)
  stripe/                Client Stripe (inert fără chei configurate)
  pdf/                   Componenta React-PDF a raportului
  validation/            Scheme Zod
  risk-engine.ts         Motorul HomeRisk (nemodificat pe tot parcursul proiectului)
  env.ts                 Validare variabile de mediu (Zod)

services/                Singurul strat care vorbește cu Supabase/Stripe
  auth, profile, assessment, subscription, notification, activity

types/                   domain.ts (motorul HomeRisk), database.ts (schema SQL)

supabase/migrations/     Schema SQL completă + RLS + funcții RPC + Storage
middleware.ts            Protecția rutelor + refresh de sesiune
```

## Ce este complet funcțional

- **Autentificare**: înregistrare, confirmare email, login, logout, resetare parolă,
  protecția rutelor prin middleware, redirect automat la `/dashboard` după login.
- **Profil**: creat automat la înregistrare, avatar cu upload real (Supabase Storage,
  fallback pe inițiale), nume, telefon, adresă, preferințe de notificare.
- **Evaluare + Dashboard**: cele 54 de întrebări, motorul HomeRisk și rezultatele
  salvate în PostgreSQL cu RLS.
- **Istoric** complet, separat de preview-ul din dashboard.
- **Setări**: schimbare parolă, notificări, abonament, ștergere cont (ireversibilă,
  cu confirmare explicită).
- **Stripe**: Checkout, Customer Portal, upgrade/downgrade/anulare, sincronizare
  completă a `subscriptions` și `payments` prin webhook — nimic hardcodat, totul
  configurabil prin `.env`.
- **Export PDF**: raport de marcă (scor, grafic, toate recomandările, cost estimativ,
  priorități, data evaluării), generat server-side, disponibil pentru utilizatorii
  Premium.
- **Notificări în-app**, cu alertă automată la risc ridicat/critic.

## Ce este pregătit ca arhitectură, dar dezactivat intenționat

- **Email/push pentru notificări**: doar tabela + inserarea în DB există; trimiterea
  efectivă (Resend, un cron Supabase) e următorul pas.
- **"Ține-mă minte"** la login reflectă intenția utilizatorului; Supabase păstrează
  deja sesiunea printr-un refresh token cu viață lungă — un mod „doar pentru sesiune"
  e un punct de extensie viitor.

## Ce s-a verificat și corectat (audit Supabase + QA)

Nu am avut acces la un proiect Supabase live în acest mediu de lucru — verificarea de
mai jos e o citire statică riguroasă a schemei, politicilor și codului care le
folosește, nu o rulare efectivă. Recomand testarea manuală cu 2+ conturi reale înainte
de lansare. Ce am găsit și corectat pe parcurs:

- **RLS**: `risk_results` avea politică de INSERT dar nu și de UPDATE — upsert-ul
  folosit la reîncercarea salvării unei evaluări ar fi eșuat silențios la a doua
  încercare. Corectat în `0004_risk_results_upsert_fix.sql`.
- **Stripe**: `checkout.session.completed` nu stampila `metadata.userId` pe obiectul
  Subscription din Stripe — evenimentele ulterioare (anulare, downgrade) nu ar fi putut
  identifica userul. Corectat în `app/api/stripe/checkout/route.ts`.
- **Variabile de mediu**: `STRIPE_PREMIUM_PRICE_ID` nu era validat de `lib/env.ts`.
- **Middleware**: `/istoric`, `/setari`, `/premium` lipseau din rutele protejate —
  ar fi fost accesibile neautentificat.
- **"server-only" bundlat în client**: `services/assessment.service.ts` și
  `services/notification.service.ts` amestecau funcții sigure pentru client cu funcții
  care foloseau clientul admin (`createAdminClient`, din `lib/supabase/server.ts`,
  marcat `"server-only"`). Cum `hooks/useAssessment.ts` (Client Component) importa
  din același fișier, Next.js refuza build-ul. Corectat prin separarea codului
  server-only în fișiere noi (`services/assessment-complete.service.ts`,
  `services/notification-alerts.service.ts`, ambele cu `import "server-only"`
  explicit) și mutarea finalizării unei evaluări într-o rută API
  (`app/api/assessments/[assessmentId]/complete/route.ts`) — comportamentul rămâne
  identic, doar scrierea în `notifications` rulează acum garantat server-side.
- **Cod mort**: `types/auth.ts` (tipuri pentru un pattern de Server Actions neadoptat
  niciodată) — eliminat.

## Securitate

- Row Level Security activat pe toate tabelele, inclusiv `storage.objects` (bucket-ul
  `avatars`: citire publică, scriere doar în propriul folder).
- `subscriptions`, `payments` și `notifications` nu au politici de INSERT pentru
  client — scrise exclusiv server-side (client admin / webhook Stripe verificat prin
  semnătură).
- Ștergerea contului trece prin Auth Admin API (necesită service role), niciodată
  direct din client.
- Variabilele de mediu sunt validate cu Zod — o cheie lipsă produce un mesaj clar.
- `SUPABASE_SERVICE_ROLE_KEY` nu este niciodată importată în cod client (`import
  "server-only"` pe fișierele care o folosesc).

## Stack tehnic

- **Next.js 15** (App Router) + **React 19**
- **TailwindCSS** — design system neschimbat pe tot parcursul proiectului
- **Framer Motion** — animații (inclusiv sidebar-ul cu pastilă activă animată)
- **Supabase** — Auth + PostgreSQL + Row Level Security + Storage
- **Stripe** — Checkout, Customer Portal, webhook
- **@react-pdf/renderer** — generare PDF server-side
- **Zod** — validare formulare și variabile de mediu
- **TypeScript** strict pe tot proiectul

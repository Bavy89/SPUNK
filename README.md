# SPUNK — Villekulla Ungdomsteater

Intern oversiktsapp for Villekulla Ungdomsteater. Appen gir administratorer og foresatte én felles plass for øvelsesplaner, rollefordeling, forestillingsdatoer og barneoversikt.

---

## Hva er SPUNK?

SPUNK er en PWA (Progressive Web App) bygget for Villekulla Ungdomsteater. Den erstatter Excel-ark og manuell kommunikasjon med et enkelt grensesnitt der:

- **Administratorer** kan administrere produksjoner, karakterer, barn, grupper og hendelser
- **Foresatte og barn** kan logge inn og se sin egen øvelsesplan, roller og forestillingsdatoer
- **Nye brukere** søker om tilgang — admin godkjenner med ett klikk

---

## Funksjoner

- **Dashboard** — oversikt over neste øvelse og kommende hendelser
- **Oversikt** — alle hendelser gruppert per uke med produksjonsfilter
- **Barneprofil** — klikk på et barn for å se gruppe, roller og alle relevante øvelser/forestillinger
- **Admin-panel** — CRUD for produksjoner, karakterer, barn, grupper og hendelser
- **Brukerhåndtering** — godkjenn eller fjern tilgang med ett klikk (bygget for ~500 brukere)
- **Signup-flyt** — nye brukere venter på godkjenning, admin får e-postvarsel via Resend
- **PWA** — kan installeres på telefon som en vanlig app

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database & Auth | Supabase (Postgres, RLS, Auth) — `villekulla` schema |
| UI | shadcn/ui + Tailwind CSS v4 |
| Server Actions | next-safe-action + Zod |
| E-post | Resend |
| Monorepo | Turborepo + pnpm workspaces |

---

## Kom i gang

```bash
pnpm install
```

Kopier og fyll inn miljøvariabler i `apps/web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM=SPUNK <din@epost.no>
ADMIN_EMAIL=din@epost.no
```

Start dev-server:

```bash
pnpm dev
# → http://localhost:3000
```

---

## Struktur

```
apps/
  web/                  # Next.js-appen (SPUNK)
  database/             # Supabase-migrasjoner (villekulla schema)
packages/
  typescript-config/    # Delt tsconfig
```

---

Laget av [Skapweb](https://skapweb.no) for Villekulla Ungdomsteater.

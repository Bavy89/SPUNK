# Instruksjon til AI-agent: Øvingsplan/rolleoversikt-app

> Denne filen er skrevet for deg (AI-koding-agenten, f.eks. Claude Code) som
> jobber videre i repoet klonet fra
> `imbhargav5/nextbase-nextjs-supabase-starter`. Les hele filen før du
> begynner å endre kode. Følg konvensjonene i det eksisterende repoet
> (mappestruktur, `data/anon|auth|user`, `authActionClient`,
> `supabase-clients/*`, Zod-schemas) i stedet for å finne opp nye mønstre.

## 1. Hva appen skal gjøre (domenet)

Dette er en oversikt for foreldre og produksjonsledere i et barne-/ungdomsteater
(og tilstøtende aktiviteter som kor). Kildedataene (Excel/PDF fra en ekte
oppsetning, "Trollmannen fra Oz") viser at domenet har disse egenskapene —
dette er ikke valgfritt, det er kravene:

1. **Flere produksjoner/aktiviteter samtidig.** Samme barn kan være med i både
   en teateroppsetning og et kor. Alt skal modelleres under en felles
   `productions`-tabell, ikke hardkodes til én oppsetning.
2. **Rolle ≠ barn 1:1.** En rolle (`character`) kan spilles av flere barn
   (cast A/B/C), og hvem som faktisk spiller rollen varierer **per
   forestillingsdato** (se `performance_casts`).
3. **Grupper/partier.** Barneteater er delt i faste grupper (f.eks.
   "Røverunger" mandager, "Rakkerunger" onsdager) som kalles inn samlet,
   uavhengig av hvilken rolle enkeltbarnet har.
4. **Hendelser (øvelser/forestillinger) kaller inn en kombinasjon av**:
   spesifikke roller/karakterer, hele grupper, og/eller enkeltbarn direkte
   (unntakstilfeller, f.eks. "Frøken Gultch kan møte 19.30").
5. **Foreldre skal se to ting**: (a) hele fellesoversikten (alle øvelser/
   forestillinger, som i dag på papir), og (b) en personlig, utledet kalender
   for et valgt barn — regnet ut av systemet, ikke skrevet manuelt.
6. **Admin (produksjonsleder) er den eneste som skriver.** Foreldre har kun
   lesetilgang, men til *alt* (delt oversikt), ikke bare sitt eget barn.

Full bakgrunnsplan (med resonnement) finnes i `docs/theater-domain-plan.md`
— kopier README-innholdet under dit hvis det ikke allerede ligger der.

## 2. Hvordan dette mappes til nextbase-strukturen

Følg eksisterende mønster i repoet — ikke lag nye lag.

```
apps/
  database/
    supabase/
      migrations/
        <timestamp>_theater_core_schema.sql     # tabeller
        <timestamp>_theater_rls_policies.sql     # RLS + is_admin()
      seed.sql                                   # (valgfritt) test-data
  web/
    src/
      app/
        (app-pages)/
          dashboard/                    # behold evt. som "forsiden etter innlogging"
          oversikt/                     # NY: full fellesoversikt (alle events)
            page.tsx
          barn/
            [childId]/
              page.tsx                  # NY: personlig kalender for valgt barn
          admin/
            produksjoner/
            karakterer/
            barn/
            grupper/
            hendelser/
            casting/
            forestillinger/
        (auth-pages)/                   # BRUK SOM DEN ER (login/signup/magic-link)
      data/
        anon/                           # ev. offentlig landingsside-data (ikke i bruk her)
        auth/                           # BRUK SOM DEN ER
        user/
          theater/
            get-child-schedule.ts       # spør mot child_schedule-viewet
            get-full-overview.ts        # alle events for en produksjon
            get-children-for-user.ts    # foreldrens barn (guardians)
      rsc-data/
        theater/
          get-production-detail.ts
      lib/
        safe-action.ts                  # BRUK actionClient / authActionClient som de er
      utils/
        zod-schemas/
          theater.ts                    # Zod-schemas for events, castings, osv.
      components/
        theater/
          ChildSwitcher.tsx
          EventList.tsx
          EventCard.tsx
          PerformanceCastBadge.tsx
          CastingTable.tsx
```

Behold `private-item`-eksemplet i repoet som referanse til mønsteret
(server action + Zod + RLS-beskyttet tabell) helt til du er ferdig, fjern det
deretter hvis det ikke lenger trengs.

## 3. Databasemigrasjoner

To migrasjonsfiler er skrevet ferdig og ligger ved siden av denne filen i
`migrations/`:

1. `TIMESTAMP_theater_core_schema.sql` — alle tabeller + `child_schedule`-view
   + `child_performance_roles`-view.
2. `TIMESTAMP_theater_rls_policies.sql` — RLS på alle tabeller, `is_admin()`
   hjelpefunksjon, og trigger som oppretter `profiles`-rad ved signup
   (dropp denne triggeren hvis `profiles` allerede finnes i repoet fra før —
   sjekk `apps/database/supabase/migrations/` for eksisterende
   `profiles`-tabell før du kjører, og slå heller sammen `is_admin`-kolonnen
   inn i den eksisterende `profiles`-migrasjonen).

**Før du kjører migrasjonene:**
- Gi filene ekte timestamp-prefiks i riktig kronologisk rekkefølge etter de
  som allerede finnes i mappa (f.eks. `20260901120000_...`,
  `20260901120100_...`).
- Sjekk om repoet allerede har en `profiles`-tabell fra starteren. Hvis ja:
  ikke lag en ny — legg heller til `is_admin boolean not null default false`
  i den eksisterende via en `ALTER TABLE`-migrasjon, og fjern
  `create table profiles` + triggeren fra `theater_core_schema.sql`.
- Kjør deretter: `pnpm database#start` (lokalt) eller
  `pnpm supabase db push` (hosted), så `pnpm gen-types-local` /
  `pnpm gen-types`.

## 4. Rekkefølge du bør jobbe i

1. **Migrasjoner + typer.** Kjør migrasjonene, generer typer, verifiser i
   Supabase Studio at alle tabeller + policies ligger der.
2. **Sett deg selv som admin.** Sett `is_admin = true` på din egen
   `profiles`-rad manuelt i Supabase Studio (ikke bygg UI for dette ennå).
3. **`data/user/theater/*`-spørringer** mot de nye tabellene/viewene, typet
   med `database.types.ts`.
4. **Admin-CRUD (server actions + skjemaer)** i denne rekkefølgen, siden hver
   avhenger av forrige: `productions` → `characters` → `children` →
   `castings` → `groups`/`child_groups` → `scenes`/`scene_characters` →
   `events` (+ `event_characters`/`event_groups`/`event_children`) →
   `performance_casts`.
5. **Fellesoversikt** (`/oversikt`): liste/kalender over `events`, filtrerbar
   på `production_id`.
6. **Barnevelger + personlig kalender** (`/barn/[childId]`): hent
   `guardians` for innlogget bruker → dropdown → spør `child_schedule`-viewet
   for valgt `childId`, sortert på `starts_at`. Vis også
   `child_performance_roles` når `type = 'performance'` slik at man ser
   *hvilken rolle nettopp dette barnet spiller den dagen*.
7. **Import av eksisterende data.** Skriv ett engangsskript
   (`scripts/import-theater-data.ts`) som leser strukturerte JSON-filer du
   selv fyller ut manuelt (ikke prøv å Excel-parse fritekst automatisk — det
   er ikke verdt det). Bruk service-role-klienten kun i dette skriptet, aldri
   i appkoden.

## 5. Ting agenten IKKE skal gjøre uten å spørre

- Ikke fjern eller svekk eksisterende RLS-policyer fra starteren.
- Ikke legg service-role-nøkkelen i noe som bundles til klienten.
- Ikke bygg en generisk Excel-opplastings-/parsing-funksjon i UI-et i første
  runde — det er et v2-scope, ikke MVP.
- Ikke fjern Playwright/Vitest-oppsettet; legg heller til tester for de nye
  server actions og RLS-policyene etter hvert (pgTAP for RLS er allerede
  scaffoldet i repoet under `apps/database/supabase/tests`).

## 6. Definisjon av "ferdig" for MVP

- En admin-bruker kan logge inn og opprette en produksjon, karakterer, barn,
  casting, grupper, scener og hendelser gjennom UI (ikke SQL for hånd).
- En forelder-bruker kan logge inn, se full fellesoversikt, velge et av sine
  barn, og se en korrekt, kronologisk, personlig liste over hva akkurat det
  barnet er innkalt til — inkludert riktig rolle på forestillingsdager.
- Alt er RLS-beskyttet: en forelder kan ikke skrive til noen tabell, og kan
  ikke se `guardians`-rader som ikke er deres egne.

# E-handel – Inlämningsuppgift 1, Integration med tredjepartssystem (FSU25D)

[Uppgiftsbeskrivning](docs/assignment-description.md) | [Driftsatt applikation](https://sailtell-shop.vercel.app)

*Oscar Nilsson*  
*oscar.nilsson@medieinstitutet.se*  
[GitHub](https://github.com/niloscar) | [LinkedIn](https://www.linkedin.com/in/oscar-nilsson1) | [Portfolio](https://oscarnilsson.dev/?ref=assignment)

## Integrera shoppen med omvärlden

Projektet bygger vidare på en befintlig e-handelsapplikation med fem integrationer: produktimport via Sibars, sökning med Algolia, betalning med Stripe, bildlagring i Supabase Storage och fraktinformation från PostNord.

## Kom igång

### Installation

Installera beroenden från projektets rot:

```bash
npm install
```

Skapa `backend/.env` utifrån `backend/.env.example` och fyll i databasuppgifter och miljövariabler för integrationerna.

### Starta applikationen

Starta backend och frontend från projektets rot:

```bash
npm run dev
```

### Testning

Integrationerna kan testas i den [driftsatta applikationen](https://sailtell-shop.vercel.app) eller lokalt med respektive tjänsts testkonfiguration. För lokala Stripe-webhooks används Stripe CLI.

**Administratörskonto**

- Inloggning: https://sailtell-shop.vercel.app/admin
- E-post: `admin@test.se`
- Lösenord: `admin`

## Integrationsarkitektur

React kommunicerar med Express, som hanterar externa tjänster genom separata adaptrar. Dessa ansvarar för API-anrop, autentisering och anpassning av externa dataformat. Inkommande data valideras innan den används.

## Reflektion

### Labb 1 – Import av produktdata (Sibars produkt-API)

Produktimporten använder CSV och XML som hämtas via leverantörens API. En adapter tolkar filerna och validerar produkterna med Zod innan de sparas i PostgreSQL. Upsert används för att uppdatera befintliga produkter utan att skapa dubbletter.

Integrationen gör att produktinformation kan hämtas och uppdateras utan manuell registrering. Anropen hanteras i Express för att skydda API-nyckeln. Timeout och felhantering begränsar problem vid driftstörningar, och ogiltiga produkter hoppas över och redovisas i en importrapport. Om API:et är otillgängligt finns redan importerade produkter kvar.

Beroendet av leverantörens filformat innebär att adaptern kan behöva ändras om formatet förändras.

### Labb 2 – Sök-API (Algolia)

Produkterna indexeras i Algolia via ett REST-baserat API. Sökningar går genom Express, medan PostgreSQL fortfarande är den huvudsakliga datakällan.

Algolia erbjuder bland annat relevansrankning och stavfelstolerans. Att utveckla motsvarande sökfunktion själv skulle kräva betydligt mer arbete med indexering och söklogik.

Om Algolia är otillgängligt fungerar inte sökningen, men produkterna finns kvar i databasen och kan visas på andra sätt. En risk är att förändrade priser eller villkor hos Algolia påverkar lösningen.

### Labb 3 – Betalning (Stripe)

Betalningen använder Stripe Checkout och en signerad webhook som bekräftar betalningen. Express skapar betalningssessionen och hanterar webhooken, som uppdaterar orderstatus och lagersaldo.

Stripe gör att shoppen slipper hantera kortuppgifter och utveckla ett eget betalningssystem. Det minskar både arbetsinsatsen och säkerhetskraven jämfört med en egen lösning.

Betalningsbeloppet beräknas i backend. Om Stripe är otillgängligt kan betalningen inte slutföras, men ordern finns kvar i databasen. Integrationen innebär också ett beroende av Stripes avgifter och tillgänglighet.

### Labb 4 – Produktbilder i molnlagring (Supabase Storage)

Produktbilder laddas upp till Supabase Storage via backend, medan databasen sparar bildreferenser.

Molnlagring ersätter behovet av egen fillagring och tillhörande infrastruktur. Om Supabase är otillgängligt kan bilduppladdning misslyckas och befintliga bilder bli tillfälligt otillgängliga, medan produktinformationen finns kvar.

En risk är beroendet av tjänstens tillgänglighet och lagringsvillkor.

### Labb 5 – Frakt (PostNord)

PostNords REST-API används för att hämta närliggande ombud och beräknade leveranstider. Svaren valideras med Zod och omvandlas till interna datamodeller.

Integrationen gör att shoppen slipper underhålla ett eget ombudsregister. Fraktpriserna hanteras separat i backend, inklusive fri frakt från 500 kr. Vald fraktmetod och eventuellt ombud sparas på ordern, och fraktkostnaden inkluderas i Stripe Checkout.

Om PostNords API inte svarar kan kunden fortfarande välja hemleverans. Timeout och felhantering begränsar påverkan på kassan. Förändringar i PostNords API kan kräva anpassningar av integrationen.

## AI-användning – Labb 5

Jag använde GitHub Copilot i VS Code för PostNord-integrationen, bland annat för API-anrop, Zod-validering och kopplingen till checkout.

Exempel på prompt:

> Skriv en adapter i vår Express-backend som hämtar de närmaste PostNord-ombuden för ett svenskt postnummer. Validera API-svaret med Zod och hantera timeout och fel.

Copilot föreslog först en felaktig endpoint för leveranstider. Efter kontroll mot PostNords dokumentation ändrades den till `/transport/v2/transittime/addresstoaddress`.

Integrationen testades mot PostNords sandbox. Agentens åtkomst begränsades och `.env` skyddades.

## Tech stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Databas:** PostgreSQL
- **Integrationer:** Sibars, Algolia, Stripe, Supabase Storage, PostNord
- **Verktyg:** npm, Git, GitHub, Zod, ESLint, Prettier, GitHub Copilot

## Projektstruktur

Projektet är organiserat som ett monorepo med npm workspaces.

```text
.
├── backend/
│   └── src/
│       ├── controllers/
│       ├── integrations/
│       ├── lib/
│       ├── middleware/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── utilities/
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── contexts/
│       ├── layouts/
│       ├── pages/
│       ├── types/
│       └── utilities/
├── shared/
│   └── src/
├── docs/
├── package.json
├── vercel.json
└── README.md
```

Backendens adaptrar hanterar externa tjänster, services innehåller affärslogik och `@shop/shared` delar typer och konstanter mellan frontend och backend.

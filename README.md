# E-handel – Integration med tredjepartssystem (FSU25D)

**Uppgiftsbeskrivningar**  
[Uppgift 1 (Tredjepartsintegrationer)](docs/assignment-1-description.md)  
[Uppgift 2 (Konton och autentisering)](docs/assignment-2-description.md)

**Driftsatt applikation**  
[SailTell Shop](https://sailtell-shop.vercel.app)

*Oscar Nilsson*  
*oscar.nilsson@medieinstitutet.se*  
[GitHub](https://github.com/niloscar) | [LinkedIn](https://www.linkedin.com/in/oscar-nilsson1) | [Portfolio](https://oscarnilsson.dev/?ref=assignment)

## Om projektet

Projektet bygger vidare på en befintlig e-handelsapplikation och omfattar två inlämningsuppgifter i kursen Integration med tredjepartssystem.

Samtliga externa integrationer hanteras i Express-backend, medan React ansvarar för användargränssnittet. API-nycklar och andra hemligheter hålls på servern, där externa svar valideras och fel hanteras. Separata adaptrar begränsar beroendet av respektive tjänsts API.

### Uppgift 1 – Integrera shoppen med omvärlden

Den första uppgiften omfattar fem integrationer: produktimport via Sibars special-API, sökning med Algolia, betalning med Stripe, bildlagring i Supabase Storage och fraktinformation från PostNord.

### Uppgift 2 – Konton och autentisering

Den andra uppgiften utökar shoppen med kundinloggning via Google, admininloggning via GitHub och orderbekräftelser via e-post. För VG tillkommer möjligheten att skapa och visa GitHub-issues från adminsidan med en separat token för shoppens repository.

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

**Administration:** https://sailtell-shop.vercel.app/admin

Uppgifter till testkonton och administratörsåtkomst lämnas vid inlämning.

## Uppgift 1 – Reflektion

### Labb 1 – Import av produktdata (Sibars special-API)

Produktimporten kombinerar REST och filbaserad integration. Leverantörens CSV- och XML-filer hämtas via API:et, valideras med Zod och sparas i PostgreSQL. Upsert används för att uppdatera befintliga produkter utan att skapa dubbletter.

Integrationen ersätter manuell registrering och uppdatering av produktinformation. Om leverantörens API är otillgängligt kan ingen import genomföras, men befintliga produkter finns kvar. Ogiltiga produkter hoppas över och redovisas i en importrapport.

### Labb 2 – Sök-API (Algolia)

Sökfunktionen använder Algolias API och SDK för indexering och sökning. Produkterna skickas till ett separat sökindex, medan PostgreSQL är den huvudsakliga datakällan. Algolia erbjuder bland annat relevansrankning och stavfelstolerans, vilket skulle kräva betydligt mer arbete att bygga själv.

Om Algolia är otillgängligt fungerar inte den externa sökningen, men produkterna finns kvar i databasen och kan fortfarande visas genom shoppens ordinarie produktlistor.

### Labb 3 – Betalning (Stripe)

Betalningen kombinerar REST, redirect och webhook. Express skapar en Stripe Checkout-session och kunden skickas vidare till Stripes betalningssida. En signerad webhook bekräftar betalningen och uppdaterar orderstatus och lagersaldo, även om kunden inte återvänder till shoppen.

Stripe innebär att shoppen slipper hantera kortuppgifter och utveckla ett eget betalningssystem, med de säkerhetskrav det skulle medföra.

Beloppen beräknas i backend och ordern markeras inte som betald förrän en verifierad betalningsbekräftelse har mottagits. Om Stripe är otillgängligt kan betalningen inte slutföras, men orderuppgifterna finns kvar.

### Labb 4 – Produktbilder i molnlagring (Supabase Storage)

Produktbilder lagras i Supabase Storage, medan PostgreSQL innehåller referenser till bilderna. Integrationen separerar fillagringen från produktinformationen och ersätter behovet av egen filserver och lagringsinfrastruktur.

Om Supabase är otillgängligt kan uppladdning, byte och visning av bilder påverkas, men produktinformationen finns kvar i databasen. En långsiktig risk är ökade lagringskostnader när mängden bilder växer.

### Labb 5 – Frakt (PostNord)

Fraktintegrationen använder REST för att hämta närliggande ombud och beräknade leveranstider utifrån kundens postnummer. Svaren valideras med Zod och omvandlas till interna datamodeller.

PostNord tillhandahåller information som annars skulle kräva ett eget, kontinuerligt uppdaterat register. Fraktpriserna hanteras däremot i shoppens backend, med fasta priser och fri frakt från 500 kr. Vald leveransmetod, kostnad och eventuellt ombud sparas på ordern och inkluderas i Stripe Checkout.

Om PostNords API inte svarar kan kunden fortfarande välja hemleverans och genomföra köpet.

#### AI-användning

Jag använde GitHub Copilot i VS Code för den här labben, bland annat för API-anrop, Zod-validering och kopplingen till checkout.

Exempel på prompt:

> Skriv en adapter i vår Express-backend som hämtar de närmaste PostNord-ombuden för ett svenskt postnummer. Validera API-svaret med Zod och hantera timeout och fel.

Copilot föreslog först en felaktig endpoint för leveranstider. Efter kontroll mot PostNords dokumentation ändrades den till `/transport/v2/transittime/addresstoaddress`.

Integrationen testades mot PostNords sandbox.

## Uppgift 2 – Konton och autentisering

### Labb 6 – Kundinloggning (Google)

Kundinloggningen använder Google OAuth 2.0 och OpenID Connect.

Användaren identifieras genom Googles unika `sub`, som sparas i databasen. Vid första inloggningen skapas ett kundkonto och vid efterföljande inloggningar används samma konto. Om e-postadressen redan tillhör ett konto med lösenordsinloggning avvisas Google-inloggningen. Kontona kopplas inte ihop automatiskt eftersom e-postadressen inte används som identitetsnyckel.

Inloggade kunders beställningar kopplas till deras användar-ID. Mina sidor visar endast kundens egna ordrar genom en skyddad endpoint. Gästköp fungerar fortfarande utan användarkoppling.

### Labb 7 – Admininloggning och ärenden (GitHub)

Admininloggningen använder GitHub OAuth 2.0. Endast användare i `ADMIN_GITHUB_LOGINS` med ett kopplat adminkonto i PostgreSQL får logga in. Kontot identifieras genom GitHubs numeriska användar-ID och shoppens befintliga sessionshantering används. Adminroutes skyddas med behörighetskontroll på servern.

Administratören kan skapa och lista GitHub-issues från adminpanelen. Ärendena skapas med en separat token med begränsade behörigheter och innehåller administratörens GitHub-användarnamn i beskrivningen. API-routes kräver adminbehörighet, och fel från GitHub hanteras med begripliga felmeddelanden.

### Labb 8 – E-post (Resend)

Orderbekräftelser skickas via Resend när Stripe-webhooken har markerat ordern som betald. Backend hämtar order- och kunduppgifter och bygger ett mail med ordernummer, kundens namn, produkter med antal och priser, frakt och totalsumma. Mailet innehåller både HTML och ren text, där användargenererat innehåll escapas för HTML.

För att undvika dubbla utskick behandlas bara ordrar som väntar på betalning, och varje mail får en idempotensnyckel knuten till ordernumret. Fel från Resend loggas utan att påverka orderstatusen eller få webhooken att svara med `500`.

Integrationen har testats i den deployade shoppen med lyckade utskick och omsändning av samma Stripe-webhook utan ytterligare mail.

### Redogörelse för autentisering

#### Inloggningsflöde

Både Google- och GitHub-inloggningen använder OAuth 2.0 med `state` och PKCE. När användaren påbörjar inloggningen skapar backend ett slumpmässigt `state` och en `code_verifier`, som sparas i sessionen. Användaren skickas sedan till respektive tjänst med `state` och en `code_challenge`.

Efter inloggningen kontrollerar backend att `state` matchar och inte har gått ut innan auktoriseringskoden byts mot tokens med hjälp av `code_verifier`. `state` skyddar mot att obehöriga autentiseringsflöden kopplas till sessionen, medan PKCE försvårar användning av en uppfångad auktoriseringskod.

Google-användaren identifieras genom ID-tokenen, medan GitHub-användaren hämtas via GitHubs API. Vid GitHub-inloggning kontrolleras även tillåtelselistan och administratörsbehörigheten innan en session skapas.

#### Tokens

Google returnerar bland annat en ID-token och en access token. Shoppen använder ID-token för att identifiera användaren och kontrollerar `iss`, `aud`, `exp` samt nödvändiga användaruppgifter. Tokenens giltighetstid bestäms av Google och kontrolleras via `exp`.

ID-token avkodas men signaturen verifieras inte kryptografiskt. Eftersom tokenen hämtas direkt från Googles HTTPS-endpoint begränsas risken, men signaturverifiering skulle ge ett ytterligare skydd.

GitHub returnerar en access token som används för att hämta användarens profil med behörigheten `read:user`. Tokenen sparas inte efter inloggningen.

För GitHub Issues används en separat fine-grained personal access token, begränsad till `Issues: Read and write` i shoppens repository. Den lagras på servern och behöver förnyas manuellt när den löper ut.

OAuth-tokens används inte efter att användaren identifierats och ingen refresh token begärs. Client secrets finns endast på servern.

#### Session eller JWT

Jag valde att fortsätta använda `express-session` med PostgreSQL som sessionslager, eftersom sessionshantering redan fanns implementerad i applikationen. Samma lösning används för både Google- och GitHub-inloggning.

Efter inloggningen sparas användar-ID i sessionen och webbläsaren får en `httpOnly`-cookie med `sameSite: 'lax'` och en timmes giltighetstid. I produktion används även `secure`. Vid GitHub-inloggning sparas också användarnamnet i sessionen för att identifiera administratören som skapar ett ärende.

När sessionen inte längre är giltig hanterar frontend `401` från skyddade API-anrop och skickar användaren till inloggningssidan.

En JWT-lösning med access- och refresh tokens skulle kunna minska behovet av databasuppslag vid hög trafik, men hade inneburit mer komplexitet utan någon tydlig fördel för den här applikationen.

#### Säkerhet och avvägningar

Om någon får tag på en giltig sessionscookie kan den användas för att komma åt användarens konto tills sessionen avslutas. Cookieinställningarna minskar risken, men eliminerar den inte. Vid inloggning skapas också ett nytt sessions-ID för att minska risken för session fixation.

En fördel med sessionshantering är att en session kan avslutas direkt på servern. Med JWT är återkallning svårare eftersom en utfärdad access token normalt är giltig tills den löper ut.

Om GitHubs OAuth-token skulle komma på avvägar kan den användas inom de behörigheter som användaren godkänt tills den spärras eller upphör att gälla. Shoppen begär därför endast `read:user` och behåller inte tokenen efter inloggningen.

Issues-tokenen innebär en annan risk eftersom den lagras på servern och ger skrivbehörighet till repositoryts ärenden. Vid en läcka behöver den återkallas via GitHub och ersättas i serverns miljövariabler. Behörigheten är därför begränsad till Issues i ett enda repository.

## Tech stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Databas:** PostgreSQL
- **Integrationer (uppgift 1):** Sibars special-API, Algolia, Stripe, Supabase Storage, PostNord
- **Integrationer (uppgift 2):** Google OAuth, GitHub OAuth, GitHub Issues och Resend (e-post)
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

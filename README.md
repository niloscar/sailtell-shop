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

### Uppgift 1 – Integrera shoppen med omvärlden

Den första uppgiften omfattar fem integrationer: produktimport via Sibars special-API, sökning med Algolia, betalning med Stripe, bildlagring i Supabase Storage och fraktinformation från PostNord.

### Uppgift 2 – Konton och autentisering

Den andra uppgiften utökar shoppen med kundinloggning via Google, admininloggning via GitHub och orderbekräftelser via e-post. För VG tillkommer möjligheten att skapa GitHub-issues från adminsidan med administratörens egen token.

**Status:** Pågående. Inlämning 22 november 2026.

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

Uppgifter till eventuella testkonton lämnas separat till läraren vid inlämning.

## Uppgift 1 – Reflektion

### Backend kontra frontend

Samtliga externa integrationer hanteras genom Express i stället för direkt från React. Det gör att API-nycklar kan hållas på servern och att extern data kan valideras och anpassas innan den skickas till klienten. Backend ansvarar även för felhantering och affärslogik, exempelvis beräkning av priser och uppdatering av orderstatus. Genom att använda separata adaptrar begränsas också beroendet av varje tjänsts API-struktur.

### Labb 1 – Import av produktdata (Sibars special-API)

Produktimporten kombinerar REST med filbaserad integration. Leverantörens CSV- och XML-filer hämtas via API:et, tolkas och valideras med Zod innan produkterna sparas i PostgreSQL. Modellen passar eftersom många produkter kan importeras samtidigt. Upsert används för att uppdatera befintliga produkter utan att skapa dubbletter.

Integrationen ersätter manuell registrering och uppdatering av produktinformation. Att hantera detta själv skulle kräva mer administration och egna rutiner för att hålla sortimentet aktuellt.

Om leverantörens API är otillgängligt kan importen inte genomföras, men redan importerade produkter finns kvar. Anropen har timeout och ogiltiga produkter hoppas över och redovisas i en importrapport.

En risk är att ändringar i leverantörens filformat kan kräva anpassningar av adaptern.

### Labb 2 – Sök-API (Algolia)

Sökfunktionen använder Algolias API och SDK för indexering och sökning. Produkterna skickas till ett separat sökindex, medan PostgreSQL fortsätter vara den huvudsakliga datakällan. Modellen passar eftersom Algolia är utvecklat för snabba sökningar med bland annat relevansrankning och stavfelstolerans.

Att bygga motsvarande funktionalitet själv skulle kräva egen indexering, söklogik och prestandaoptimering. Integrationen gör att dessa funktioner kan användas utan att utvecklas från grunden.

Om Algolia inte är tillgängligt fungerar inte den externa sökningen. Produkterna finns däremot kvar i databasen och kan fortfarande visas genom shoppens ordinarie produktlistor. Fel hanteras separat så att övriga funktioner inte påverkas.

En risk är beroendet av Algolias tillgänglighet, eventuell förändring av deras priser och användningsvillkor.

### Labb 3 – Betalning (Stripe)

Betalningen kombinerar REST, redirect och webhook. Express skapar en Stripe Checkout-session och kunden skickas vidare till Stripes betalningssida. Därefter bekräftas betalningen genom en signerad webhook som uppdaterar orderstatus och lagersaldo. Webhooken är särskilt viktig eftersom betalningen måste kunna registreras även om kunden inte återvänder till shoppen.

Stripe innebär att shoppen slipper hantera kortuppgifter och utveckla ett eget betalningssystem. En egen lösning skulle innebära betydligt större ansvar för säkerhet, betalningstransaktioner och regelefterlevnad.

Beloppen beräknas i backend. Om Stripe är otillgängligt kan betalningen inte slutföras, men orderuppgifterna finns kvar. Ordern markeras inte som betald förrän en verifierad betalningsbekräftelse har mottagits.

Riskerna omfattar driftstörningar, avgifter och förändrade villkor.

### Labb 4 – Produktbilder i molnlagring (Supabase Storage)

Produktbilder hanteras genom Supabases SDK och API. Filerna laddas upp via backend och lagras i Supabase Storage, medan PostgreSQL innehåller referenser till bilderna. Modellen passar eftersom själva fillagringen kan hanteras separat från produktinformationen.

Integrationen ersätter behovet av egen filserver och lagringsinfrastruktur. En egen lösning skulle bland annat kräva hantering av filåtkomst, lagringsutrymme och säkerhet.

Om Supabase är otillgängligt kan uppladdning och byte av bilder misslyckas. Även visning av befintliga bilder kan påverkas, men produktinformationen finns kvar i databasen. Fel vid uppladdning hanteras utan att hela applikationen slutar fungera.

En risk är beroendet av tjänstens tillgänglighet och ökade kostnader allteftersom mängden data och trafik ökar.

### Labb 5 – Frakt (PostNord)

Fraktintegrationen använder REST för att hämta närliggande ombud och beräknade leveranstider utifrån kundens postnummer. Modellen passar eftersom informationen behöver hämtas utifrån den aktuella leveransadressen. Svaren valideras med Zod och omvandlas till interna datamodeller.

PostNord tillhandahåller information som annars skulle kräva ett eget och kontinuerligt uppdaterat register över ombud och leveransförutsättningar. Fraktpriserna hanteras däremot i shoppens backend, med fasta priser och fri frakt från 500 kr. Vald leveransmetod, kostnad och eventuellt ombud sparas på ordern och inkluderas i Stripe Checkout.

Om PostNords API inte svarar kan kunden fortfarande välja hemleverans och genomföra köpet. Timeout och felhantering begränsar påverkan på kassan.

En risk är att förändringar i PostNords API, tjänsteutbud eller svarformat kräver uppdateringar av adaptern.

## Uppgift 2 – Konton och autentisering

### Labb 6 – Kundinloggning med Google

Kundinloggningen använder Google OAuth 2.0 och OpenID Connect. Integrationen hanteras i Express-backend, medan React ansvarar för inloggningslänken och användargränssnittet.

Användaren identifieras genom Googles unika `sub`, som sparas i databasen. Vid första inloggningen skapas ett kundkonto och vid efterföljande inloggningar används samma konto. Om e-postadressen redan finns på ett konto med lösenordsinloggning avvisas Google-inloggningen med ett felmeddelande. Kontona kopplas inte ihop automatiskt eftersom e-postadressen inte används som identitetsnyckel.

Inloggade kunders beställningar kopplas till deras användar-ID. Mina sidor visar endast kundens egna ordrar genom en skyddad endpoint som kontrollerar sessionen på servern och returnerar `401` utan inloggning. Gästköp fungerar fortfarande utan användarkoppling.

### Labb 7 – Admininloggning med GitHub

*Dokumenteras efter implementation.*

### Labb 8 – E-post

*Dokumenteras efter implementation.*

### Redogörelse för autentisering

#### Inloggningsflöde

När användaren väljer Google-inloggning skapar backend ett slumpmässigt `state` och en PKCE `code_verifier`, som sparas i sessionen. Användaren skickas sedan till Google med `state` och en `code_challenge`.

Efter inloggningen skickar Google tillbaka en auktoriseringskod. Backend kontrollerar att `state` matchar och inte har gått ut, innan koden växlas mot tokens med hjälp av `code_verifier` och klientens hemliga nyckel.

`state` skyddar mot att obehöriga autentiseringsflöden kopplas till användarens session, medan PKCE försvårar användning av en uppfångad auktoriseringskod utan tillhörande verifieringsvärde. Jag valde att använda båda för ett starkare skydd.

#### Tokens

Google returnerar bland annat en ID-token och en access token. Shoppen använder ID-token för att identifiera användaren och kontrollerar `iss`, `aud`, `exp` samt nödvändiga användaruppgifter. Tokenens giltighetstid bestäms av Google och kontrolleras via `exp`.

ID-token avkodas men signaturen verifieras inte kryptografiskt. Eftersom tokenen hämtas direkt från Googles HTTPS-endpoint begränsas risken, men signaturverifiering skulle ge ett ytterligare skydd.

Googles tokens används inte efter att användaren identifierats och sparas inte. Ingen refresh token begärs. Client secret finns endast på servern.

#### Session eller JWT

Jag valde att fortsätta använda `express-session` med PostgreSQL som sessionslager, eftersom sessionshantering redan fanns implementerad i applikationen. Efter inloggningen sparas användar-ID i sessionen och webbläsaren får en `httpOnly`-cookie med `sameSite: 'lax'` och en timmes giltighetstid. I produktion används även `secure`.

Om jag hade förväntat mig så mycket trafik att sessionshanteringen riskerade att belasta databasen hade jag övervägt JWT med access- och refresh tokens. Då skulle vanliga API-anrop kunna autentiseras utan databasuppslag för varje session. Det skulle däremot innebära en mer komplex lösning.

#### Säkerhet och avvägningar

Om någon får tag på en giltig sessionscookie kan den användas för att komma åt användarens konto tills sessionen avslutas. Cookieinställningarna minskar risken, men eliminerar den inte. Vid inloggning skapas också ett nytt sessions-ID för att minska risken för session fixation.

En fördel med sessionshantering är att en session kan avslutas direkt på servern. Med JWT är återkallning svårare eftersom en utfärdad access token normalt är giltig tills den löper ut. Det kan hanteras med kortlivade access tokens och refresh tokens, men kräver ytterligare logik för förnyelse och återkallning.

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
- **Integrationer (uppgift 1):** Sibars special-API, Algolia, Stripe, Supabase Storage, PostNord
- **Integrationer (uppgift 2, pågår):** Google OAuth, GitHub OAuth, e-posttjänst
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

# E-handel – Inlämningsuppgift 1, Integration med tredjepartssystem (FSU25D)

[Uppgiftsbeskrivning](docs/assignment-description.md)

_Oscar Nilsson_  
_oscar.nilsson@medieinstitutet.se_  
[_GitHub_](https://github.com/niloscar)

## Integrera shoppen med omvärlden

Projektet bygger vidare på en befintlig e-handelsapplikation och fokuserar på integration med externa tjänster och dataformat.

Under uppgiften utökas shoppen stegvis med produktimport, sökfunktionalitet, betalning, molnlagring och frakt.

Integrationerna implementeras i fem labbar:

1. Import av produktdata
2. Sök-API
3. Betalning
4. Produktbilder i molnlagring
5. Frakt

## Integrationer

### Labb 1 – Import av produktdata

Import av produktdata från externa leverantörer i CSV- och XML-format.

Den externa datan valideras innan den används och produkter skapas eller uppdateras i databasen.

### Labb 2 – Sök-API

Sökfunktion för produkter med stöd för:

- fritextsökning
- filtrering
- sortering
- paginering

Sökparametrar valideras i backend innan de används.

### Labb 3 – Betalning

Integration med extern betaltjänst.

### Labb 4 – Produktbilder i molnlagring

Produktbilder lagras och hämtas via extern molnlagring.

### Labb 5 – Frakt

Integration med extern frakttjänst för beräkning av fraktpris och val av ombud.

## Integrationsarkitektur

React-klienten kommunicerar endast med applikationens eget API i Express. Kommunikation med externa tjänster sker från backend.

Varje extern tjänst kapslas in i en separat adapter som ansvarar för tjänstens:

- URL:er och API-anrop
- autentisering
- dataformat
- felkoder
- översättning till applikationens interna datamodell

Extern data valideras innan den används eller sparas.

Anrop till externa tjänster ska också ha timeout och felhantering så att ett fel hos en tredjepartstjänst inte gör att hela applikationen kraschar.

## Tech stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- TypeScript

### Databas

- PostgreSQL

### Verktyg och bibliotek

- npm
- Git och GitHub
- ESLint
- Prettier
- Zod

## Projektstruktur

```text
.
├── backend
│   └── src
│       ├── controllers
│       ├── integrations
│       ├── middleware
│       ├── repositories
│       ├── routes
│       ├── services
│       ├── types
│       └── utilities
├── frontend
│   └── src
├── docs
├── package.json
└── README.md

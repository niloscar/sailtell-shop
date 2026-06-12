# E-handel – Inlämningsuppgift 1, Systemutveckling (FSU25D)

[Uppgiftsbeskrivning](https://github.com/Medieinstitutet/fsu25d-systemutveckling-uppgift-1-min-egna-e-handel-niloscar/blob/main/assignments-description.md)

_Oscar Nilsson_  
_oscar@ondproduktion.se_  
[_GitHub_](https://github.com/niloscar)

## Blablabutiken

En enklare e-handelsapplikation där kunder kan visa produkter, lägga dem i en varukorg och skapa en order. Administratörer kan hantera produkter och se inkomna ordrar.

## Innehåll

* [Tidplan](#tidplan)
* [Funktioner](#funktioner)

  * [Kund](#kund)
  * [Administratör](#administratör)
* [Tech stack](#tech-stack)

  * [Frontend](#frontend)
  * [Backend](#backend)
  * [Databas](#databas)
  * [Verktyg](#verktyg)
* [Projektstruktur](#projektstruktur)
* [Installation](#installation)
* [Miljövariabler](#miljövariabler)
* [Databas](#databas-1)
* [Kodstil](#kodstil)
* [Git och commits](#git-och-commits)
* [Brancher och pull requests](#brancher-och-pull-requests)
* [Testning](#testning)
* [Dokumentation](#dokumentation)
* [Deployment](#deployment)
* [Administratörskonto](#administratörskonto)


## Tidplan

**Deadline** 2026-08-25 23:59 (CEST)  
**Tidsbudget** 124 timmar

[Se den detaljerade tidplanen här](https://docs.google.com/spreadsheets/d/1kti9O242bkX7J6k_bEON9HNTtaCuefqLBKRLH9RBc4g/edit?usp=sharing)

## Funktioner

### Kund

* Visa produkter
* Lägga produkter i varukorgen
* Ändra antal och ta bort produkter
* Genomföra simulerad betalning
* Skapa en order

### Administratör

* Lägga till och redigera produkter
* Visa ordrar och beställda produkter
* Logga in som administratör
* Uppdatera orderstatus

## Tech stack

### Frontend

* Vite
* React
* TypeScript

### Backend

* Node.js
* Express
* TypeScript

### Databas

* MySQL

### Verktyg

* npm
* Git (och GitHub)
* ESLint

## Projektstruktur

```text
.
├── backend
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   └── index.html
│   ├── src
│   │   └── server.ts
│   └── tsconfig.json
├── docs
│   └── assignment-description.md
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   └── favicon.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── assets
│   │   ├── index.css
│   │   └── main.tsx
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```

Mappen `docs` innehåller uppgiftsbeskrivning, databasdiagram, sitemap och tidplan.

## Installation

Klona projektet:

```bash
git clone https://github.com/Medieinstitutet/fsu25d-systemutveckling-uppgift-1-min-egna-e-handel-niloscar.git
cd fsu25d-systemutveckling-uppgift-1-min-egna-e-handel-niloscar
```

Installera backend:

```bash
cd backend
npm install
npm run dev
```

Installera frontend:

```bash
cd frontend
npm install
npm run dev
```

## Miljövariabler

Exempel på variabler i backend:

```env
PORT=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
SECRET_KEY=
```

Exempel i frontend:

```env
VITE_API_URL=
```

`.env`-filer committas inte.

## Databas

Projektet använder följande huvudsakliga tabeller:

* `products`
* `orders`
* `order_items`
* `users`
* `carts`
* `cart_items`

Databasdiagrammet finns i `docs`.

## Kodstil

* TypeScript används i frontend och backend.
* All kod använder fyra mellanslags indentering.
* Enkla citattecken används där det är möjligt.
* Semikolon används inte där det inte är nödvändigt.
* `camelCase` används för variabler och funktioner.
* `PascalCase` används för React-komponenter och typer.
* `kebab-case` används för övriga filnamn.
* `snake_case` används i databasen.

Exempel:

```ts
const orderTotal = 500;

function calculateOrderTotal() {
    // ...
}
```

```tsx
export function ProductCard() {
  return <Article />;
}
```

## Git och commits

Arbetet ska ha en tydlig och löpande git-historik.

* Minst en commit per arbetsdag
* Små commits med tydliga beskrivningar
* Inga lösenord eller `.env`-filer i Git

Commit-format:

```text
type: kort beskrivning
```

Exempel:

```text
feat: add product list
feat: add shopping cart
fix: correct order total
docs: update readme
```

Typer:

* `feat`
* `fix`
* `docs`
* `refactor`
* `test`
* `chore`

## Brancher och pull requests

Större funktioner utvecklas i separata brancher.

Exempel:

```text
feature/product-api
feature/shopping-cart
feature/admin-login
fix/order-total
```

En pull request ska kort beskriva:

* Vad som har ändrats
* Hur det har testats
* Eventuella kvarstående problem

## Testning

Följande flöden ska testas:

* Skapa och redigera produkter
* Visa produkter
* Hantera varukorg
* Skapa order
* Visa ordrar i admin
* Logga in och skydda adminvyer
* Uppdatera orderstatus

## Dokumentation

Utöver denna readme innehåller projektet (se docs/):

* Databasdiagram
* Sitemap
* Tidplan
* Stilguide
* Wireframes
* Uppgiftsbeskrivning

## Deployment

Applikation:

```text
[Länk kommer snart]
```

API:

```text
[Länk kommer snart]
```

## Administratörskonto

```text
E-post: admin@example.com
Lösenord: admin123
```
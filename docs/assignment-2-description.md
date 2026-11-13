# Inlämningsuppgift 2 – Konton och autentisering

Du låter kunder och admin logga in i din shop via externa tjänster, och shoppen skickar orderbekräftelser via e-post. För VG rapporterar admin också fel som issues i shoppens GitHub-repo, i sitt eget namn.

Uppgiften är individuell, testar LR 2 och 4, bedöms med **IG/G/VG** och lämnas in senast **söndag 22 november 2026 kl. 23:59**.

## Översikt

| | |
| --- | --- |
| **Läranderesultat** | 2 och 4 |
| **Betygsskala** | IG/G/VG |
| **Arbetsform** | Individuell |
| **Presenteras** | L9, måndag 9/11 |
| **Inlämning** | Söndag 22/11 kl. 23:59 |
| **Kodbas** | Samma repo och shop som i uppgift 1 |
| **Bedömning** | Inloggningen testas i den deployade shoppen |

## Gemensamma krav

Gäller i alla labbar:

1. Inloggningen går via backend. Client secrets och andra nycklar finns bara i `.env` på servern.
2. Varje inloggningsflöde skyddas med `state`, PKCE eller båda.
3. Inloggningen fungerar i den deployade shoppen. Det är där den testas.
4. Efter inloggningen håller shoppen användaren inloggad med session eller JWT. Du väljer och motiverar valet i README.
5. Tokens från tjänsterna når aldrig webbläsarens JavaScript.
6. Varje anrop har en timeout. Om en tjänst inte svarar får användaren ett begripligt meddelande, och shoppen kraschar inte.
7. Svar från tjänsterna valideras innan de används.

## Labbarna

Uppgiften byggs i tre steg. Varje steg ges ut som en egen labb, och du bygger vidare i din egen shop.

### Labb 6 – Kundinloggning med Google (L9, LR 4, G)

Kravspecen ges ut som Labb 6 på L9.

### Labb 7 – Admininloggning med GitHub (L10, LR 4, G och VG)

Kravspecen ges ut som Labb 7 på L10.

### Labb 8 – E-post (LR 4, G)

Kravspecen ges ut som Labb 8.

## Redogörelse i README (LR 2)

Skriv ett avsnitt i shoppens README som förklarar autentiseringen i din shop.

- **Inloggningsflödet:** Stegen från att användaren klickar på ”Logga in med …” tills shoppen vet vem hen är, vad `state` och PKCE skyddar mot och vilket eller vilka du valde.
- **Tokens:** Vilka tokens shoppen får från tjänsterna, vad de används till, var de sparas och hur länge de gäller.
- **Session eller JWT:** Hur shoppen håller användaren inloggad efter inloggningen och varför du valde så.

## Krav för VG

Alla krav för G, plus:

- **Labb 7, issues:** Adminsidan skapar issues i shoppens repo med adminens egen GitHub-token. Token sparas bara på servern, förnyas när den har gått ut och tas bort vid utloggning.
- **Fördjupad redogörelse:** Du resonerar om säkerhetsrisker och val, till exempel vad som händer om en token stjäls, hur en token spärras och när session respektive JWT passar bäst.

## Checklista före inlämning

- [ ] Kunder loggar in med Google i den deployade shoppen och ser sina beställningar (Labb 6).
- [ ] Admin loggar in med GitHub i den deployade shoppen, och adminroutes är skyddade (Labb 7).
- [ ] Shoppen skickar en orderbekräftelse via e-post (Labb 8).
- [ ] Inga nycklar eller client secrets finns i koden på GitHub eller i webbläsaren.
- [ ] README innehåller redogörelsen för autentiseringen (LR 2).
- [ ] För VG: Admin skapar issues från adminsidan (Labb 7), och redogörelsen är fördjupad.

## Inlämning

Lämna in två länkar på lärplattformen senast **söndag 22/11 kl. 23:59**: ditt GitHub-repo och din deployade shop. Är repot privat bjuder du in läraren som medarbetare. Det är samma repo och shop som i uppgift 1.

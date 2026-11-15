# Instructie: het CMS goed instellen voor de NOVA-site

De NOVA-site (`https://demo.linkandlead.nl`) haalt al haar inhoud uit het Link & Lead One-CMS
(`https://linkandlead.nl/admin`), uit de site **Demo Klant**. Deze instructie beschrijft eerst de
eenmalige inrichting en daarna het dagelijkse beheer.

---

## Deel 1 — Eenmalig inrichten (beheerder)

Deze stappen zijn voor Demo Klant al gedaan. Gebruik ze om te controleren of alles klopt, of om
een nieuwe omgeving op dezelfde manier in te richten.

### 1. De juiste site

- Werk alleen in de site **Demo Klant** (`demo.linkandlead.nl`).
- Gebruik **niet** "Nova Studio" of "Stadstheater Nova": dat zijn andere sites.

### 2. Leestoken voor de website

1. Maak in het CMS een API-token (`cms_…`) voor Demo Klant. Het token geldt alleen voor die site.
2. Zet in Vercel (project *demo* → Settings → Environment Variables, omgeving *Production*):

   | Variabele | Waarde | Opmerking |
   | --- | --- | --- |
   | `CMS_URL` | `https://linkandlead.nl` | |
   | `CMS_TOKEN` | het token uit stap 1 | als **Sensitive** opslaan, nooit in de code zetten |
   | `CMS_LEAD_SITE_ID` | site-id van de Link & Lead-verkoopsite | optioneel: alleen als demo-aanvragen van `/one` in het CMS moeten binnenkomen |
   | `DEMO_AANVRAAG_URL` | `https://…` | optioneel: toont "Plan direct een afspraak" bij het aanvraagformulier |

3. Deploy opnieuw (of push naar `main`). Controle: open de site, klik rechtsonder op het
   demopaneel. Daar moet **Databron: CMS · live** staan.

### 3. Voorbeeld op de site (concepten bekijken)

1. CMS → **Siteregister** → Demo Klant → **Adres voor "Voorbeeld op de site"**:
   `https://demo.linkandlead.nl/__voorvertoning`
2. Het CMS controleert dat adres zelf. Daarna staat de knop **Voorbeeld op de site** aan in de
   pagina-editor. Een concept is dan op de echte site te zien, met de balk "Voorbeeld van het
   concept". Bezoekers zien niets van concepten.

### 4. Startinhoud

De 25 pagina's, het merk, de navigatie en de kleuren staan al in Demo Klant. Ze komen uit
`src/content/blauwdruk.ts` in de repository. De collecties (cases, artikelen, teamleden, partners)
staan in `cms/demo-klant-*.sql`.

> **Let op:** `scripts/cms-push.mjs` zet de blauwdruk opnieuw in het CMS en **overschrijft** de
> blokken van elke meegestuurde pagina. Dat geldt ook voor wijzigingen die een redacteur intussen
> in het CMS deed. Gebruik het alleen bewust, en dan per pagina: `CMS_PAGINAS=/one node scripts/cms-push.mjs`.

---

## Deel 2 — Dagelijks beheer (redacteur)

Wijzigingen staan **binnen 60 seconden** op de site. Wil je eerst kijken, gebruik dan
**Voorbeeld op de site**.

### Pagina's en blokken

- Elke pagina bestaat uit blokken. Toevoegen, verwijderen en verslepen verandert de pagina direct.
- **Achtergrond per blok:** Licht (wit), Zacht (mist), Accent (limoenlicht), Donker (diep), Diepst (nacht).
- **Afsluitende oproep:** het **laatste "Oproep"-blok (cta)** van een pagina is altijd de grote
  donkere oproep onderaan, boven de footer. Een oproepblok elders op de pagina wordt een
  limoenkleurige tussenoproep.
- **Titel en beschrijving** van de pagina zijn de SEO-titel en zoekmachinetekst.
- **Nieuwe ruimte, nieuw evenement of nieuw project:** maak een pagina met slug
  `/spaces/<naam>`, `/experiences/<naam>` of `/work/<naam>`. Die verschijnt vanzelf.
- Een case die alleen in de collectie Cases staat, krijgt automatisch een eenvoudige projectpagina.

### Schrijfafspraken in tekstvelden

Sommige blokken hebben in het CMS geen eigen veld voor een kopje of een opsomming. Daarvoor gelden
deze afspraken (⏎ = nieuwe regel):

| Wat je wilt | Hoe je het schrijft | Werkt in |
| --- | --- | --- |
| Klein kopje boven de titel | eerste regel in **HOOFDLETTERS** in het titelveld: `IN DEZE DEMO⏎Een wereld vol mogelijkheden.` | blokken zonder eigen eyebrowveld: Team, Statistieken, Sprekers, Citaten, Prijskaarten, Reviews … |
| Toelichting naast de kop | regels **na** de titel: `Gemaakt om je iets te laten voelen.⏎Ontdek zes voorbeeldprojecten…` | Cases, Artikelen en andere blokken zonder introveld |
| Chips of opsomming | regels die beginnen met `- ` | tekst van een Statement, intro van het aanvraagformulier op `/one` |
| Kop en toelichting in een band | eerste regel = kop, volgende regels = toelichting | Conclusieregel (overgang) |
| Opmerking onder tickets | eerste regel van de intro = tekst naast de kop, volgende regels = opmerking onder de kaarten | Prijskaarten |
| Accentkleur in een kop | zet woorden tussen sterretjes: `Op morgen wachten we niet. *Morgen maken we zelf.*` | Statement, Tekst met beeld, Header (homehero en `/one`) |
| Kop over meerdere regels | gewoon een nieuwe regel | Header |

**Tabel (sportpagina):** kolom 2 is ook de kop boven het programma. De rij die de tekst uit
**Markeer rij** bevat, wordt de uitgelichte wedstrijd. Daarin is kolom 3 de grote kop, kolom 4 de
toelichting en kolom 5 het label (bijvoorbeeld THUIS).

### Beelden

- Alle NOVA-beelden staan in de **mediabibliotheek** van Demo Klant (19 stuks, met alt-tekst).
  Kies ze daar, of upload een nieuw beeld. Pagina's en collecties verwijzen naar die beelden, dus de
  bibliotheek laat zien waar elk beeld gebruikt wordt.
- De site maakt zelf kleinere formaten voor telefoons. Je hoeft niets te verkleinen.
- Vul altijd de **alt-tekst** in: een korte beschrijving van wat er op het beeld staat.

### Video

- Een videoblok is een **Header-blok** met *Media* = **video** en bij *Video-URL* een volledige
  URL naar een mp4- of webm-bestand. Zet *Lay-out* op **achtergrond** voor een filmisch blok midden
  op een pagina (zoals op de homepage), of *Hoogte* op **fullscreen** voor een videohero.
- **Video's kunnen niet in de mediabibliotheek**: die neemt alleen JPG, PNG, WebP, GIF en AVIF aan.
  De NOVA-film staat daarom op de website zelf:
  `https://demo.linkandlead.nl/media/nova-film-liggend.mp4`. Gebruik altijd de **volledige URL**,
  dan werkt de video ook in de CMS-editor en in "Voorbeeld op de site".
- Op telefoons speelt bij deze film automatisch de staande versie (`nova-film-staand.mp4`).
- Zet bij *Afbeelding* het posterbeeld uit de mediabibliotheek (*NOVA-film poster*). Dat zie je
  tot de video speelt, en ook bij "beweging verminderen".
- De video speelt zonder geluid, herhaalt, en speelt alleen als hij in beeld is. Bezoekers kunnen
  hem pauzeren.
- YouTube- en Vimeo-links werken niet als achtergrondvideo op de NOVA-site.
- Vervang je een video, geef het bestand dan een **nieuwe naam**. Video's op de site worden een
  jaar door browsers bewaard, dus onder dezelfde naam ziet niet iedereen de nieuwe versie.
- Vul *Media alt-tekst* in: een korte beschrijving van wat de film laat zien.

### Collecties

| Collectie | Waar op de site | Belangrijke velden |
| --- | --- | --- |
| Cases | Werk, home, projectpagina's | klantnaam, sector, jaar (*resultaat_periode*), uitdaging (intro), citaat (grote quote), schakels (diensten), foto |
| Artikelen | Verhalen, home | slug, titel, rubriek, samenvatting, hoofdtekst (`## Tussenkop` + alinea's met een witregel ertussen), foto, publicatiedatum |
| Teamleden | Home, Over ons, Community | naam, functie, tekst (bio), foto |
| Partners | Community | naam, branche, tagline, quote, **uitgelicht** (één partner aanzetten) |
| Testimonials, Reviews, Wedstrijden, Agenda | alleen als je die blokken op een pagina zet | — |

Alleen **gepubliceerde** items verschijnen. Reviews verschijnen pas na **goedkeuring**.

### Merk, menu en kleuren

- **Merk → Hoofdnavigatie:** de menu-items bovenaan.
- **Merk → Footerkolommen:** de links in de footer.
- **Merk → Primaire actie:** de knop "Neem contact op" rechtsboven.
- **Huisstijl:** de kleurvelden *nacht, diep, wit, mist, limoen* en *steen* sturen de kleuren van de
  hele site. Andere waarden dan een kleurcode (`#RRGGBB`) worden genegeerd.

### Formulieren

- Teksten van formulieren pas je aan in het blok: titel, intro, knoptekst, voetnoot en bevestiging.
  Bij de formulierbouwer stel je ook de velden in.
- Inzendingen van contact, nieuwsbrief, formulierbouwer, review en NPS komen in de NOVA-database
  (Supabase, tabel `aanvragen`). Ze komen **niet** in je mail.
- Alleen de demo-aanvraag op `/one` gaat daarnaast naar het CMS, en alleen als `CMS_LEAD_SITE_ID`
  is ingesteld.

---

### Blokkenbibliotheek

Op `/playground` zie je elk blok zoals het op de site verschijnt, in elke variant. De formulierbouwer
en het reviewformulier openen op **ware grootte**, zodat je ze kunt invullen. Bij de formulierbouwer
kies je tussen voorbeeldopstellingen: contactformulier, aanmelding workshop of offerteaanvraag.
Inzendingen vanuit de bibliotheek worden net als op de site opgeslagen.

## Wat je niet in het CMS aanpast

Deze onderdelen staan bewust vast in de code:

- de blokkenverkenner op `/playground`;
- de rondleiding en het demopaneel;
- de footerregel "Gemaakt om te inspireren…" (de lees-API geeft die niet door);
- veiligheidsmeldingen zoals "er wordt geen e-mail verstuurd";
- een paar knoppen naar overzichtspagina's, op plekken waar het blok geen knopveld heeft:
  - "Ontmoet de makers" en "Lees de verhalen" op de home;
  - "Bekijk meer projecten" op projectpagina's;
  - "Probeer de configurator" op ruimtepagina's;
  - "Lees over onze aanpak" bij de uitgelichte partner;
  - "Open de demo" en "Start de rondleiding" op `/one`.

## Als iets niet klopt

| Probleem | Oplossing |
| --- | --- |
| Wijziging niet zichtbaar | Wacht een minuut en ververs. Staat de pagina op *gepubliceerd*? |
| Demopaneel zegt **Supabase** of **Demodata** | Het CMS is niet bereikbaar of het token klopt niet. Controleer `CMS_URL` en `CMS_TOKEN` in Vercel en deploy opnieuw. De site toont dan de blauwdruk, dus er gaat niets kapot. |
| Knop "Voorbeeld op de site" staat uit | Controleer het voorbeeldadres in het Siteregister (deel 1, stap 3). |
| Een blok verschijnt niet | Bloktypes die de NOVA-site niet kent, worden overgeslagen. Kijk in `/playground` welke blokken er zijn. |

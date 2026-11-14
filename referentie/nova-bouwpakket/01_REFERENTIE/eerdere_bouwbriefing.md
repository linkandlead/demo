# NOVA — volledige ontwerp- en bouwbriefing
## Demonstratiewebsite voor Link & Lead One / One Studio
Versie: 1.0 | 14 november 2026 | Taal: Nederlands (merkstatements mogen Engels)

> **Opdracht:** bouw een verbluffende, echte voorbeeldwebsite die wordt beheerd vanuit het bestaande Link & Lead One. De website verkoopt de designkwaliteit; de demonstratiemodus bewijst wat One Studio kan. Dit document is zowel functioneel ontwerp als overdraagbare opdracht voor Claude Code.

## 1. Productkeuzes en randvoorwaarden

- Productnamen blijven exact: **Link & Lead One** (platform), **One Studio** (website/content/vormgeving), **One Control** (superadmin) en **One AI** (assistent).
- Demo-merk: **NOVA — Creative Futures**, fictief creatief platform voor design, cultuur, events, werkplekken en community.
- Architectuur: **model A, eigen maatwerkfrontend op de bestaande CMS-contentstructuur**. Geen tweede CMS en geen parallelle, losstaande contentdatabase. Hergebruik waar mogelijk bestaande gedeelde renderlogica en UI-componenten; afwijkende visualisaties horen in NOVA-frontend.
- Bron van waarheid: bestaande paginablokken, volgorde, varianten, vijf achtergronden, gedeelde blokken, collecties, media, navigatie, SEO en formulieren. Bestaande API's en schema's eerst ontdekken; niets verzinnen of hernoemen.
- Behoud bestaande sites, gebruikers, permissies, inhoud, URL's, interfaces en andere functionaliteit.
- **NOVA is een demonstratieomgeving:** geen fictieve live omzet-/conversiegegevens als echte productprestaties presenteren. Fictieve bezoekers, cases, events en cijfers labelen in demo-instructies en CMS-seed als voorbeelddata.
- Geen migratie van de 15 verouderde en geen gebruik van de 33 exclusieve Link & Lead-blokken voor NOVA. Wel alle **43 generieke bloktypen** demonstreren in de Playground.

## 2. Creative direction

**Designstijl:** premium editorial × futuristic minimalism × immersive digital studio. De eerste indruk moet zijn: een internationale cultuur/designstudio met een budget voor topdesign, niet een SaaS-landingpage.

**Stijlprincipes**
1. Typografie is de hoofdrolspeler: enorme koppen, asymmetrisch grid, korte zinnen.
2. Fotografie, videoposters en motion zijn zorgvuldig gekozen; geen willekeurige stockcollage.
3. Lichte en donkere secties wisselen in een bewust ritme.
4. Onverwachte maar beheerste details: micro-interacties, beeldmaskers, nummers in marges, projectkaarten van verschillende omvang.
5. Alles voelt snel, helder en toegankelijk, ook zonder animaties.

**Design tokens / CMS-kleurvelden (alle 12):**

| CMS-naam | Hex | Gebruik |
|---|---|---|
| wit | `#F8F7F3` | basis/licht |
| mist | `#E7EDF1` | zachte achtergrond |
| limoenlicht | `#F1F2D2` | licht accentvlak |
| diep | `#14204A` | donkere sectie/tekst/knop |
| nacht | `#0B1127` | hero/footer |
| limoen | `#DBF866` | CTA/accent op donker |
| limoendonker | `#536500` | subtiele accenten/links op licht |
| tekst | `#3E4856` | lopende tekst |
| steen | `#596576` | secundaire tekst |
| mistdof | `#C8D0DB` | secundair op donker |
| fout | `#B72C34` | foutmelding |
| foutlicht | `#FFF0ED` | achtergrond foutmelding |

Alle vijf bestaande achtergronden gebruiken hun **bestaande** CMS-toewijzing: **Licht → wit**, **Zacht → mist**, **Accent → limoenlicht**, **Donker → diep**, **Diepst → nacht**. Tekst, knoppen en accent volgen de bestaande mapping, niet vrije per-blok override. De gekozen basiscombinaties hebben handmatig geverifieerde contrastverhoudingen van minimaal 4,5:1 voor normale tekst; aanvullende gebruikersvarianten opnieuw controleren.

**Typografie:** Display: Space Grotesk (headlines 72–128 px groot scherm, fluïde op kleiner scherm). Body: Inter (16–18 px, royale regelafstand). Fonts lokaal als `.woff2` hosten (max. acht bestanden), geen externe runtime fontservice. Radius voor generieke CMS-renderer: klein 12 px, medium 20 px, groot 30 px, pill voor knoppen. Eigen frontend mag afwijkende vormen gebruiken, maar het bestaande schema blijft intact.

**Grid:** max. contentbreedte 1440 px, marges desktop 48–72 px, tablet 32 px, mobiel 20 px. Ontwerp 1440, 1024, 768 en 375 px. Beelden met vaste verhoudingen, geoptimaliseerd WebP/AVIF, passende alt-tekst.

**Beweging:** section reveal, zeer rustige hovertransities, subtiele parallax alléén waar performant. `prefers-reduced-motion` respecteren; essentiële content nooit afhankelijk maken van animatie. Geen automatisch geladen externe widgets.

## 3. Informatiestructuur en navigatie

**Hoofdnavigatie publiek:** Work · Journal · Experiences · Spaces · Community · About · Contact. De CTA rechts: **Explore NOVA** (leidt naar Experiences) of **Get in touch** op secundaire pagina's.

**Demo-navigatie:** zwevende knop **Explore the CMS** die rechts onder opent: **Demo Mode**, **Block Playground**, **Live Edit**, **Try the Theme**, **Mobile Preview**, **Guided Tour**. Deze laag is in publieke presentatie te verbergen; bij afgeschermde sessie mag ze actief zijn.

**Sitemap en routes:**
- `/` — Homepage.
- `/work` — Filterbare cases/portfolio.
- `/work/aurora-pavilion` — Projectdetail (inhoudelijk rijk).
- `/work/echo-spaces` — Alternatieve projectdetailvariant.
- `/journal` — Editorial artikeloverzicht.
- `/journal/designing-for-tomorrow` — Artikelpagina.
- `/experiences` — Agenda/landingspagina evenementen.
- `/experiences/nova-sessions` — Eventdetail met programma, sprekers en tickets.
- `/spaces` — Overzicht ruimtes.
- `/spaces/studio-one` — Ruimtedetail met prijsconfigurator en boekingsvraag.
- `/community` — Makers, partners, reviews.
- `/members` — Ledentoegang, inclusief eigen demo-inlogstand (niet publiek echt te registreren tenzij bestaande auth dat ondersteunt).
- `/about` — Verhaal, team en bewijs.
- `/lab` — Interactieve uitproberpagina voor test/AI/intake/feedback.
- `/contact` — Contact, formulieren, locatie.
- `/playground` — Alle 43 generieke bloktypen, met filters.
- `/playground/sports` — Sport-specifieke blokken logisch getoond met een fictieve club.
- `/demo` — Geleide presentatieroute met scenario's en toegang tot echte One Studio-editors.
- Systeemroutes: 404, privacy en toegankelijkheidsverklaring, volgens bestaande voorzieningen.

**Menu desktop:** transparant over donker hero, wordt compact en contrastrijk bij scrollen; active page state; toegankelijk dropdown alleen als subnavigatie echt nodig is. **Mobiel:** compact logo, hamburger, fullscreen nav-paneel, sluitbaar met Escape; geen scrolltrap.

## 4. Paginaontwerpen + exacte blokkenkaart

Alle secties gebruiken officiële bloknamen uit het CMS. `K`=kernblok; `G`=gedeeld blok; `C`=collectie; `S`=sitebloktype (alleen indien werkelijk nodig). In dit ontwerp zijn **geen nieuwe contentbloktypen vereist**; de demo-overlay is een aparte frontendmodule.

### A. Homepage `/`

Visueel: diep nachtblauwe fullscreen hero, groot wit statement, limoenaccent, cinematografische architectuurfotografie, afwisselend warm wit en donker.

| Volgorde | Inhoud / voorbeeldcopy | CMS-blok | Variant / keuze | Achtergrond | Soort |
|---|---|---|---|---|---|
| 1 | Eyebrow `A PLACE FOR WHAT'S NEXT`; H1 `Ideas deserve to become reality.`; subkop `We turn creative possibilities into remarkable experiences.`; CTA `Discover our world` | Header (hero) | beeld als achtergrond; schermvullend; overlay; twee knoppen | Diepst | K |
| 2 | `CREATE / CONNECT / EXPLORE` | Bewegende tekstband | limoen | n.v.t. | K |
| 3 | H2 `The future is a collaboration.` + introductie met beeld | Tekst met beeld | beeld rechts | Licht | K |
| 4 | `Selected work` met drie grote projecttegels | Cases | max. 3 | Licht | C |
| 5 | `A world of ideas, brought to life.` met groot cijfer en claim | Statement | standaard | Donker | G |
| 6 | Cijfers: projecten, makers, bezoekers; duidelijk fictieve data | Statistieken | standaard | Zacht | K |
| 7 | `Meet the minds` met 4 profielen | Team | max. 4 | Licht | C |
| 8 | `Fresh perspectives` met drie verhalen | Artikelen | max. 3 | Accent | C |
| 9 | `Let's make something meaningful.` | Afsluitende oproep | gedeeld | Diepst | G |

### B. Work `/work` en projectdetail `/work/:slug`

Overzicht: introductiehero → filterbare projectkaarten (`Cases`, collectie sector) → uitgelicht project (`Portfolio`) → bewijsstrook → afsluitende oproep. Detail: compacte header met fotografie → rijke context (`Tekst met beeld`) → resultaatstatistieken (`Feiten`) → proces (`Reeks stappen`, variant tijdlijn) → klantquote (`Testimonial`) → gerelateerde projecten (`Cases`) → gedeelde CTA. Seed minstens zes projecten, drie categorieën: Design, Culture, Technology. Uitgewerkte projectcopy voor `Aurora Pavilion`, `Echo Spaces`, `Future Assembly`.

### C. Journal `/journal` en artikel `/journal/:slug`

Overzicht: editorial hero, uitgelicht artikel (bij eigen frontend te realiseren met bestaande Artikel-items), artikelenoverzicht met rubriekfilters, nieuwsbrief-`Formulier`. Detail: compacte `Header`, `Tekstblok` met h2/h3/citaten, `Tekst met beeld`, `Conclusieregel`, gerelateerde `Artikelen`, gedeelde CTA. Seed minstens acht artikelen in Design / People / Future / Culture. Eerste artikel: `Designing for tomorrow begins today` met geloofwaardige longform-inhoud van 800–1.200 woorden.

### D. Experiences `/experiences` en `/experiences/nova-sessions`

Overzicht: fullscreen eventhero, `Aftelklok`, aankomende events vanuit een `Collectie (lijst)` als events geen afzonderlijke generieke eventcollectie hebben, `Sprekers`, `Prijskaarten / tickets`, `Veelgestelde vragen`, gedeelde CTA. Detail: paginaheader met evenementbeeld, praktische details (`Feiten`), programma (`Reeks stappen` — fasenstrip/tijdlijn), drie sprekers (`Sprekers`), tickets (`Prijskaarten`), formulier voor interesse (`Formulierbouwer`), CTA. Gebruik fictieve toekomstige datum, geen claims over werkelijk geplande sessies.

### E. Spaces `/spaces` en `/spaces/studio-one`

Overzicht: hero en grid van drie fictieve ruimtes via `Collectie (lijst)` — raster. Detail: grote architectuurfoto, `Tekst met beeld`, kenmerken (`Kaartenrij`), `Configurator` met type arrangement / aantal personen / extra's en live totaal volgens bestaande werking, `Agenda-inplanner` voor voorbeeldslots, `Kaart en locatie` met fictief adres duidelijk gemarkeerd, `Veelgestelde vragen`, contactformulier. Geen echte betaling of externe boeking zonder gecontroleerde koppeling. Geef bij configurator de prijs in een duidelijke demo-status weer, niet als bindend aanbod.

### F. Community `/community` + Members `/members`

Community: hero, `Partners/sponsoren` met filter, `Partner uitgelicht`, `Team`, `Citaten-carrousel`, `Reviews`, `Review verzamelen` in demo-/testmodus, afsluitende CTA. Members: `Ledentoegang`, betekenisvolle voorbeeldpagina met exclusieve cases en een uitleg van contenttoegang. Maak duidelijk onderscheid tussen fictieve demo-auth en echte bestaande autorisatie; geen bypass bouwen.

### G. About `/about`

Pagina: `Header` (beeld links, normale hoogte) → `Statement` → `Tekst met beeld` → `Reeks stappen` (tijdlijn) → `Bewijsstrook` (logo's aan) → `Logostrook` (kleur op hover) → `Team` → `Veelgestelde vragen` → gedeelde CTA.

### H. Lab `/lab`

Interactieve showcases voor minder conventionele blokken, allemaal inhoudelijk verankerd in het fictieve NOVA-merk: `Rolvoorbeelden` (tabbladen met moderne creatieve beroepen), `Intake-stappen` (briefingproces), `Enquête / NPS`, `A/B-test` (twee hero-copyvarianten), `Personalisatie` (onbekend/bekend bezoeker), `Formulier` (scan alleen indien bestaande route beschikbaar), `Formulierbouwer`, `Feiten`, `Tabel`, `Flexibel blok`. Alle ingezonden voorbeeldgegevens gaan naar een geïsoleerde demosessie óf gebruiken bestaande veilige testfunctionaliteit.

### I. Contact `/contact`

`Header` compact → `Formulier` contact → `Kaart en locatie` met een **fictief** NOVA-adres (zonder verwarring met werkelijke onderneming) → `Veelgestelde vragen` → afsluitende CTA. Werk drie staten uit: validatiefout, verzenden, bevestiging.

### J. Playground `/playground`

Doel: visuele inspectie van **alle 43 generieke blokken**. Het wordt géén handmatig geïmiteerde verzameling screenshots: render de werkelijke blokcomponenten waar beschikbaar, met veilige demo-items en volledig zichtbare bloknamen. Iedere blokpagina ondersteunt: gevulde toestand, langeteksttoestand, optionele velden leeg, één item, twaalf items (waar zinvol), vijf achtergronden, varianten, desktop/tablet/mobiel, reduced motion. Toon daaronder `CMS-veldenschema` met alleen werkelijk ondersteunde velden.

Sportpagina `/playground/sports`: `Wedstrijden` en `Volgende wedstrijd` met fictieve wedstrijden. Voor blokken waarvoor de demo geen echte collecties of functionaliteit heeft: zichtbaar als `niet beschikbaar in deze demo`, nooit doen alsof ze werken.

## 5. Inhoud / demo-seed

**Merkstem:** positief, gedurfd, editorial, menselijk. Korte Engelse campagneregels zijn toegestaan; verklarende tekst en interface in natuurlijk Nederlands.

**Seed minimaal:**
- 6 cases, elk met coverbeeld, drie detailbeelden, sector, jaartal, opdrachtgever (fictief), uitdaging, aanpak, resultaat, alt-tekst.
- 8 artikelen, inclusief één longread, rubriek, auteur, publicatiedatum, coverbeeld en SEO-data.
- 5 teamleden met portretten en menselijk geschreven bio's.
- 6 partners/sponsoren met fictieve logo's of expliciet voorbeeldmerk-beeldmateriaal.
- 4 testimonials en 6 reviews; herkenbaar als voorbeeldcontent.
- 3 ruimtes, 3 arrangementen, 4 prijsopties, 6 voorbeeldslots.
- 3 events, 4 sprekers, voorbeeldprogramma's.
- 3 FAQ-sets, 2 gedeelde CTA's en één logo-/bewijsstrook.
- Alle beelden geoptimaliseerd, juridisch bruikbaar/licentiecontrole, lokaal opgeslagen in CMS-media; geen externe hotlinks.

**Homepagevoorbeeldcopy:**
- H1: `Ideas deserve to become reality.`
- Intro: `Nieuwe ideeën ontstaan wanneer mensen, plekken en perspectieven samenkomen. NOVA brengt die werelden bij elkaar.`
- Work H2: `Made to move people.`
- Journal H2: `Stories worth sharing.`
- Events H2: `The moments that move us.`
- Laatste CTA: `Have something extraordinary in mind?` / knop `Start een gesprek`.

## 6. Demonstratiemodus — functioneel gedrag

De demonstratiemodus is een apart beveiligd frontend-onderdeel, buiten de 43 kernblokken; het CMS blijft de echte bron.

**Zwevende demo-toolbar** zichtbaar voor geautoriseerde presentator, optioneel read-only zichtbaar voor publiek. Knoppen:
1. **Toon CMS-blokken:** markeer sectie bij hover/selectie. Zijpaneel toont officiële bloknaam, variant, achtergrond, collectie/gedeeld, en edit-koppeling.
2. **Bewerk deze sectie:** open de bestaande One Studio-editor voor de juiste site, pagina en blok, volgens de huidige routes en autorisatie. Geen verzonnen API-pad.
3. **Bekijk wijziging:** herlaad/preview bestaande content na opslaan. Een echte persistente wijziging alleen als de bestaande CMS-API dat ondersteunt en de gebruiker is geautoriseerd.
4. **Wissel thema:** voorkeursdemokopie met maximaal drie ingestelde stijlen; geen productie-siteconfiguratie overschrijven. Toon expliciet of variant alleen sessiegebonden is.
5. **Responsieve weergave:** desktop (1440), tablet (768), mobiel (375); focus blijft bruikbaar.
6. **Bezoekerpersonalisatie:** gesimuleerde `nieuwe` / `bekende` bezoeker alleen als de aanwezige personalisatie-interface correct kan worden aangestuurd. Label simulatie.
7. **Guided Tour:** zes stappen met uitlegbordje, verder/terug/overslaan.
8. **Reset demo:** herstel het eigen geïsoleerde seeddataset of sessie-thema; raak andere sites niet aan.

**Presentatiescript van vijf minuten:**
- 0:00–0:45: Laat de mooie NOVA-homepage zien, zonder editor.
- 0:45–1:30: Schakel blokmarkering in, klik hero en geselecteerde case.
- 1:30–2:30: Open echte editor, wijzig testtitel, sla op, controleer resultaat.
- 2:30–3:20: Voeg demo-artikel toe via collectie; toon overzicht/detail.
- 3:20–4:15: Toon formulier, configurator en personalisatie (of expliciete simulatielabels).
- 4:15–5:00: Wissel naar mobiel en Playground; eindig op de visuele homepage.

**Beveiligingsprincipe:** demo-content en wijzigingen zitten in een eigen demo-site/tenant conform bestaande architectuur. Publieke bezoekers mogen niets persistent wijzigen. Eventuele demo-login mag geen rechten creëren buiten huidige rollen. Alle demo-sends en boekingen gaan naar veilige testmodus. Geen echte betalingen of mails aan derden.

## 7. Playground: dekking van alle 43 blokken

**Structuur en tekst (13):** Header (hero), Tekstblok, Tekst met beeld, Kaartenrij, Flexibel blok, Conclusieregel, Statement, Veelgestelde vragen, Reeks stappen, Intake-stappen, Feiten, Tabel, Bewegende tekstband.

**Bewijs en mensen (9):** Bewijsstrook, Testimonial, Citaten-carrousel, Logostrook, Team, Sprekers, Statistieken, Portfolio, Rolvoorbeelden.

**Live data uit collecties (9):** Cases, Artikelen, Collectie (lijst), Partners/sponsoren, Partner uitgelicht, Reviews, Wedstrijden, Volgende wedstrijd, Agenda-inplanner.

**Conversie en formulieren (10):** Afsluitende oproep (CTA), Formulier, Formulierbouwer, Review verzamelen, Ledentoegang, Enquête / NPS, A/B-test, Personalisatie, Configurator, Prijskaarten / tickets.

**Overig (2):** Kaart en locatie, Aftelklok.

> Totaal **43**. Op overzicht filteren op de vijf categorieën. Elke detailkaart biedt live preview, CMS-velden en ondersteunde varianten. Maak geen nieuwe algemene bloktypes zonder noodzaak.

## 8. Interactie- en component-specificatie

- **Header:** transparant naar vaste toestand bij scroll, focus-/hovergedrag, actieve nav.
- **Hero:** H1, eyebrow, optionele subkop, twee CTA's, poster/afbeelding, optionele video alleen als bestaande blokvelden en consent/beheer dat toestaan.
- **Projectgrid:** wisselend kaartformaat mogelijk in eigen frontend, filters via bestaande collectie-velden. Bij lege collectie een verzorgde lege toestand.
- **Article cards:** categorie, datum, titel, leestijd alleen als berekend uit werkelijke inhoud, imagemasker, hover.
- **Timelines:** horizontaal desktop, verticaal mobiel, toetsenbordtoegankelijk.
- **Configurator:** prijs verandert na geldige selectie en komt uit demo-data; toont duidelijk dat het voorbeeld is.
- **Forms:** labels, validatie per veld, loading, success en error. Geen daadwerkelijke submit zonder bekende integratie.
- **Reviews / NPS:** toon interactiestaten; schrijf alleen via bestaande geautoriseerde module.
- **Collections:** filter/sort alleen als bestaand schema die velden ondersteunt; anders read-only selecties tonen.
- **CTA's:** interne bestemming geldig, geen dode links.
- **Motion:** stop bij reduced motion, geen scroll-jank; carrousel heeft pauze/handbediening waar nodig.

## 9. Mobiel, prestaties, SEO, toegankelijkheid

**Mobile first:** controleer op 375 px; contentkolommen worden gestapeld; tekst min. 16 px; tappunten 44×44 px; pagina's blijven leesbaar met lange koppen en lege optionele velden.

**WCAG 2.1 AA:** één H1 per pagina, logisch H2/H3, contrast ≥4,5:1 normale tekst, ≥3:1 grote tekst/UI, zichtbare keyboard focus, toegankelijke dialoog, alt-teksten, duidelijke foutmeldingen en labels. Verminderde beweging respecteren.

**Performance:** laad geen externe widgets op initiële render, gebruik lokale afbeeldingen/fonts, responsive `srcset`, lazy loading below fold, preloading alleen hero waar nodig, reserveer afmetingen, minimaliseer JS en hydrateer niet-interactieve delen niet onnodig. Meet Core Web Vitals; streef naar LCP <2,5s, CLS <0,1 en INP <200ms bij gangbare mobiele meetomstandigheden. Dit zijn doelen, geen gegarandeerde resultaten.

**SEO:** per pagina unieke titel/meta, canonical, Open Graph, sitemap, robots, semantische HTML en correcte collectie-URL's. Implementatie volgen via bestaande CMS-functies.

## 10. Bouwfasen (op volgorde)

1. **Inspectie:** onderzoek bestaande repo/stack/schema's/renderer/auth, pagina/sectie-API, mediapaden en collecties. Leg ondersteunde velden en ontbrekende mogelijkheden vast. Verander geen productieconfiguratie.
2. **Design foundation:** implementeer kleurmapping, lokaal font, spacing, responsive grid, globale navigatie/footer/knoppen.
3. **Homepage:** werkende verbinding met CMS, echte secties en eerste content. Visueel goedkeuren op 1440 en 375 px.
4. **Rijke pagina's:** Work, Journal, Experiences, Spaces, Community, About, Contact, Lab plus detailtemplates.
5. **Seed:** voeg alle benodigde fictieve collecties en media toe aan uitsluitend NOVA-demo-site; maak veilige reset.
6. **Playground:** geef alle 43 blokken een echte preview, inclusief staten/varianten/sportsectie.
7. **Demo Mode:** blokinspectie, bestaande editor-open, veilige contentpreview, responsive stand, guided tour, themasimulatie.
8. **Testen:** visueel, UX, toegankelijkheid, beveiliging van demo-data, navigatie en performance.

## 11. Acceptatiecriteria

- De publieke homepage voelt als een **premium creatieve website**, niet als een CMS-marketingpagina.
- Alle publieke links werken en alle routes hebben betekenisvolle content.
- Elke homepage-sectie heeft een aantoonbare correcte mapping naar bestaand CMS-blok en gebruikt echte CMS-data.
- Minimaal één hero, één project, één artikel, één teamlid en één formulier zijn vanuit One Studio aanpasbaar op de echte demosite, binnen bestaande rechten.
- Gedeelde CTA en collectiewijzigingen werken op meerdere relevante pagina's.
- Playground vermeldt precies 43 kernblokken; alle haalbare blokken renderen met werkelijke componenten. Eventuele ontbrekende werking is expliciet aangegeven.
- Sectievolgorde, gekozen varianten en vijf achtergrondstijlen blijven consistent tussen CMS en frontend.
- 375 px en 1440 px werken zonder horizontale overflow, onleesbare koppen of gebroken kaarten.
- Geen demo-actie kan de productiecontent van andere sites wijzigen, mailen of kosten veroorzaken.
- Geen onjuiste claim dat een gesimuleerde wijziging, boeking of betaling echt is opgeslagen.

## 12. Directe opdracht voor Claude Code

> **Rol:** je bent senior product designer, frontend engineer en CMS-integratiespecialist. Bouw de NOVA-demonstratiewebsite voor het bestaande Link & Lead One volgens dit ontwerp. Behandel deze briefing als product- en UX-specificatie, maar controleer altijd eerst de daadwerkelijke repo, data-/API-contracten, blokdefinities, permissies en beschikbare componenten. **Maak geen nieuw CMS, geen nieuwe standalone backend en geen gefingeerde live-integraties.** Bestaande namen en systeemgrenzen blijven behouden: Link & Lead One, One Studio, One Control, One AI.
>
> **Start met inspectie:** inventariseer gebruikte stack, structuur van pagina's en secties, lijst van precies 43 generieke bloktypen, de vijf achtergronden, varianten, collecties, gedeelde blokken en sitespecifieke blokken. Controleer of eigen frontend (model A) bestaande CMS-content veilig kan consumeren en welke shared rendercomponenten herbruikbaar zijn. Rapporteer kort de gevonden contracten en verschillen met deze briefing.
>
> **Bouw in de bestaande projectconventies** een apart NOVA-frontendsiteproject met alle routes, lokale assets, responsieve huisstijl en realistische fictieve content, gekoppeld aan een eigen demo-site/tenant in het CMS. De productieomgeving en andere websites blijven onaangeroerd. Zorg dat de belangrijkste homepage en detailpagina's als eerste werken. Daarna de volledige Playground met dekking van alle 43 generieke blokken, en als laatste een optioneel afschakelbare Demo Mode met selecteerbare blokken en koppeling naar de bestaande One Studio-editor. Voor functies die ontbreken, toon een eerlijke, nette `niet beschikbaar in deze demo`-stand; geen nepbackend.
>
> **Lever op:** werkende pagina's, documentatie van routes en blokmapping, demo-data en resetprocedure, screenshotvergelijking desktop/mobiel, e2e-navigatietests, testen van CMS-edit naar site en veiligheidscontrole van alle schrijfoperaties. Verifieer zelf of alle links, formulieren, responsieve toestanden, leeg/lange-contenttoestanden en `prefers-reduced-motion` werken. Meld na afloop exact welke onderdelen echt werken, welke alleen simulatie zijn en wat nog ontbreekt.
>
> **Werkvolgorde en prioriteit:** eerst visuele kwaliteit en correcte CMS-koppeling van homepage; daarna kernpagina's en content; daarna Playground; daarna presentatielaag en afwerking. De demo moet boven alles een prachtig voorbeeld zijn van wat je met Link & Lead One kunt maken.

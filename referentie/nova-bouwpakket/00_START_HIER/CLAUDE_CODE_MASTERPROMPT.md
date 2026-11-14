# OPDRACHT VOOR CLAUDE CODE — NOVA / LINK & LEAD ONE

Je krijgt een compleet visueel overdrachtspakket. Je opdracht is om het bestaande NOVA-ontwerp zo nauwkeurig mogelijk over te nemen in een **eigen frontend (model A)** die waar mogelijk rechtstreeks aan het bestaande CMS Link & Lead One wordt gekoppeld. NOVA is de visuele showcase, **de route `/one` is de expliciete productpromotie**. Het mag geen generieke SaaS-template worden.

## 1. Lees dit eerst, in deze volgorde

- `00_START_HIER/README.md`: context, beperkingen, licenties.
- `01_REFERENTIE/NOVA_visueel_ontwerp_origineel.html`: oorspronkelijk 1-op-1 ontwerp.
- `05_SCREENSHOTS/desktop/` en `05_SCREENSHOTS/mobiel/`: pagina's, mobiele referenties.
- `02_WEBSITE/index.html`, `styles/nova.css`, `scripts/nova-app.js`, `scripts/assets.js`: echte broncode met opgesplitste assets.
- `03_ELEMENTEN/design_tokens.json`, `03_ELEMENTEN/componenten/`, `03_ELEMENTEN/media/manifest.json`: stijlgids en alle elementen los.
- `04_CMS_MAPPING/43_kernblokken.json`, `04_CMS_MAPPING/paginas_en_blokken.json` en `06_SECTIES/`: CMS-mapping.
- `01_REFERENTIE/CMS_blokken_en_ontwerpregels.pdf`: **authoritatieve** grenzen van het CMS-blokontwerp. Lees alle 9 pagina's.
- `01_REFERENTIE/eerdere_bouwbriefing.md`: aanvullende doelstellingen, indien niet in conflict met bron en deze masterprompt.

## 2. Visueel contract — 1-op-1

Gebruik **bestaande DOM, CSS, teksten, afbeeldingen, kolomverhoudingen, marges en responsive regels** uit de bestanden in `02_WEBSITE/`. Herontwerp geen gedeelten omdat je een andere componentbibliotheek prettiger vindt. Vertaal alleen naar de bestaande repository-stack als dat noodzakelijk is. Verander geen hoofdtypografie, kleuren, spacing, aspect ratios, border radius, button states of volgorde zonder eerst een visueel verschilrapport.

Meet visuele verschillen voor de hoofdschermen bij desktop 1440×900 en mobiel 390×844; controleer daarnaast 375, 768 en 1280px. Doel: visueel zeer dicht bij de screenshots, met behoud van WCAG en technisch correcte layout. De screenshot is leidend, maar de live prototype-HTML is doorslaggevend bij onduidelijkheid.

Design tokens exact uit `03_ELEMENTEN/design_tokens.json`. Het originele prototype gebruikt o.a. `--night:#0B1127`, `--deep:#14204A`, `--cream:#F8F7F3`, `--mist:#E7EDF1`, `--lime:#DBF866`. Houd de 12 CMS-kleurvelden uit de PDF aan.

Gebruik de losse `.webp`-media, `.svg`-logo's/iconen en HTML-componenten. LET OP: de conceptbeelden zijn kleine crops uit een AI-designboard. Geef de originele crop weer bij de technische kopie; zet vervanging met nieuw hoogwaardig bronbeeld als losse vervolgstap op de lijst. Geen hotlinked beeldmateriaal, geen vreemde licenties, geen niet-geautoriseerde fonts.

## 3. Verkoopverhaal — essentieel

NOVA is visueel bewijs van de ontwerpvrijheid. Link & Lead One is het product. **Beide moeten zichtbaar zijn**, zonder dat de homepage in een verkooppagina verandert.

Verplicht:
- Subtiele maar duidelijke link naar `Het CMS` in hoofdnavigatie.
- Vast herkenbare CTA `Ontdek het CMS` in footer van elke NOVA-pagina.
- Zwevende `Bekijk CMS-design`-knop en label voor blokinspectie.
- Een schitterende `#/one`-promotiepagina die nu al is ontworpen in `nova-app.js` (`function one()`). Gebruik deze als exacte bouwbasis.
- Aantoonbare verwijzing op de website naar de blokkenbibliotheek en de vijf-minutentour.
- Een verkoopflow `homepage → CMS ontdekken → interactieve tour → blokken bekijken → aanvraag/demo afspraak`.
- Laat zien wat CMS-redacteurs kunnen beheren, niet alleen hoe mooi de frontend is.
- CTA's moeten bij livegang naar **de echte geconfigureerde demo-/contactbestemming** verwijzen. Geen verzonnen e-mailadressen, verkoopresultaten of niet-bestaande API's.
- Gebruik concrete waarde: 43 algemene blokken, 5 achtergronden, sitegebonden huisstijl, collecties voor cases/artikelen/team/reviews, formulierblokken, configurator, intake, personalisatie (volgens PDF). Geef alleen live claims als die in de repo zijn geverifieerd.
- Beloof geen AI-integraties, multi-tenant beveiliging, e-mailcampagnes of andere platformfeatures zonder code-/configuratiebewijs. Markeer `nog te koppelen`, `demo` of `concept` waar relevant.

## 4. Technische afspraken

1. Inspecteer **eerst** de huidige CMS-repository, database/schema, API, editor, rollen, site-instellingen en mediaroutes. Maak een tabel `bevestigd / ontbreekt / simulatie` voor ieder onderdeel. Gebruik geen vermoede endpoints.
2. Behoud model A: rijke eigen frontend, bestaande CMS-blokken en velden zijn inhoudsbron. Maak alleen nieuwe sitebloktypen of sitemodules wanneer geen kernblok past.
3. Gebruik de officiële 43 bloknamen uit `04_CMS_MAPPING`, niet zelf verzonnen varianten.
4. Bewerk productiegegevens of andere websites nooit. Gebruik een geautoriseerde, geïsoleerde NOVA-demo-site. Geen echte mails, facturen, boekingen of betalingen vanuit het prototype.
5. De huidige HTML is een **ontwerpbron**, geen productiearchitectuur. Bouw semantisch en schaalbaar volgens de reeds bestaande stack, zonder zichtbare afwijking.
6. Dynamische collecties: cases, artikelen, mensen, partners, reviews, ruimtes en events. Gebruik alleen velden die echt bestaan. Zorg voor lege-toestand, lange tekst, 1 versus veel items.
7. Demo Mode: blokinspectie, echte editorlink indien ondersteund, responsieve modus, themawissel en tour. Live opslaan uitsluitend met bestaande geautoriseerde flows; simulatie zichtbaar labelen.
8. Playground: 43 blokken, categorieën, varianten en vijf achtergronden. De 43 blokken zijn aanwezig in de PDF; de huidige concept-preview is niet gelijk aan 43 echte CMS renderers.
9. Interactie: geen dode links, geen nepformulier-success. Integreer een echte leadflow na configuratie, anders toon duidelijk een veilige demonstratiestatus.
10. Performance/UX: lokaal gehoste fonts, WebP/AVIF, `srcset`, lazy below-fold, keyboard/focus, contrast, reduced motion, één H1 per pagina, responsieve breedte 375px. Geen animatie die scroll of INP schaadt.

## 5. Schermen / routes

`/`, `/work`, `/work/:slug`, `/journal`, `/journal/:slug`, `/experiences`, `/experiences/:slug`, `/spaces`, `/spaces/:slug`, `/community`, `/about`, `/contact`, `/lab`, `/members`, `/playground`, `/playground/sports`, `/demo`, `/one`.

*Bouw ieder scherm zoals aangeleverd*. Geen extra standaardlayouts of herhalende SaaS-kaarten als de ontwerpen iets anders voorschrijven.

## 6. Losse UI-onderdelen

De map `03_ELEMENTEN/componenten/` bevat mark-up per element. Maak binnen de stack herbruikbare componenten met overeenkomende visuele output: site header, mobile nav, hero, section label, buttons, chips, card, case grid, article grid, stats, team, event schedule, formulier, CTA/footer, demo drawer, playground selector, promo hero/benefit card/ribbon. De feitelijke CSS-selectors staan in `nova.css`.

## 7. Bouwvolgorde en acceptatie

Fase A: repo-audit + contract met bestaande CMS-API; geen wijzigingen aan productie. 
Fase B: exacte homepage + nav/footer, 1440/390 screenshots vergelijken. 
Fase C: alle inhoudspagina's en detailtemplates visueel exact. 
Fase D: `Het CMS`-promotiepagina en werkende verkoopflow. 
Fase E: echte CMS-datakoppeling met afgeschermde demodata. 
Fase F: complete Playground, demo mode en formulier/boekingsstatussen.
Fase G: E2E, toegankelijkheid en performance met bewijs.

Acceptatie: exact ontwerp als referentie, alle 18 routes te bezoeken, 43 blokken in Playground, responsive zonder overflow, CTA's werken, marketingflow duidelijk, geen onjuiste claim over gekoppelde CMS-data, geen wijziging aan andere sites.

**Eerste actie:** geef een korte verificatietabel van de echte repo-functies, en leg vast hoe je dit pakket integreert zonder visuele concessies. Voer daarna de complete implementatie uit.

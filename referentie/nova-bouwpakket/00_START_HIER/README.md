# NOVA — complete overdracht voor Claude Code

## Wat hier echt in zit

1. `02_WEBSITE/index.html` is de navigeerbare, **klikbare frontend** (lokale bestanden, geen server of CMS-koppeling). Open via een lokale HTTP-server, bijvoorbeeld `python3 -m http.server 8080` vanuit `02_WEBSITE/`, en navigeer naar `http://localhost:8080/#/`.
2. `01_REFERENTIE/NOVA_visueel_ontwerp_origineel.html` is het **originele, volledig zelfstandig werkende** prototype van het goedgekeurde ontwerp. Dit is de visuele nulmeting; bewaar ongewijzigd.
3. `02_WEBSITE/styles/nova.css`, `02_WEBSITE/scripts/nova-app.js` en `02_WEBSITE/scripts/assets.js` zijn **losse sourcebestanden**. Dezelfde afbeeldingen staan los in `02_WEBSITE/assets/`.
4. `02_WEBSITE/#/one` is de **nieuwe productpromotie van Link & Lead One**. Deze is toegevoegd zonder de NOVA-vormtaal te vervangen.
5. `03_ELEMENTEN/` bevat de foto's, los bewerkbare SVG's, design tokens en individuele component-markup.
6. `05_SCREENSHOTS/` bevat desktopexamples en mobiele referenties; die zijn leidend voor een **visuele match**.
7. `06_SECTIES/` bevat de afzonderlijke secties per pagina inclusief CMS-labels; opnieuw te gebruiken als markup.
8. `04_CMS_MAPPING/` bevat de 43 blokken en de geplande pagina-naar-blokmapping.
9. `00_START_HIER/CLAUDE_CODE_MASTERPROMPT.md` bevat de volledige opdracht.

## Grenzen en eerlijkheid

- De demo draait **nog niet op een echte CMS-koppeling**. Niet presenteren alsof inhoudsbeheer, formulieren, AI, boekingen of betalingen al aan productie verbonden zijn.
- Het document *Ontwerpen voor het CMS* benoemt **43 algemene kernblokken**; het prototype laat visueel voorbeelden van deze blokken zien. Op sommige plekken zijn de blokken generieke previews, geen volledig geïmplementeerde productiecomponenten.
- De meeste foto's zijn AI-gegenereerde uitsneden uit één conceptboard en zijn **laag in resolutie**. Ze mogen als visuele placeholder dienen, maar moeten later door passende hoge-resolutiebeelden worden vervangen, met nieuwe visuele goedkeuring.
- Het losse NOVA-logo is als SVG hertekend en benadert het woordmerk. De browserweergave in de oorspronkelijke prototype-HTML blijft leidend voor typografie en exacte afmetingen.
- Aangegeven functies als One AI, CRM, rollen of API-connecties zijn **niet bevestigd door deze stukken**. Alleen opnemen na controle in de echte repo.
- De eigen frontend is model A uit het PDF-document. Ontwerpregels: 375px mobiel, één H1, 12 CMS-kleurvelden, vijf achtergronden, lokale fonts en WCAG AA.

## Minimale start

Open `01_REFERENTIE/NOVA_visueel_ontwerp_origineel.html` als referentie, `02_WEBSITE/index.html` als bewerkbare frontend, de schermbeelden, en lees de volledige masterprompt. De eerste taak van Claude Code is de echte CMS-repo inventariseren en aangeven welke functies koppeling of uitbreiding nodig hebben.

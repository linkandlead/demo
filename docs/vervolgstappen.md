# Vervolgstappen

1. **NOVA-demosite aanmaken en vullen** (eigenaar, zie `docs/cms-koppeling.md`). Daarna `CMS_URL` en
   `CMS_TOKEN` zetten.
2. **Aanvraagroute live zetten:** `CMS_LEAD_SITE_ID` van de Link & Lead-verkoopsite instellen, en een
   testaanvraag doen op een previewdeploy.
3. **Beelden** (bijgewerkt): de 17 verbeterde beelden (1200–1920 px, zonder ingebakken tekst) staan in
   `public/media`, met varianten van 640 en 1280 px via `srcset`. Bij `journal_arch` (50 px) en
   `space_atrium` (8 px) is een witte randstrook links weggesneden. Volgens de aanlevering zijn 16 beelden
   AI-uitsneden die vergroot zijn. Voor schermvullend gebruik blijft nieuwe fotografie of een native
   hoge-resolutiegeneratie mooier.
4. **"Collectie (lijst)"** staat in de PDF, maar heeft geen bloktype in de CMS-code. Kies: als kernblok
   bouwen in het CMS, of de PDF bijwerken. Ook de Spaces-ruimtes hebben geen collectie.
5. **Jaartal bij cases** bestaat niet in het CMS. Voeg een veld toe (migratie in het CMS), of laat het
   jaartal in NOVA weg.
6. **Live interacties** (optioneel, per stuk te beslissen): nieuwsbrief via `/api/cms/lead` met
   `soort: nieuwsbrief`, ledenlogin via `api/leden`, tickets via de Mollie-koppeling. Nu bewust
   gesimuleerd.
7. **Navigatie en merk uit het CMS** (`site.navigatie`, `site.merk`) gebruiken zodra de redactie die
   wil beheren.
8. **Lighthouse** draaien op de Vercel-preview (dat kon in deze omgeving niet).
